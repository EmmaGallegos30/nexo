import { describe, expect, it } from "vitest";

import { getActiveNavigation } from "./navigation";

describe("navigation context", () => {
  it.each(["/", "/semana"])("keeps %s inside Hoy", (pathname) => {
    expect(getActiveNavigation(pathname)?.id).toBe("today");
  });

  it.each([
    ["/universidad", "university"],
    ["/universidad/materias/calculo", "university"],
    ["/estudio", "study"],
    ["/finanzas/movimientos", "finances"],
  ])("maps %s to its own area", (pathname, id) => {
    expect(getActiveNavigation(pathname)?.id).toBe(id);
  });

  it.each(["/desconocida", "/universidad-falsa", "/semanal"])(
    "does not highlight an unrelated route: %s",
    (pathname) => {
      expect(getActiveNavigation(pathname)).toBeUndefined();
    },
  );
});
