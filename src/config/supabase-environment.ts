import { z } from "zod";

function isPublicKey(key: string) {
  if (key.startsWith("sb_publishable_") && key.length > 20) return true;

  // Legacy anon keys are supported; secret/service-role keys must fail closed.
  try {
    const payload = key.split(".")[1];
    if (!payload) return false;
    return (
      JSON.parse(Buffer.from(payload, "base64url").toString()).role === "anon"
    );
  } catch {
    return false;
  }
}

const httpUrl = z.url({ protocol: /^https?$/ }).refine((value) => {
  try {
    const url = new URL(value);
    return (
      url.pathname === "/" &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password &&
      (url.protocol === "https:" ||
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    );
  } catch {
    return false;
  }
});
const configSchema = z.object({
  url: httpUrl,
  publishableKey: z.string().refine(isPublicKey),
  appUrl: httpUrl,
});

export function readSupabaseEnvironment(
  env: Record<string, string | undefined>,
) {
  const result = configSchema.safeParse({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    appUrl: env.APP_URL,
  });

  if (!result.success) return null;
  return { ...result.data, appUrl: new URL(result.data.appUrl).origin };
}

export function getSupabaseEnvironment() {
  const config = readSupabaseEnvironment(process.env);
  if (!config)
    throw new Error(
      "La configuración de acceso está incompleta o no es válida.",
    );
  return config;
}
