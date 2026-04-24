"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getSupportedCities } from "@/server-actions/get-supported-cities";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref");
  const { user } = useAuth();

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
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstStepChangeRef = useRef(true);

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
        router.push("/local/onboarding/signup");
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
    [state, referralCode, user, storageAvailable, setPendingPlan, router],
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
    </div>
  );
}
