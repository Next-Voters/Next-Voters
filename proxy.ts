import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const isPathAdminMatch = (route: string) => {
  return route.startsWith("/admin");
};

export default async function proxy(req: NextRequest) {
  const route = req.nextUrl.pathname;

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
