import type { Route } from "next";

const returnPaths = [
  "/",
  "/semana",
  "/universidad",
  "/estudio",
  "/finanzas",
  "/cuenta",
] as const satisfies readonly Route[];

export function safeReturnPath(value: unknown): Route {
  return returnPaths.find((path) => path === value) ?? "/";
}

export function isProtectedPath(pathname: string) {
  return returnPaths.some(
    (path) =>
      pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
}

export const returnPathCookie = "nexo-return-to";
