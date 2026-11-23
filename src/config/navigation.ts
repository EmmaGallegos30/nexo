import type { Route } from "next";

export const navigationItems = [
  { id: "today", label: "Hoy", href: "/", icon: "sun" },
  {
    id: "university",
    label: "Universidad",
    href: "/universidad",
    icon: "graduation",
  },
  { id: "study", label: "Estudio", href: "/estudio", icon: "book" },
  { id: "finances", label: "Finanzas", href: "/finanzas", icon: "wallet" },
] as const satisfies readonly {
  id: string;
  label: string;
  href: Route;
  icon: string;
}[];

export const planningViews = [
  { label: "Hoy", href: "/" },
  { label: "Semana", href: "/semana" },
] as const satisfies readonly { label: string; href: Route }[];

export function getActiveNavigation(pathname: string) {
  if (pathname === "/" || pathname === "/semana") {
    return navigationItems[0];
  }

  return navigationItems.find(
    ({ href }) =>
      href !== "/" && (pathname === href || pathname.startsWith(`${href}/`)),
  );
}
