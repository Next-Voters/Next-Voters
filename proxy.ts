import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { protectedRegularRoutes } from "./data/protected-routes";
import { NextResponse, NextRequest } from "next/server";
import { isUserAuthenticatedAndHasAdminRole } from "./lib/auth";

const isPathAdminMatch = (route: string) => {
    return route.startsWith("/admin")
}

export default async function proxy(req: NextRequest) {
  const route = req.nextUrl.pathname;
  if (isPathAdminMatch(route) && !(await isUserAuthenticatedAndHasAdminRole())) {
    const homeURL = new URL("/", req.url);
    return NextResponse.redirect(homeURL);
  }

  if (protectedRegularRoutes.includes(route)) {
    // Check if Kinde environment variables are configured
    const kindeSiteUrl = process.env.KINDE_SITE_URL;
    const kindeIssuerUrl = process.env.KINDE_ISSUER_URL;
    
    // If Kinde is not configured, skip auth for development
    if (!kindeSiteUrl || !kindeIssuerUrl) {
      return NextResponse.next();
    }
    
    return withAuth(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ]
};