import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function StudyOverview() {
  return (
    <>
      <PageHeading
        eyebrow="Aprender con dirección"
        title="Estudio"
        description="Convierte lo que quieres aprender en una ruta que puedas seguir."
      />
      <Card>
        <EmptyState
          icon={<BookOpen />}
          title="Una meta. Una primera acción."
          description="Tus cursos y metas de aprendizaje vivirán aquí. Podrás empezar sin diseñar toda la ruta; la creación de metas llegará en una próxima entrega."
        >
          <Button variant="outline" asChild>
            <Link href="/semana">
              Conocer la vista Semana <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </EmptyState>
      </Card>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        Meta → Hitos → Tareas. El avance del curso y lo que ya puedes hacer se
        mostrarán por separado.
      </p>
    </>
  );
}
