import { defineConfig } from "drizzle-kit";

// Generation is local and does not require or connect to a database.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/*.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
});
