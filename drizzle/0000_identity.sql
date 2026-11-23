-- Hand-reviewed prelude: this role is reserved for Nexo's trusted server.
-- LOGIN/password are provisioned separately, never embedded in a migration.
CREATE ROLE nexo_app NOLOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
--> statement-breakpoint
CREATE SCHEMA "nexo";
--> statement-breakpoint
CREATE TABLE "nexo"."memberships" (
	"workspace_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id"),
	CONSTRAINT "memberships_personal_user_key" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "nexo"."memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "nexo"."profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(80),
	"locale" varchar(10) DEFAULT 'es-MX' NOT NULL,
	"currency" varchar(3) DEFAULT 'MXN' NOT NULL,
	"time_zone" text DEFAULT 'America/Mexico_City' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_locale_check" CHECK ("nexo"."profiles"."locale" = 'es-MX'),
	CONSTRAINT "profiles_currency_check" CHECK ("nexo"."profiles"."currency" = 'MXN')
);
--> statement-breakpoint
ALTER TABLE "nexo"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "nexo"."workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"name" varchar(60) DEFAULT 'Espacio personal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_owner_key" UNIQUE("owner_user_id"),
	CONSTRAINT "workspaces_id_owner_key" UNIQUE("id","owner_user_id"),
	CONSTRAINT "workspaces_name_check" CHECK (length(trim("nexo"."workspaces"."name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "nexo"."workspaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "nexo"."memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nexo"."memberships" ADD CONSTRAINT "memberships_workspace_owner_fk" FOREIGN KEY ("workspace_id","user_id") REFERENCES "nexo"."workspaces"("id","owner_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nexo"."profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nexo"."workspaces" ADD CONSTRAINT "workspaces_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "memberships_select_own" ON "nexo"."memberships" AS PERMISSIVE FOR SELECT TO "nexo_app" USING ("nexo"."memberships"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "memberships_insert_own" ON "nexo"."memberships" AS PERMISSIVE FOR INSERT TO "nexo_app" WITH CHECK ("nexo"."memberships"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "profiles_select_own" ON "nexo"."profiles" AS PERMISSIVE FOR SELECT TO "nexo_app" USING ("nexo"."profiles"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "profiles_insert_own" ON "nexo"."profiles" AS PERMISSIVE FOR INSERT TO "nexo_app" WITH CHECK ("nexo"."profiles"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "profiles_update_own" ON "nexo"."profiles" AS PERMISSIVE FOR UPDATE TO "nexo_app" USING ("nexo"."profiles"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid) WITH CHECK ("nexo"."profiles"."user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "workspaces_select_own" ON "nexo"."workspaces" AS PERMISSIVE FOR SELECT TO "nexo_app" USING ("nexo"."workspaces"."owner_user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "workspaces_insert_own" ON "nexo"."workspaces" AS PERMISSIVE FOR INSERT TO "nexo_app" WITH CHECK ("nexo"."workspaces"."owner_user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "workspaces_update_own" ON "nexo"."workspaces" AS PERMISSIVE FOR UPDATE TO "nexo_app" USING ("nexo"."workspaces"."owner_user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid) WITH CHECK ("nexo"."workspaces"."owner_user_id" = nullif(current_setting('nexo.user_id', true), '')::uuid);
--> statement-breakpoint
-- Defense in depth. Auth's browser roles have no access to this private schema.
REVOKE ALL ON SCHEMA nexo FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
REVOKE ALL ON ALL TABLES IN SCHEMA nexo FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
GRANT USAGE ON SCHEMA nexo TO nexo_app;
--> statement-breakpoint
GRANT SELECT, INSERT ON nexo.profiles, nexo.workspaces, nexo.memberships TO nexo_app;
--> statement-breakpoint
GRANT UPDATE (display_name, time_zone, updated_at) ON nexo.profiles TO nexo_app;
--> statement-breakpoint
GRANT UPDATE (name) ON nexo.workspaces TO nexo_app;
--> statement-breakpoint
ALTER TABLE nexo.profiles FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE nexo.workspaces FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE nexo.memberships FORCE ROW LEVEL SECURITY;
