"use client";

import { Button } from "@/components/ui/button";

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="rounded-xl border bg-card p-6">
      <h2 className="text-xl font-medium">No pudimos abrir esta vista.</h2>
      <p className="mt-3 mb-5 text-sm leading-7 text-muted-foreground">
        Tus datos no se han sustituido por información de ejemplo. Comprueba la
        conexión y vuelve a intentarlo.
      </p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  );
}
