"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/modules/identity/application/auth-actions";
import { SignOutButton } from "@/modules/identity/components/sign-out-button";

export default function ApplicationError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">
        No pudimos preparar tu espacio.
      </h1>
      <p className="mt-4 mb-6 text-sm leading-7 text-muted-foreground">
        Comprueba la configuración de acceso y base de datos si es tu primera
        instalación. Si ya utilizabas Nexo, vuelve a intentarlo en unos
        momentos.
      </p>
      <Button onClick={reset}>Intentar de nuevo</Button>
      <form action={signOut} className="mt-4">
        <SignOutButton />
      </form>
    </main>
  );
}
