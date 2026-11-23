import { describe, expect, it } from "vitest";

import { readSupabaseEnvironment } from "./supabase-environment";

const environment = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    "sb_publishable_example_for_configuration",
  APP_URL: "http://localhost:3000",
};

describe("Supabase configuration", () => {
  it("accepts a publishable key and canonical origin", () => {
    expect(readSupabaseEnvironment(environment)?.appUrl).toBe(
      "http://localhost:3000",
    );
  });
  it("accepts only legacy anon JWT keys", () => {
    const jwt = (role: string) =>
      `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
    expect(
      readSupabaseEnvironment({
        ...environment,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("anon"),
      }),
    ).not.toBeNull();
    expect(
      readSupabaseEnvironment({
        ...environment,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: jwt("service_role"),
      }),
    ).toBeNull();
  });
  it.each(["sb_secret_never_public", "invalid", ""])(
    "rejects unsafe key %s",
    (key) =>
      expect(
        readSupabaseEnvironment({
          ...environment,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
        }),
      ).toBeNull(),
  );
  it.each([
    "https://example.test/path",
    "https://user:password@example.test",
    "javascript:alert(1)",
    "https://example.test?next=evil",
    "https://example.test#fragment",
  ])("rejects noncanonical APP_URL %s", (url) =>
    expect(
      readSupabaseEnvironment({ ...environment, APP_URL: url }),
    ).toBeNull(),
  );
  it("fails closed without configuration", () =>
    expect(readSupabaseEnvironment({})).toBeNull());
  it("requires HTTPS outside loopback", () => {
    expect(
      readSupabaseEnvironment({
        ...environment,
        APP_URL: "http://nexo.example.test",
      }),
    ).toBeNull();
    expect(
      readSupabaseEnvironment({
        ...environment,
        NEXT_PUBLIC_SUPABASE_URL: "http://example.supabase.co",
      }),
    ).toBeNull();
  });
  it.each(["not-a-url", "", "https://", "  "])(
    "handles malformed origins without throwing: %s",
    (value) => {
      expect(
        readSupabaseEnvironment({ ...environment, APP_URL: value }),
      ).toBeNull();
      expect(
        readSupabaseEnvironment({
          ...environment,
          NEXT_PUBLIC_SUPABASE_URL: value,
        }),
      ).toBeNull();
    },
  );
});
