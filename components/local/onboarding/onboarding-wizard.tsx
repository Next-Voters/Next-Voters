"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CityStep } from "./city-step";
import { LanguageStep } from "./language-step";
import { TopicsStep } from "./topics-step";
import { PlanStep } from "./plan-step";
import { INITIAL_STATE, OnboardingState, OnboardingStep } from "./types";

const STEP_LABELS: Record<OnboardingStep, string> = {
  1: "City",
  2: "Language",
  3: "Topics",
  4: "Plan",
};

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const [step, setStep] = useState<OnboardingStep>(1);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const updateState = useCallback(
    (patch: Partial<OnboardingState>) => setState((s) => ({ ...s, ...patch })),
    [],
  );

  const goBack = useCallback(() => {
    setStep((s) => (s > 1 ? ((s - 1) as OnboardingStep) : s));
  }, []);

  const advance = useCallback(() => {
    setStep((s) => (s < 4 ? ((s + 1) as OnboardingStep) : s));
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  };

  const handleCheckout = useCallback(
    async (plan: "basic" | "pro") => {
      setCheckoutError(null);
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
    [state, referralCode],
  );

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page">
      <div className="max-w-[560px] mx-auto px-5 sm:px-6 pt-10 pb-16">
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
            aria-valuemax={4}
            aria-valuenow={step}
            aria-valuetext={`Step ${step} of 4: ${STEP_LABELS[step]}`}
          >
            {([1, 2, 3, 4] as const).map((s) => (
              <div
                key={s}
                title={STEP_LABELS[s]}
                className={[
                  "flex-1 h-1 rounded-full transition-colors",
                  s <= step ? "bg-brand" : "bg-gray-200",
                ].join(" ")}
              />
            ))}
          </div>
          <span className="text-[12px] font-semibold text-gray-500 tabular-nums">
            {step} / 4
          </span>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-[28px] sm:text-[34px] font-bold text-gray-950 leading-tight tracking-tight mb-8 outline-none"
        >
          {STEP_LABELS[step]}
        </h1>

        {step === 1 && (
          <CityStep state={state} updateState={updateState} onContinue={advance} />
        )}
        {step === 2 && (
          <LanguageStep state={state} updateState={updateState} onContinue={advance} />
        )}
        {step === 3 && (
          <TopicsStep state={state} updateState={updateState} onContinue={advance} />
        )}
        {step === 4 && (
          <PlanStep
            state={state}
            isRedirecting={isRedirecting}
            onCheckout={handleCheckout}
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
