"use client";

import { useAuth } from "@/wrappers/AuthProvider";
import Link from "next/link";

interface AuthButtonsProps {
  variant: "desktop" | "mobile";
}

export default function AuthButtons({ variant = "desktop" }: AuthButtonsProps) {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className={[
          "font-semibold text-[13.5px] text-gray-600 hover:text-gray-900 transition-colors",
          variant === "mobile" ? "block py-2" : "",
        ].join(" ")}
      >
        Log in
      </Link>
    );
  }

  const initial = user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className={`flex items-center gap-3 ${variant === "mobile" ? "py-2" : ""}`}>
      <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[12px] font-bold">
        {initial}
      </div>
      <button
        onClick={signOut}
        className="font-semibold text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
