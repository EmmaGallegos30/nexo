"use server";

import { revalidatePath } from "next/cache";

import { preferencesSchema } from "@/modules/identity/domain/preferences";
import { requirePersonalSpace } from "@/server/supabase/identity";
import { updatePersonalPreferences } from "./personal-space";

export async function savePreferences(
  _previous: { message: string; success: boolean },
  form: FormData,
) {
  const { identity } = await requirePersonalSpace();
  const result = preferencesSchema.safeParse(Object.fromEntries(form));
  if (!result.success)
    return {
      message: result.error.issues[0]?.message ?? "Revisa los datos.",
      success: false,
    };
  try {
    await updatePersonalPreferences(identity, result.data);
  } catch {
    return {
      message: "No pudimos guardar tus cambios. Inténtalo de nuevo.",
      success: false,
    };
  }
  revalidatePath("/", "layout");
  return { message: "Cambios guardados.", success: true };
}
