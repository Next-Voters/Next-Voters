"use client";

import { useAuth } from "@/wrappers/AuthProvider";
import { useSubscription } from "@/hooks/use-subscription";
import { TierBadge } from "@/components/local/tier-badge";
import Link from "next/link";

interface AuthButtonsProps {
  variant: "desktop" | "mobile";
}

export default function AuthButtons({ variant = "desktop" }: AuthButtonsProps) {
  const { user, isLoading, signOut } = useAuth();
  const { tier } = useSubscription();

  if (isLoading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className={[
          "inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold rounded-full transition-colors",
          variant === "mobile" ? "px-5 py-2.5" : "px-5 py-2",
        ].join(" ")}
      >
        Log in
      </Link>
    );
  }

  const initial = user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className={`flex items-center gap-3 ${variant === "mobile" ? "py-2" : ""}`}>
      <div className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-[12px] font-bold">
        {initial}
      </div>
      <TierBadge tier={tier} />
      <button
        onClick={signOut}
        className="font-medium text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
