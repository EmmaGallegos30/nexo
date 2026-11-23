import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isProtectedPath, safeReturnPath } from "@/config/auth";
import { readSupabaseEnvironment } from "@/config/supabase-environment";

export async function proxy(request: NextRequest) {
  const config = readSupabaseEnvironment(process.env);
  let response = NextResponse.next({ request });

  if (config) {
    const supabase = createServerClient(config.url, config.publishableKey, {
      cookieOptions: {
        httpOnly: true,
        secure: config.appUrl.startsWith("https:"),
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, cacheHeaders) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(cacheHeaders ?? {}).forEach(([name, value]) =>
            response.headers.set(name, value),
          );
        },
      },
    });

    const { data } = await supabase.auth.getClaims();
    if (isProtectedPath(request.nextUrl.pathname) && !data?.claims)
      response = redirectToAccess(request, response);
  } else if (isProtectedPath(request.nextUrl.pathname)) {
    response = redirectToAccess(request, response);
  }

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function redirectToAccess(request: NextRequest, previous: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = "/acceso";
  url.search = "";
  const destination = safeReturnPath(request.nextUrl.pathname);
  if (destination !== "/") url.searchParams.set("next", destination);
  const response = NextResponse.redirect(url);
  previous.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
