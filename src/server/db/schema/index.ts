import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  pgPolicy,
  pgRole,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// auth.users belongs to Supabase, not to our migrations. Do not export it.
const authUsers = pgSchema("auth").table("users", {
  id: uuid("id").primaryKey(),
});
export const nexoSchema = pgSchema("nexo");
const runtimeRole = pgRole("nexo_app").existing();
const actorId = sql`nullif(current_setting('nexo.user_id', true), '')::uuid`;

export const profiles = nexoSchema
  .table(
    "profiles",
    {
      userId: uuid("user_id")
        .primaryKey()
        .references(() => authUsers.id, { onDelete: "cascade" }),
      displayName: varchar("display_name", { length: 80 }),
      locale: varchar("locale", { length: 10 }).notNull().default("es-MX"),
      currency: varchar("currency", { length: 3 }).notNull().default("MXN"),
      timeZone: text("time_zone").notNull().default("America/Mexico_City"),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (table) => [
      check("profiles_locale_check", sql`${table.locale} = 'es-MX'`),
      check("profiles_currency_check", sql`${table.currency} = 'MXN'`),
      pgPolicy("profiles_select_own", {
        for: "select",
        to: runtimeRole,
        using: sql`${table.userId} = ${actorId}`,
      }),
      pgPolicy("profiles_insert_own", {
        for: "insert",
        to: runtimeRole,
        withCheck: sql`${table.userId} = ${actorId}`,
      }),
      pgPolicy("profiles_update_own", {
        for: "update",
        to: runtimeRole,
        using: sql`${table.userId} = ${actorId}`,
        withCheck: sql`${table.userId} = ${actorId}`,
      }),
    ],
  )
  .enableRLS();

export const workspaces = nexoSchema
  .table(
    "workspaces",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      ownerUserId: uuid("owner_user_id")
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
      name: varchar("name", { length: 60 })
        .notNull()
        .default("Espacio personal"),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (table) => [
      unique("workspaces_owner_key").on(table.ownerUserId),
      unique("workspaces_id_owner_key").on(table.id, table.ownerUserId),
      check("workspaces_name_check", sql`length(trim(${table.name})) > 0`),
      pgPolicy("workspaces_select_own", {
        for: "select",
        to: runtimeRole,
        using: sql`${table.ownerUserId} = ${actorId}`,
      }),
      pgPolicy("workspaces_insert_own", {
        for: "insert",
        to: runtimeRole,
        withCheck: sql`${table.ownerUserId} = ${actorId}`,
      }),
      pgPolicy("workspaces_update_own", {
        for: "update",
        to: runtimeRole,
        using: sql`${table.ownerUserId} = ${actorId}`,
        withCheck: sql`${table.ownerUserId} = ${actorId}`,
      }),
    ],
  )
  .enableRLS();

export const memberships = nexoSchema
  .table(
    "memberships",
    {
      workspaceId: uuid("workspace_id").notNull(),
      userId: uuid("user_id")
        .notNull()
        .references(() => authUsers.id, { onDelete: "cascade" }),
      createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    },
    (table) => [
      primaryKey({ columns: [table.workspaceId, table.userId] }),
      unique("memberships_personal_user_key").on(table.userId),
      // Personal spaces only. Collaboration needs an explicit migration, not a relaxed policy.
      foreignKey({
        name: "memberships_workspace_owner_fk",
        columns: [table.workspaceId, table.userId],
        foreignColumns: [workspaces.id, workspaces.ownerUserId],
      }).onDelete("cascade"),
      pgPolicy("memberships_select_own", {
        for: "select",
        to: runtimeRole,
        using: sql`${table.userId} = ${actorId}`,
      }),
      pgPolicy("memberships_insert_own", {
        for: "insert",
        to: runtimeRole,
        withCheck: sql`${table.userId} = ${actorId}`,
      }),
    ],
  )
  .enableRLS();
