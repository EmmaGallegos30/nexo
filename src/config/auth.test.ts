import { describe, expect, it } from "vitest";

import { isProtectedPath, safeReturnPath } from "./auth";

describe("auth destinations", () => {
  it.each(["/", "/semana", "/universidad", "/estudio", "/finanzas", "/cuenta"])(
    "permits %s",
    (path) => {
      expect(safeReturnPath(path)).toBe(path);
      expect(isProtectedPath(path)).toBe(true);
    },
  );
  it.each([
    undefined,
    null,
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/%2fevil.test",
    "/acceso",
    "/auth/callback",
    "/finanzas?next=https://evil.test",
  ])("rejects unsafe destination %s", (path) =>
    expect(safeReturnPath(path)).toBe("/"),
  );
  it("protects nested areas but not similarly named public routes", () => {
    expect(isProtectedPath("/finanzas/movimientos")).toBe(true);
    expect(isProtectedPath("/finanzas-falsas")).toBe(false);
    expect(isProtectedPath("/acceso")).toBe(false);
  });
});
