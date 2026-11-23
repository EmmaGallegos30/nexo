import { describe, expect, it } from "vitest";

import { getMigrationDatabaseUrl } from "./migration-environment";

describe("migration environment", () => {
  it.each([
    "postgres://migrator:example@localhost:5432/nexo",
    "postgresql://migrator:example@db.example.test:5432/postgres?sslmode=verify-full",
  ])("accepts a PostgreSQL migration URL: %s", (url) => {
    expect(getMigrationDatabaseUrl({ DATABASE_MIGRATION_URL: url })).toBe(url);
  });

  it.each([
    undefined,
    "",
    "  ",
    "invalid",
    "https://example.test/db",
    "postgres://localhost",
  ])("rejects missing or invalid migration configuration: %s", (url) => {
    expect(() =>
      getMigrationDatabaseUrl({ DATABASE_MIGRATION_URL: url }),
    ).toThrow("Configura DATABASE_MIGRATION_URL");
  });

  it("does not fall back to the runtime connection", () => {
    expect(() =>
      getMigrationDatabaseUrl({
        DATABASE_URL: "postgres://runtime:example@localhost:5432/nexo",
      }),
    ).toThrow("Configura DATABASE_MIGRATION_URL");
  });

  it("does not expose configuration input in an error", () => {
    const secret = "https://migrator:do-not-log-this@example.test/db";

    try {
      getMigrationDatabaseUrl({ DATABASE_MIGRATION_URL: secret });
      expect.unreachable("Invalid migration configuration must fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toContain("do-not-log-this");
    }
  });
});
