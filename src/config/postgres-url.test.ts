import { describe, expect, it } from "vitest";

import { isSecurePostgresUrl } from "./postgres-url";

describe("PostgreSQL transport configuration", () => {
  it.each([
    "postgres://user@localhost/nexo",
    "postgresql://user@127.0.0.1/nexo",
    "postgres://user@example.test/nexo?sslmode=verify-full",
  ])("accepts secure or loopback URL: %s", (url) =>
    expect(isSecurePostgresUrl(url)).toBe(true),
  );
  it.each([
    "postgres://user@example.test/nexo",
    "postgres://user@example.test/nexo?sslmode=require",
    "postgres://user@example.test/nexo?sslmode=disable",
    "postgres://user@example.test/nexo?sslmode=verify-full&sslmode=disable",
    "https://user@example.test/nexo?sslmode=verify-full",
  ])("rejects insecure or ambiguous URL: %s", (url) =>
    expect(isSecurePostgresUrl(url)).toBe(false),
  );
});
