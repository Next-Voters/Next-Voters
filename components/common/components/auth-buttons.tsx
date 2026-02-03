"use client";

import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function AuthButtons() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  if (isLoading) return null; // or a spinner

  return isAuthenticated ? (
    <LogoutLink className="block p-2 text-gray-700 hover:bg-gray-100 rounded w-full text-left">
      Sign Out
    </LogoutLink>
  ) : (
    <LoginLink className="block p-2 text-gray-700 hover:bg-gray-100 rounded w-full text-left">
      Sign In
    </LoginLink>
  );
}
