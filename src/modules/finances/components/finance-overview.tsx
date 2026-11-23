import { Wallet } from "lucide-react";

import { PageHeading } from "@/components/layout/page-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function FinanceOverview() {
  return (
    <>
      <PageHeading
        eyebrow="Claridad antes de decidir"
        title="Finanzas"
        description="Gastos, ahorro y deudas, conectados con las decisiones de cada día."
      >
        <Badge>MXN · México</Badge>
      </PageHeading>
      <Card>
        <EmptyState
          icon={<Wallet />}
          title="Primero tus datos. Después los números."
          description="Todavía no hay cuentas ni movimientos. El registro financiero se habilitará en una próxima entrega; no mostraremos saldos ni estimaciones sin información real."
        />
        <div className="flex flex-wrap justify-center gap-2 border-t px-6 py-5">
          {[
            "Movimientos",
            "Ahorro",
            "Tarjetas y préstamos",
            "Compras esenciales",
          ].map((label) => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>
      </Card>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        Saldo, dinero disponible y crédito tendrán significados distintos. Los
        datos que falten se mostrarán como pendientes, nunca como ceros
        confiables.
      </p>
    </>
  );
}
