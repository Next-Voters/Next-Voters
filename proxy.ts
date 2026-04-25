import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const isPathAdminMatch = (route: string) => {
  return route.startsWith("/admin");
};

export default async function proxy(req: NextRequest) {
  const route = req.nextUrl.pathname;

  // OAuth fallback: when Supabase rejects the `redirectTo` we pass in
  // `signInWithOAuth` (because `${origin}/auth/callback?next=/local` doesn't
  // strict-match the project's whitelisted redirect URLs), Supabase falls
  // back to the project Site URL and appends `?code=…` there. The user
  // lands on `/` and our `/auth/callback` route never runs, so the PKCE
  // exchange never completes. Forward any `?code=` to `/auth/callback`
  // wherever it arrives so the existing handler can finish auth and route
  // the user to `/local`.
  const code = req.nextUrl.searchParams.get("code");
  if (code && route !== "/auth/callback") {
    const target = req.nextUrl.clone();
    target.pathname = "/auth/callback";
    return NextResponse.redirect(target);
  }

  // Admin routes: redirect to home (admin access disabled)
  if (isPathAdminMatch(route)) {
    const homeURL = new URL("/", req.url);
    return NextResponse.redirect(homeURL);
  }

  // Refresh Supabase auth session on every request
  return await updateSession(req);
}

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ]
};
