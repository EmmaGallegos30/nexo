import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

import { getMigrationDatabaseUrl } from "./src/config/migration-environment";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/*.ts",
  out: "./drizzle",
  dbCredentials: { url: getMigrationDatabaseUrl(process.env) },
  strict: true,
  verbose: true,
});
