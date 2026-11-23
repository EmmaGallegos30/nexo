import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UniversityOverview() {
  return (
    <>
      <PageHeading
        eyebrow="De la entrega al siguiente paso"
        title="Universidad"
        description="Tu semestre, tus materias y un camino claro para avanzar."
      />
      <Card>
        <EmptyState
          icon={<GraduationCap />}
          title="Tu semestre empieza aquí."
          description="Aquí reunirás materias, tareas, proyectos y exámenes. La creación de tu primer semestre estará disponible en una próxima entrega."
        >
          <Button variant="outline" asChild>
            <Link href="/semana">
              Conocer la vista Semana <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </EmptyState>
      </Card>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        Semestre → Materias → Proyectos y tareas. También habrá lugar para
        pendientes generales, sin tener que asignarlos a una materia.
      </p>
    </>
  );
}
