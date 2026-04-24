"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  ONBOARDING_STORAGE_KEY,
  readOnboardingBlob,
  type StoredOnboardingBlob,
} from "@/components/local/onboarding/use-onboarding-state";
import { submitRegionWaitlist } from "@/server-actions/request-region";

type ResumeStatus =
  | { kind: "redirecting"; label: string }
  | { kind: "already_subscribed" }
  | { kind: "error"; message: string };

export default function ResumePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<ResumeStatus>({
    kind: "redirecting",
    label: "Resuming your progress…",
  });
  const [retryKey, setRetryKey] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/local/onboarding/signup?error=oauth_failed");
      return;
    }

    const blob = readOnboardingBlob();
    if (!blob) {
      router.replace("/local/onboarding");
      return;
    }

    if (blob.mode === "request") {
      const city = blob.cityRequest?.city;
      if (!city) {
        router.replace("/local/onboarding");
        return;
      }
      if (firedRef.current) return;
      firedRef.current = true;

      setStatus({
        kind: "redirecting",
        label: `Adding ${city} to your waitlist…`,
      });

      (async () => {
        try {
          const result = await submitRegionWaitlist({
            city,
            voterEmail: user.email,
            referralCode: blob.referralCode || undefined,
          });
          if (result.ok === false) {
            setStatus({
              kind: "error",
              message: result.error ?? "We couldn't save your request. Please try again.",
            });
            return;
          }
          const updated: StoredOnboardingBlob = {
            ...blob,
            step: 3,
            updatedAt: Date.now(),
          };
          window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
          router.replace("/local/onboarding");
        } catch {
          setStatus({
            kind: "error",
            message: "We couldn't reach the waitlist service. Please try again.",
          });
        }
      })();
      return;
    }

    // Subscribe mode
    if (
      !blob.pendingPlan ||
      !blob.language ||
      blob.topics.length === 0 ||
      !blob.city
    ) {
      router.replace("/local/onboarding");
      return;
    }

    if (firedRef.current) return;
    firedRef.current = true;

    setStatus({ kind: "redirecting", label: "Redirecting to secure checkout…" });

    const run = async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: blob.pendingPlan,
            city: blob.city,
            language: blob.language,
            topics: blob.topics,
            cityRequest: blob.cityRequest,
            referralCode: blob.referralCode || undefined,
          }),
        });

        if (res.status === 409) {
          setStatus({ kind: "already_subscribed" });
          return;
        }

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }

        setStatus({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
      } catch {
        setStatus({
          kind: "error",
          message: "We couldn't reach checkout. Please try again.",
        });
      }
    };

    run();
  }, [authLoading, user, router, retryKey]);

  const handleRetry = () => {
    setStatus({ kind: "redirecting", label: "Retrying…" });
    firedRef.current = false;
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="w-full min-h-screen bg-page flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px] text-center">
        {status.kind === "redirecting" && (
          <>
            <Loader2
              className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin"
              aria-hidden="true"
            />
            <p className="text-[15px] text-gray-600" role="status" aria-live="polite">
              {status.label}
            </p>
          </>
        )}

        {status.kind === "already_subscribed" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-[20px] font-bold text-gray-950 mb-2 tracking-tight">
              You already have an active plan.
            </h1>
            <p className="text-[14px] text-gray-500 mb-6">
              Head to your dashboard to manage topics and preferences.
            </p>
            <Link
              href="/local"
              className="inline-flex items-center justify-center min-h-[44px] px-6 text-[14.5px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
            >
              Go to dashboard
            </Link>
          </div>
        )}

        {status.kind === "error" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-[20px] font-bold text-gray-950 mb-2 tracking-tight">
              Something went wrong.
            </h1>
            <p
              className="text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6"
              role="alert"
              aria-live="polite"
            >
              {status.message}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center justify-center min-h-[44px] px-6 text-[14.5px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
              >
                Try again
              </button>
              <Link
                href="/local/onboarding"
                className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to onboarding
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
