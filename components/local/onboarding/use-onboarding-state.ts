"use client";

import { useCallback, useState } from "react";
import {
  OnboardingMode,
  OnboardingState,
  OnboardingStep,
  INITIAL_STATE,
} from "./types";

export type PendingPlan = "free" | "pro" | null;

export interface UseOnboardingStateReturn {
  state: OnboardingState;
  step: OnboardingStep;
  mode: OnboardingMode;
  pendingPlan: PendingPlan;
  referralCode: string | null;
  updateState: (patch: Partial<OnboardingState>) => void;
  setStep: (step: OnboardingStep) => void;
  setMode: (mode: OnboardingMode) => void;
  setPendingPlan: (plan: PendingPlan) => void;
  setReferralCode: (code: string | null) => void;
  clear: () => void;
}

// Pure in-memory state container. Persistence will be re-added tomorrow with
// a Supabase-backed row instead of localStorage.
export function useOnboardingState(): UseOnboardingStateReturn {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [step, setStepState] = useState<OnboardingStep>(1);
  const [mode, setModeState] = useState<OnboardingMode>("subscribe");
  const [pendingPlan, setPendingPlanState] = useState<PendingPlan>(null);
  const [referralCode, setReferralCodeState] = useState<string | null>(null);

  const updateState = useCallback((patch: Partial<OnboardingState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const setStep = useCallback((next: OnboardingStep) => {
    setStepState(next);
  }, []);

  const setMode = useCallback((next: OnboardingMode) => {
    setModeState(next);
  }, []);

  const setPendingPlan = useCallback((plan: PendingPlan) => {
    setPendingPlanState(plan);
  }, []);

  const setReferralCode = useCallback((code: string | null) => {
    setReferralCodeState(code);
  }, []);

  const clear = useCallback(() => {
    setState(INITIAL_STATE);
    setStepState(1);
    setModeState("subscribe");
    setPendingPlanState(null);
    setReferralCodeState(null);
  }, []);

  return {
    state,
    step,
    mode,
    pendingPlan,
    referralCode,
    updateState,
    setStep,
    setMode,
    setPendingPlan,
    setReferralCode,
    clear,
  };
}
