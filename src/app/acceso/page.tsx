import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { safeReturnPath } from "@/config/auth";
import { readSupabaseEnvironment } from "@/config/supabase-environment";
import { AccessForm } from "@/modules/identity/components/access-form";
import { currentIdentity } from "@/server/supabase/identity";

export const metadata: Metadata = { title: "Acceso" };
export const dynamic = "force-dynamic";

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; estado?: string }>;
}) {
  const params = await searchParams;
  const next = safeReturnPath(params.next);
  const config = readSupabaseEnvironment(process.env);
  if (await currentIdentity()) redirect(next);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-12">
      <p className="mb-10 text-center text-3xl font-semibold tracking-[-0.07em]">
        nexo<span className="text-primary">.</span>
      </p>
      <Card>
        <CardContent>
          <Mail aria-hidden="true" className="mb-6 size-7 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Tu siguiente paso empieza aquí.
          </h1>
          <p className="mt-3 mb-7 text-sm leading-7 text-muted-foreground">
            Un enlace a tu correo. Un espacio solo para ti.
          </p>
          {params.estado === "enlace-invalido" && (
            <p
              role="alert"
              className="mb-5 rounded-lg border p-3 text-sm leading-6"
            >
              El enlace no es válido, ya se utilizó o se abrió en otro
              navegador. Solicita uno nuevo y ábrelo desde este navegador.
            </p>
          )}
          {config ? (
            <AccessForm next={next} />
          ) : (
            <div
              role="status"
              className="rounded-xl border bg-muted/50 p-4 text-sm leading-7"
            >
              <p className="font-medium">El acceso aún no está configurado.</p>
              <p className="mt-2 text-muted-foreground">
                Configura Supabase siguiendo <code>docs/supabase.md</code>. Tu
                espacio permanecerá protegido mientras tanto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-4" /> Universidad,
        estudio y finanzas en un espacio privado.
      </p>
    </main>
  );
}
