import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  ensurePersonalSpace,
  updatePersonalPreferences,
} from "@/modules/identity/application/personal-space";
import { profiles, workspaces } from "@/server/db/schema";
import { withUserDatabase, closeUserDatabase } from "@/server/db/user-database";
import type { VerifiedIdentity } from "@/server/supabase/identity";

// These identities stand in for already-verified Supabase users. This suite
// tests real PostgreSQL/RLS, not the email delivery or signature verification.
const alice = {
  id: randomUUID(),
  email: "alice@example.test",
} as VerifiedIdentity;
const bob = { id: randomUUID(), email: "bob@example.test" } as VerifiedIdentity;
const charlie = randomUUID();
const admin = postgres(process.env.TEST_DATABASE_ADMIN_URL!, {
  max: 1,
  prepare: false,
});
const rawRuntime = postgres(process.env.DATABASE_URL!, {
  max: 1,
  prepare: false,
});

beforeAll(async () => {
  // Supabase owns auth.users and these roles. A disposable PostgreSQL fixture
  // supplies only those prerequisites; app migrations must not create auth.users.
  await admin.unsafe(
    "create schema auth; create table auth.users (id uuid primary key); create role anon; create role authenticated;",
  );
  await migrate(drizzle(admin), { migrationsFolder: "drizzle" });
  await promisify(execFile)(
    process.execPath,
    ["--import", "tsx", "scripts/provision-runtime.ts"],
    {
      env: {
        ...process.env,
        DATABASE_MIGRATION_URL: process.env.TEST_DATABASE_ADMIN_URL,
      },
    },
  );
  await admin`insert into auth.users (id) values (${alice.id}), (${bob.id}), (${charlie})`;
});

afterAll(async () => {
  await closeUserDatabase();
  await rawRuntime.end();
  await admin.end();
});

describe("personal identity and database isolation", () => {
  it("bootstraps one profile, workspace and membership per user, including concurrent retries", async () => {
    const spaces = await Promise.all(
      Array.from({ length: 5 }, () => ensurePersonalSpace(alice)),
    );
    await ensurePersonalSpace(bob);
    expect(new Set(spaces.map(({ workspace }) => workspace.id)).size).toBe(1);
    for (const table of ["profiles", "workspaces", "memberships"]) {
      const [row] = await admin.unsafe<{ count: number }[]>(
        `select count(*)::int as count from nexo.${table}`,
      );
      expect(row?.count).toBe(2);
    }
    expect(spaces[0]?.profile).toMatchObject({
      locale: "es-MX",
      currency: "MXN",
      timeZone: "America/Mexico_City",
    });
  });

  it("uses a restricted, non-owner role with forced RLS", async () => {
    const [role] =
      await rawRuntime`select current_user as name, rolsuper, rolbypassrls, rolcreaterole, rolcreatedb, rolinherit from pg_roles where rolname = current_user`;
    expect(role).toEqual({
      name: "nexo_app",
      rolsuper: false,
      rolbypassrls: false,
      rolcreaterole: false,
      rolcreatedb: false,
      rolinherit: false,
    });
    const tables =
      await admin`select relrowsecurity, relforcerowsecurity, pg_get_userbyid(relowner) as owner from pg_class join pg_namespace on pg_namespace.oid = relnamespace where nspname = 'nexo' and relkind = 'r'`;
    expect(tables).toHaveLength(3);
    tables.forEach((table) => {
      expect(table.relrowsecurity).toBe(true);
      expect(table.relforcerowsecurity).toBe(true);
      expect(table.owner).not.toBe("nexo_app");
    });
  });

  it("does not expose rows without a transaction identity", async () => {
    expect(await rawRuntime`select * from nexo.profiles`).toHaveLength(0);
    expect(await rawRuntime`select * from nexo.workspaces`).toHaveLength(0);
    expect(await rawRuntime`select * from nexo.memberships`).toHaveLength(0);
  });

  it("isolates reads and updates, even with another user's ID", async () => {
    await withUserDatabase(alice, async (transaction) => {
      expect(await transaction.select().from(profiles)).toHaveLength(1);
      expect(
        await transaction
          .select()
          .from(profiles)
          .where(eq(profiles.userId, bob.id)),
      ).toHaveLength(0);
      const updated = await transaction
        .update(profiles)
        .set({ displayName: "not allowed" })
        .where(eq(profiles.userId, bob.id))
        .returning();
      expect(updated).toHaveLength(0);
      expect(
        await transaction
          .select()
          .from(workspaces)
          .where(eq(workspaces.ownerUserId, bob.id)),
      ).toHaveLength(0);
    });
  });

  it("rejects creation on behalf of another user and ownership changes", async () => {
    await expect(
      withUserDatabase(alice, (transaction) =>
        transaction.execute(
          sql`insert into nexo.profiles (user_id) values (${bob.id})`,
        ),
      ),
    ).rejects.toThrow();
    await expect(
      withUserDatabase(alice, (transaction) =>
        transaction.execute(
          sql`update nexo.workspaces set owner_user_id = ${bob.id} where owner_user_id = ${alice.id}`,
        ),
      ),
    ).rejects.toThrow();
  });

  it("rejects cross-workspace membership at the foreign-key level", async () => {
    const bobSpace = await ensurePersonalSpace(bob);
    // Even a privileged insert cannot create this invalid relation.
    await expect(
      admin`insert into nexo.memberships (workspace_id, user_id) values (${bobSpace.workspace.id}, ${charlie})`,
    ).rejects.toMatchObject({ code: "23503" });
  });

  it("does not grant identity deletion or membership mutation to runtime", async () => {
    await expect(
      withUserDatabase(alice, (transaction) =>
        transaction.execute(
          sql`delete from nexo.workspaces where owner_user_id = ${bob.id}`,
        ),
      ),
    ).rejects.toThrow();
    await expect(
      withUserDatabase(alice, (transaction) =>
        transaction.execute(
          sql`update nexo.memberships set user_id = ${bob.id} where user_id = ${alice.id}`,
        ),
      ),
    ).rejects.toThrow();
  });

  it("persists own preferences without changing another user", async () => {
    await updatePersonalPreferences(alice, {
      displayName: "Alice",
      workspaceName: "Mi espacio",
      timeZone: "America/Tijuana",
    });
    expect((await ensurePersonalSpace(alice)).profile.displayName).toBe(
      "Alice",
    );
    expect((await ensurePersonalSpace(alice)).workspace.name).toBe(
      "Mi espacio",
    );
    expect((await ensurePersonalSpace(bob)).profile.displayName).toBeNull();
  });

  it("does not leak identity between reused pooled transactions or after rollback", async () => {
    const pids = new Set<number>();
    for (const identity of [alice, bob, alice, bob]) {
      const records = await rawRuntime.begin(async (transaction) => {
        await transaction`select set_config('nexo.user_id', ${identity.id}, true)`;
        const [backend] = await transaction`select pg_backend_pid() as pid`;
        pids.add(backend!.pid);
        return transaction`select user_id from nexo.profiles`;
      });
      expect(records.map((row) => row.user_id)).toEqual([identity.id]);
      expect(await rawRuntime`select * from nexo.profiles`).toHaveLength(0);
    }
    expect(pids.size).toBe(1);
    await expect(
      rawRuntime.begin(async (transaction) => {
        await transaction`select set_config('nexo.user_id', ${alice.id}, true)`;
        throw new Error("rollback fixture");
      }),
    ).rejects.toThrow("rollback fixture");
    expect(await rawRuntime`select * from nexo.profiles`).toHaveLength(0);
    expect(
      await withUserDatabase(bob, (transaction) =>
        transaction
          .select()
          .from(profiles)
          .where(and(eq(profiles.userId, bob.id))),
      ),
    ).toHaveLength(1);
  });

  it("denies browser Auth roles access to the private schema", async () => {
    for (const role of ["anon", "authenticated"]) {
      const [privileges] =
        await admin`select has_schema_privilege(${role}, 'nexo', 'USAGE') as usage`;
      expect(privileges?.usage).toBe(false);
    }
  });

  it("requires membership before changing preferences, and can repair interrupted setup", async () => {
    await admin`delete from nexo.memberships where user_id = ${alice.id}`;
    await expect(
      updatePersonalPreferences(alice, {
        displayName: "Should not save",
        workspaceName: "Should not save",
        timeZone: "America/Cancun",
      }),
    ).rejects.toThrow("membresía");
    const repaired = await ensurePersonalSpace(alice);
    expect(repaired.profile.displayName).toBe("Alice");
    expect(repaired.workspace.name).toBe("Mi espacio");
  });

  it("fails closed if the runtime role is accidentally elevated", async () => {
    try {
      await admin.unsafe("alter role nexo_app bypassrls");
      await expect(
        withUserDatabase(alice, (transaction) =>
          transaction.select().from(profiles),
        ),
      ).rejects.toThrow("rol restringido nexo_app");
    } finally {
      await admin.unsafe("alter role nexo_app nobypassrls");
    }
  });
});
