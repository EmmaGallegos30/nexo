"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { planningViews } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function PlanningTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Vistas de planificación"
      className="flex w-fit gap-1 rounded-xl border bg-muted/70 p-1"
    >
      {planningViews.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            pathname === href
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
