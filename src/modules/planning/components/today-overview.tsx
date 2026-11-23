import {
  ArrowRight,
  CalendarDays,
  Compass,
  CornerDownRight,
} from "lucide-react";
import Link from "next/link";

import { PageHeading } from "@/components/layout/page-heading";
import { PlanningTabs } from "@/components/layout/planning-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TodayOverview() {
  return (
    <>
      <PageHeading
        eyebrow="Menos ruido. Más dirección."
        title="Hoy"
        description="Lo importante, a la vista. Una cosa a la vez."
      >
        <PlanningTabs />
      </PageHeading>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <Card>
          <div className="flex items-center gap-2 border-b px-6 py-4 text-xs font-medium text-muted-foreground sm:px-8">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            TU SIGUIENTE PASO
          </div>
          <EmptyState
            icon={<Compass />}
            title="Empieza por algo pequeño."
            description="Aquí verás la acción que sigue, con su horario y materiales. Por ahora puedes explorar tu espacio."
          >
            <Button asChild>
              <Link href="/universidad">
                Explorar Universidad <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </EmptyState>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <CalendarDays
                aria-hidden="true"
                className="mb-5 size-5 text-primary"
              />
              <h2 className="text-base font-medium">
                Dale un lugar a tu tiempo.
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Universidad y estudio compartirán una sola semana. Un plan que
                tenga espacio para la vida real.
              </p>
              <Link
                href="/semana"
                className="mt-5 inline-flex items-center gap-2 rounded text-sm font-medium text-primary"
              >
                Ver mi semana{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </CardContent>
          </Card>
          <div className="flex gap-3 px-2 py-1">
            <CornerDownRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-muted-foreground"
            />
            <p className="text-sm leading-7 text-muted-foreground">
              Tu espacio está empezando. Todavía no hay tareas, sesiones ni
              cuentas conectadas.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
        <p>Capturar. Reservar tiempo. Dar el siguiente paso.</p>
        <p>Base inicial · Sin datos de ejemplo</p>
      </div>
    </>
  );
}
