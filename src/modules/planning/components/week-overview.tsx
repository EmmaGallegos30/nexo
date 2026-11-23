import { CalendarRange, LockKeyhole, MoveRight, Layers3 } from "lucide-react";

import { PageHeading } from "@/components/layout/page-heading";
import { PlanningTabs } from "@/components/layout/planning-tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";

export function WeekOverview() {
  return (
    <>
      <PageHeading
        eyebrow="Un solo calendario para todo"
        title="Tu semana"
        description="Cada compromiso en su lugar. Cada objetivo con tiempo para avanzar."
      >
        <PlanningTabs />
      </PageHeading>

      <Card>
        <EmptyState
          icon={<CalendarRange />}
          title="Primero tu tiempo. Después el plan."
          description="El calendario de bloques se habilitará cuando puedas crear tareas y definir tu disponibilidad. No necesitas llenar cada hora."
        />
        <div className="grid gap-5 border-t bg-muted/30 p-6 sm:grid-cols-3 sm:p-8">
          {[
            {
              icon: LockKeyhole,
              title: "Compromisos fijos",
              text: "Clases, trabajo y horarios que quieres proteger.",
            },
            {
              icon: Layers3,
              title: "Una capacidad compartida",
              text: "Universidad y estudio usan el mismo tiempo disponible.",
            },
            {
              icon: MoveRight,
              title: "Un plan ajustable",
              text: "Mover una sesión no cambia tu fecha de entrega.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon aria-hidden="true" className="mb-3 size-4 text-primary" />
              <h2 className="text-sm font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
