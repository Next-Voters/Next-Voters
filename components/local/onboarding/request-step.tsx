"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { clearPendingAction, writePendingAction } from "@/lib/pending-action";
import { submitRegionWaitlist } from "@/server-actions/request-region";
import { OnboardingState } from "./types";

interface Props {
  state: OnboardingState;
  referralCode: string | null;
  onContinue: () => void;
}

export function RequestStep({ state, referralCode, onContinue }: Props) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const city = state.cityRequest?.city ?? "";

  const handleAuthedSubmit = async () => {
    setError(null);
    if (!user?.email) {
      setError("Please sign in to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitRegionWaitlist({
        city,
        voterEmail: user.email,
        referralCode: referralCode || undefined,
      });
      if (result.ok === false) {
        setError(result.error);
        return;
      }
      onContinue();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    // Carry requested city via cookie (see lib/pending-action.ts for why).
    writePendingAction({
      type: "request",
      city,
      referralCode: referralCode || null,
    });
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/local/onboarding")}`,
      },
    });
    if (oauthError) {
      clearPendingAction();
      setError(oauthError.message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
        We don&rsquo;t cover{" "}
        <span className="font-semibold text-gray-900">{city}</span> yet. Sign in
        with Google and we&rsquo;ll email you the moment it launches.
      </p>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="mb-4 text-red-700 text-[13px] bg-red-50 border border-red-200 rounded-lg px-3 py-2"
        >
          {error}
        </p>
      )}

      {user ? (
        <button
          type="button"
          onClick={handleAuthedSubmit}
          disabled={submitting}
          className="w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15.5px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50"
        >
          {submitting ? "Adding you…" : `Notify me about ${city}`}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-3 min-h-[48px] px-6 py-3 text-[15px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm disabled:opacity-60"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          {submitting ? "Redirecting…" : "Continue with Google"}
        </button>
      )}

      <p className="mt-4 text-[12px] text-gray-400">
        No spam, no password. Unsubscribe any time.
      </p>
    </div>
  );
}
