"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  PanelLeft,
  Plus,
  Settings2,
  Sun,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getActiveNavigation, navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

const navigationIcons = {
  sun: Sun,
  graduation: GraduationCap,
  book: BookOpen,
  wallet: Wallet,
};

function Navigation({
  collapsed = false,
  mobile = false,
}: {
  collapsed?: boolean;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const activeItem = getActiveNavigation(pathname);

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(mobile ? "grid grid-cols-4 gap-1" : "space-y-1.5")}
    >
      {navigationItems.map((item) => {
        const Icon = navigationIcons[item.icon];
        const active = activeItem?.id === item.id;

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary/8 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-0",
              mobile && "flex-col justify-center gap-1.5 px-1 py-2.5 text-xs",
            )}
          >
            <Icon aria-hidden="true" className="size-[18px] shrink-0" />
            <span className={cn(collapsed && "sr-only")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  workspaceName,
}: {
  children: ReactNode;
  workspaceName: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const activeItem = getActiveNavigation(pathname);

  return (
    <div
      className={cn(
        "min-h-dvh lg:grid",
        collapsed
          ? "lg:grid-cols-[84px_minmax(0,1fr)]"
          : "lg:grid-cols-[240px_minmax(0,1fr)]",
      )}
    >
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-card/70 px-5 py-8 lg:flex">
        <Link
          href="/"
          aria-label="Nexo, ir a Hoy"
          className={cn(
            "mb-12 flex w-fit items-center gap-2.5 rounded-lg",
            collapsed ? "mx-auto" : "ml-2",
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground"
          >
            n
          </span>
          {!collapsed && (
            <span className="text-[26px] font-semibold tracking-[-0.07em]">
              nexo<span className="text-primary">.</span>
            </span>
          )}
        </Link>

        <Navigation collapsed={collapsed} />

        <div className="mt-8 border-t pt-5">
          <Button
            variant="outline"
            className={cn("w-full", collapsed ? "px-0" : "justify-start")}
            disabled
            title="La captura universal se incorporará en D2"
            aria-label="Captura universal, disponible en una próxima entrega"
          >
            <Plus aria-hidden="true" />
            {!collapsed && "Capturar"}
          </Button>
          {!collapsed && (
            <p className="mt-2.5 px-1 text-xs text-muted-foreground">
              Próximamente · ⌘ / Ctrl K
            </p>
          )}
        </div>

        <div className="mt-auto space-y-5 pt-8">
          <Link
            href="/cuenta"
            title={collapsed ? "Mi cuenta" : undefined}
            className="flex min-h-11 items-center justify-center gap-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings2 aria-hidden="true" className="size-4 shrink-0" />
            <span className={cn(collapsed && "sr-only")}>Mi cuenta</span>
          </Link>
          {!collapsed && (
            <div className="rounded-xl bg-muted/70 p-4">
              <p className="text-sm font-medium">Una cosa a la vez.</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                No necesitas tener todo resuelto para empezar.
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn("w-full", !collapsed && "justify-start px-2")}
            aria-label={
              collapsed ? "Expandir navegación" : "Contraer navegación"
            }
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? (
              <ChevronRight aria-hidden="true" />
            ) : (
              <ChevronLeft aria-hidden="true" />
            )}
            {!collapsed && "Contraer menú"}
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex h-20 items-center justify-between gap-3 border-b px-5 sm:px-8 lg:px-12">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <PanelLeft
              aria-hidden="true"
              className="hidden size-4 text-muted-foreground sm:block"
            />
            <span className="font-semibold tracking-tight lg:hidden">
              nexo.
            </span>
            <span className="hidden max-w-40 truncate text-muted-foreground sm:inline-block">
              {workspaceName}
            </span>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span className="truncate font-medium">
              {activeItem?.label ?? "Mi cuenta"}
            </span>
          </div>
          <Link href="/cuenta" aria-label="Mi cuenta" className="rounded-full">
            <Badge className="shrink-0 bg-card">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary"
              />
              Mi cuenta
            </Badge>
          </Link>
        </header>

        <div className="border-b bg-card px-3 py-2 lg:hidden">
          <Navigation mobile />
        </div>

        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto max-w-7xl px-5 py-9 outline-none sm:px-8 sm:py-12 lg:px-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
