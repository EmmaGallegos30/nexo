"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { returnPathCookie, safeReturnPath } from "@/config/auth";
import { getSupabaseEnvironment } from "@/config/supabase-environment";
import { createSupabaseServerClient } from "@/server/supabase/server";

export type AccessState = {
  status: "idle" | "sent" | "error";
  message: string;
};

export async function requestAccessLink(
  _previous: AccessState,
  form: FormData,
): Promise<AccessState> {
  const result = z
    .string()
    .trim()
    .email("Escribe un correo válido.")
    .max(254)
    .safeParse(form.get("email"));
  if (!result.success)
    return { status: "error", message: "Escribe un correo válido." };

  try {
    const config = getSupabaseEnvironment();
    const store = await cookies();
    store.set(returnPathCookie, safeReturnPath(form.get("next")), {
      httpOnly: true,
      secure: config.appUrl.startsWith("https:"),
      sameSite: "lax",
      path: "/auth/callback",
      maxAge: 3600,
    });
    const supabase = await createSupabaseServerClient({ writeCookies: true });
    const { error } = await supabase.auth.signInWithOtp({
      email: result.data,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${config.appUrl}/auth/callback`,
      },
    });
    if (error) {
      return {
        status: "error",
        message:
          error.status === 429
            ? "Espera un momento antes de solicitar otro enlace."
            : "No pudimos enviar el enlace. Inténtalo de nuevo más tarde.",
      };
    }
    return {
      status: "sent",
      message:
        "Revisa tu correo y abre el enlace en este mismo navegador. Si no aparece, revisa también spam.",
    };
  } catch {
    return {
      status: "error",
      message:
        "El servicio de acceso no está disponible. Inténtalo de nuevo más tarde.",
    };
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient({ writeCookies: true });
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) redirect("/cuenta?estado=cierre-fallido");
  revalidatePath("/", "layout");
  redirect("/acceso");
}
