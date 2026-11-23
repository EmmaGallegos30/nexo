import { describe, expect, it } from "vitest";

import { getRuntimeDatabaseUrl } from "./database-environment";

describe("runtime database configuration", () => {
  it.each([
    "postgres://nexo_app@localhost/nexo",
    "postgresql://nexo_app.project:example@pool.example.test/postgres?sslmode=verify-full",
  ])("accepts only a dedicated runtime connection: %s", (url) =>
    expect(getRuntimeDatabaseUrl({ DATABASE_URL: url })).toBe(url),
  );
  it.each([
    undefined,
    "",
    "postgres://postgres:secret@localhost/postgres",
    "postgres://nexo_app@localhost",
    "https://nexo_app:secret@example.test/db",
  ])("rejects missing or unsafe configuration: %s", (url) => {
    expect(() => getRuntimeDatabaseUrl({ DATABASE_URL: url })).toThrow(
      "rol restringido nexo_app",
    );
  });
});
