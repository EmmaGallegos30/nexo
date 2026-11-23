import { z } from "zod";

export const defaultPreferences = {
  locale: "es-MX",
  currency: "MXN",
  timeZone: "America/Mexico_City",
} as const;

export const preferencesSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80, "Usa hasta 80 caracteres para tu nombre."),
  workspaceName: z
    .string()
    .trim()
    .min(1, "Escribe un nombre para tu espacio.")
    .max(60, "Usa hasta 60 caracteres para tu espacio."),
  timeZone: z
    .string()
    .max(80)
    .refine((value) => {
      try {
        new Intl.DateTimeFormat("es-MX", { timeZone: value }).format();
        return true;
      } catch {
        return false;
      }
    }, "Selecciona una zona horaria válida."),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
