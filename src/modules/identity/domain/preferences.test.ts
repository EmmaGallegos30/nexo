import { describe, expect, it } from "vitest";

import { preferencesSchema } from "./preferences";

const values = {
  displayName: "Nexo",
  workspaceName: "Mi espacio",
  timeZone: "America/Tijuana",
};
describe("preferences", () => {
  it("accepts valid preferences and trims names", () => {
    expect(
      preferencesSchema.parse({ ...values, displayName: " Nexo " }).displayName,
    ).toBe("Nexo");
  });
  it("allows an empty optional display name", () =>
    expect(
      preferencesSchema.safeParse({ ...values, displayName: "" }).success,
    ).toBe(true));
  it("rejects unknown zones and blank workspace names", () => {
    expect(
      preferencesSchema.safeParse({ ...values, timeZone: "Mars/Unknown" })
        .success,
    ).toBe(false);
    expect(
      preferencesSchema.safeParse({ ...values, workspaceName: " " }).success,
    ).toBe(false);
  });
});
