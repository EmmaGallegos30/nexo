import type { Metadata } from "next";

import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "@/modules/identity/application/auth-actions";
import { PreferencesForm } from "@/modules/identity/components/preferences-form";
import { SignOutButton } from "@/modules/identity/components/sign-out-button";
import { requirePersonalSpace } from "@/server/supabase/identity";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { identity, workspace, profile } = await requirePersonalSpace();
  const { estado } = await searchParams;
  return (
    <>
      <PageHeading
        eyebrow="Un espacio a tu medida"
        title="Mi cuenta"
        description="Solo lo necesario para que Nexo se adapte a ti."
      />
      <Card>
        <CardContent>
          <h2 className="mb-6 text-base font-medium">Preferencias</h2>
          <PreferencesForm
            displayName={profile.displayName ?? ""}
            workspaceName={workspace.name}
            timeZone={profile.timeZone}
          />
          <div className="mt-10 border-t pt-6">
            <p className="text-sm break-words text-muted-foreground">
              Sesión de {identity.email}
            </p>
            {estado === "cierre-fallido" && (
              <p role="alert" className="mt-3 text-sm">
                No pudimos cerrar la sesión. Inténtalo de nuevo.
              </p>
            )}
            <form action={signOut} className="mt-4">
              <SignOutButton />
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Solo en este navegador.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
