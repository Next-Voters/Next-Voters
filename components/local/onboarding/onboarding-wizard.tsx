"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupportedCities } from "@/server-actions/get-supported-cities";
import { submitRegionWaitlist } from "@/server-actions/request-region";
import { CityStep } from "./city-step";
import { LanguageStep } from "./language-step";
import { TopicsStep } from "./topics-step";
import { PlanStep } from "./plan-step";
import { RequestStep } from "./request-step";
import { AlternativeCitiesStep } from "./alternative-cities-step";
import { OnboardingMode, OnboardingStep } from "./types";
import { useOnboardingState } from "./use-onboarding-state";

const SUBSCRIBE_LABELS: Record<OnboardingStep, string> = {
  1: "City",
  2: "Language",
  3: "Topics",
  4: "Plan",
};

const REQUEST_LABELS: Record<1 | 2 | 3, string> = {
  1: "City",
  2: "Request",
  3: "Other cities?",
};

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref");
  const { user } = useAuth();
  const errorParam = searchParams.get("error");

  const {
    isHydrated,
    storageAvailable,
    state,
    step,
    mode,
    referralCode,
    updateState,
    setStep,
    setMode,
    setPendingPlan,
    setReferralCode,
  } = useOnboardingState();

  const [supportedCities, setSupportedCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(
    errorParam === "oauth_failed"
      ? "We couldn't sign you in with Google. Try again, or email hello@nextvoters.com."
      : null,
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [preAuthNotice, setPreAuthNotice] = useState<string | null>(null);
  const [autoKickoffLabel, setAutoKickoffLabel] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstStepChangeRef = useRef(true);
  const autoKickoffFiredRef = useRef(false);

  useEffect(() => {
    getSupportedCities()
      .then(setSupportedCities)
      .finally(() => setCitiesLoading(false));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (isFirstStepChangeRef.current) {
      isFirstStepChangeRef.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, mode, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (urlRef && urlRef !== referralCode) {
      setReferralCode(urlRef);
    }
  }, [isHydrated, urlRef, referralCode, setReferralCode]);

  // Auto-kickoff (request mode only): after returning from Google OAuth with a
  // pending city request, submit the waitlist entry and advance to the
  // alternatives step. The subscribe-mode kickoff lives on /local now — plan
  // CTA's OAuth redirects there directly.
  useEffect(() => {
    if (!isHydrated || !user || autoKickoffFiredRef.current) return;

    const canAutoRequest =
      mode === "request" &&
      Boolean(state.cityRequest?.city) &&
      step === 2;

    if (canAutoRequest) {
      autoKickoffFiredRef.current = true;
      setAutoKickoffLabel(`Adding ${state.cityRequest!.city} to your waitlist…`);
      (async () => {
        try {
          const result = await submitRegionWaitlist({
            city: state.cityRequest!.city,
            voterEmail: user.email,
            referralCode: referralCode || undefined,
          });
          if (result.ok === false) {
            setAutoKickoffLabel(null);
            setCheckoutError(result.error);
            return;
          }
          setStep(3);
          setAutoKickoffLabel(null);
        } catch {
          setAutoKickoffLabel(null);
          setCheckoutError("We couldn't save your request. Please try again.");
        }
      })();
    }
  }, [isHydrated, user, mode, state, step, referralCode, setStep]);

  const totalSteps = mode === "request" ? 3 : 4;
  const stepLabel =
    mode === "request"
      ? REQUEST_LABELS[step as 1 | 2 | 3] ?? "City"
      : SUBSCRIBE_LABELS[step];

  const goBack = useCallback(() => {
    if (step > 1) setStep((step - 1) as OnboardingStep);
  }, [step, setStep]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  };

  const handleCheckout = useCallback(
    async (plan: "free" | "pro") => {
      setCheckoutError(null);

      if (!user) {
        if (!storageAvailable) {
          setCheckoutError(
            "Your browser has saving progress disabled. Enable localStorage or sign in first to continue.",
          );
          scrollToBottom();
          return;
        }
        setPendingPlan(plan);
        setPreAuthNotice("Last step: save your plan! Login to a Next Voters account.");
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const supabase = createSupabaseBrowserClient();
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/local")}`,
          },
        });
        if (oauthError) {
          setPreAuthNotice(null);
          setCheckoutError(oauthError.message);
          scrollToBottom();
        }
        return;
      }

      setIsRedirecting(true);
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            city: state.city,
            language: state.language,
            topics: state.topics,
            cityRequest: state.cityRequest,
            referralCode: referralCode || undefined,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setCheckoutError(data.error ?? "Something went wrong. Please try again.");
        setIsRedirecting(false);
        scrollToBottom();
      } catch {
        setCheckoutError("Something went wrong. Please try again.");
        setIsRedirecting(false);
        scrollToBottom();
      }
    },
    [state, referralCode, user, storageAvailable, setPendingPlan],
  );

  const handleCityContinue = useCallback(
    (cityWasSupported: boolean) => {
      const nextMode: OnboardingMode = cityWasSupported ? "subscribe" : "request";
      setMode(nextMode);
      setStep(2);
    },
    [setMode, setStep],
  );

  const handleSubscribeAdvance = useCallback(() => {
    if (step < 4) setStep((step + 1) as OnboardingStep);
  }, [step, setStep]);

  const handleRequestSubmitted = useCallback(() => {
    setStep(3);
  }, [setStep]);

  const handlePickAlternative = useCallback(
    (city: string) => {
      updateState({ city, cityRequest: null });
      setMode("subscribe");
      setStep(2);
    },
    [updateState, setMode, setStep],
  );

  if (!isHydrated) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page">
      <div className="max-w-[560px] mx-auto px-5 sm:px-6 pt-10 pb-16">
        {!storageAvailable && (
          <p
            className="mb-6 text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
            role="status"
          >
            Your browser has saving progress disabled. Don&apos;t close this tab — your answers won&apos;t be saved between visits.
          </p>
        )}

        {/* Stepper + back arrow */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="flex-1 flex items-center gap-2"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-valuenow={step}
            aria-valuetext={`Step ${step} of ${totalSteps}: ${stepLabel}`}
          >
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={[
                  "flex-1 h-1 rounded-full transition-colors",
                  s <= step ? "bg-brand" : "bg-gray-200",
                ].join(" ")}
              />
            ))}
          </div>
          <span className="text-[12px] font-semibold text-gray-500 tabular-nums">
            {step} / {totalSteps}
          </span>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] sm:text-[34px] font-bold text-gray-950 leading-tight tracking-tight mb-8 outline-none"
        >
          {stepLabel}
        </h1>

        {step === 1 && (
          <CityStep
            state={state}
            supportedCities={supportedCities}
            citiesLoading={citiesLoading}
            updateState={updateState}
            onContinue={handleCityContinue}
          />
        )}

        {mode === "subscribe" && step === 2 && (
          <LanguageStep
            state={state}
            updateState={updateState}
            onContinue={handleSubscribeAdvance}
          />
        )}
        {mode === "subscribe" && step === 3 && (
          <TopicsStep
            state={state}
            updateState={updateState}
            onContinue={handleSubscribeAdvance}
          />
        )}
        {mode === "subscribe" && step === 4 && (
          <PlanStep
            state={state}
            isRedirecting={isRedirecting}
            onCheckout={handleCheckout}
          />
        )}

        {mode === "request" && step === 2 && (
          <RequestStep
            state={state}
            referralCode={referralCode}
            onContinue={handleRequestSubmitted}
          />
        )}
        {mode === "request" && step === 3 && (
          <AlternativeCitiesStep
            state={state}
            supportedCities={supportedCities}
            onPick={handlePickAlternative}
          />
        )}

        {checkoutError && (
          <p
            className="mt-5 text-[13.5px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            role="alert"
            aria-live="polite"
          >
            {checkoutError}
          </p>
        )}
      </div>

      {(preAuthNotice || autoKickoffLabel) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5 animate-in fade-in duration-150"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl p-6 text-center">
            {preAuthNotice ? (
              <>
                <p className="text-[17px] font-bold text-gray-950 tracking-tight mb-1.5">
                  Last step: save your plan!
                </p>
                <p className="text-[14px] text-gray-500 mb-5">
                  Login to a Next Voters account.
                </p>
                <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Redirecting to Google…
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" aria-hidden="true" />
                <p className="text-[14.5px] font-semibold text-gray-800">
                  {autoKickoffLabel}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
