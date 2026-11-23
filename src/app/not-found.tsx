import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium text-primary">404 · Nexo</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Esta página no está aquí.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Puedes volver a Hoy y continuar desde ahí.
      </p>
      <Button asChild className="mt-7">
        <Link href="/">
          <ArrowLeft aria-hidden="true" /> Volver a Hoy
        </Link>
      </Button>
    </main>
  );
}
