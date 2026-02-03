"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function AuthButtons() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return null;

  const base =
    "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300";

  const desktop =
    "hidden md:inline-flex px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800";

  const mobile =
    "md:hidden w-full justify-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded";

  const className = `${base} ${desktop} ${mobile}`;

  return isAuthenticated ? (
    <LogoutLink className={className}>
      Sign Out
    </LogoutLink>
  ) : (
    <LoginLink className={className}>
      Sign In
    </LoginLink>
  );
}
