import "server-only";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { VerifiedIdentity } from "@/server/supabase/identity";
import { getRuntimeDatabaseUrl } from "@/config/database-environment";
import * as schema from "./schema";

type Database = ReturnType<typeof createDatabase>;
export type UserTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

function createDatabase() {
  const url = getRuntimeDatabaseUrl(process.env);
  // No prepared statements: compatible with transaction poolers.
  const client = postgres(url, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}

let database: Database | undefined;

export async function closeUserDatabase() {
  const current = database;
  database = undefined;
  if (current) await current.$client.end({ timeout: 5 });
}

export async function withUserDatabase<T>(
  identity: VerifiedIdentity,
  operation: (transaction: UserTransaction) => Promise<T>,
): Promise<T> {
  database ??= createDatabase();

  return database.transaction(async (transaction) => {
    const [role] = await transaction.execute<{
      name: string;
      unsafe: boolean;
    }>(sql`select current_user as name, (rolsuper or rolbypassrls or rolcreaterole or rolcreatedb or rolinherit
             or exists (select 1 from pg_auth_members where member = pg_roles.oid)
             or exists (select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'nexo' and c.relowner = pg_roles.oid)) as unsafe
           from pg_roles where rolname = current_user`);

    if (!role || role.name !== "nexo_app" || role.unsafe) {
      throw new Error(
        "La conexión de aplicación debe usar el rol restringido nexo_app.",
      );
    }

    // true means SET LOCAL: commits, rollbacks and pooled reuse cannot retain this identity.
    await transaction.execute(
      sql`select set_config('nexo.user_id', ${identity.id}, true)`,
    );
    return operation(transaction);
  });
}
