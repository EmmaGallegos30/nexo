import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { returnPathCookie, safeReturnPath } from "@/config/auth";
import { readSupabaseEnvironment } from "@/config/supabase-environment";
import { createSupabaseServerClient } from "@/server/supabase/server";

export async function GET(request: NextRequest) {
  const config = readSupabaseEnvironment(process.env);
  const base = config?.appUrl ?? request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  let destination = "/acceso?estado=enlace-invalido";

  if (config && code && request.nextUrl.origin === config.appUrl) {
    try {
      const supabase = await createSupabaseServerClient({ writeCookies: true });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const store = await cookies();
        destination = safeReturnPath(store.get(returnPathCookie)?.value);
        store.set(returnPathCookie, "", {
          path: "/auth/callback",
          maxAge: 0,
          httpOnly: true,
          sameSite: "lax",
          secure: config.appUrl.startsWith("https:"),
        });
      }
    } catch {
      // Never reflect auth codes, tokens, or provider messages in a URL/log.
    }
  }

  const response = NextResponse.redirect(new URL(destination, base));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
