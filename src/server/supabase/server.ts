import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnvironment } from "@/config/supabase-environment";

export async function createSupabaseServerClient({
  writeCookies = false,
}: { writeCookies?: boolean } = {}) {
  const config = getSupabaseEnvironment();
  const store = await cookies();

  return createServerClient(config.url, config.publishableKey, {
    cookieOptions: {
      httpOnly: true,
      secure: config.appUrl.startsWith("https:"),
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll(cookiesToSet) {
        // Server Components are read-only; proxy.ts refreshes their cookies first.
        // Actions and handlers opt in so write errors are never silently swallowed.
        if (!writeCookies) return;
        cookiesToSet.forEach(({ name, value, options }) =>
          store.set(name, value, options),
        );
      },
    },
  });
}
