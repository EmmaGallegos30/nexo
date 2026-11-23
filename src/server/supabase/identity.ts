import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { readSupabaseEnvironment } from "@/config/supabase-environment";
import { ensurePersonalSpace } from "@/modules/identity/application/personal-space";
import { createSupabaseServerClient } from "./server";

declare const verified: unique symbol;
export type VerifiedIdentity = Readonly<{
  id: string;
  email: string;
  [verified]: true;
}>;

export const currentIdentity = cache(
  async (): Promise<VerifiedIdentity | null> => {
    if (!readSupabaseEnvironment(process.env)) return null;
    const supabase = await createSupabaseServerClient();
    // Authoritative lookup, not the user object from an unverified session cookie.
    const { data, error } = await supabase.auth.getUser();
    if (error && (!error.status || error.status >= 500)) {
      throw new Error(
        "El servicio de acceso no está disponible. Vuelve a intentarlo.",
      );
    }
    if (
      error ||
      !data.user?.email ||
      !data.user.email_confirmed_at ||
      data.user.is_anonymous
    )
      return null;
    return { id: data.user.id, email: data.user.email } as VerifiedIdentity;
  },
);

export const requireIdentity = cache(async () => {
  const identity = await currentIdentity();
  if (!identity) redirect("/acceso");
  return identity;
});

// React cache is request-local, never a cross-user application cache.
export const requirePersonalSpace = cache(async () => {
  const identity = await requireIdentity();
  return { identity, ...(await ensurePersonalSpace(identity)) };
});
