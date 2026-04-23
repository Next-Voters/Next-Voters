"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CityRequest,
  OnboardingState,
  OnboardingStep,
  INITIAL_STATE,
} from "./types";

export const ONBOARDING_STORAGE_KEY = "nv_onboarding_v1";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PendingPlan = "basic" | "pro" | null;

export interface StoredOnboardingBlob {
  version: 1;
  city: string;
  cityRequest: CityRequest | null;
  language: string;
  topics: string[];
  pendingPlan: PendingPlan;
  referralCode: string | null;
  step: OnboardingStep;
  updatedAt: number;
}

export function readOnboardingBlob(): StoredOnboardingBlob | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOnboardingBlob;
    if (parsed.version !== 1) return null;
    if (!parsed.updatedAt || Date.now() - parsed.updatedAt > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeOnboardingBlob(blob: StoredOnboardingBlob): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(blob));
    return true;
  } catch {
    return false;
  }
}

export function clearOnboardingBlob(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export interface UseOnboardingStateReturn {
  isHydrated: boolean;
  storageAvailable: boolean;
  state: OnboardingState;
  step: OnboardingStep;
  pendingPlan: PendingPlan;
  referralCode: string | null;
  updateState: (patch: Partial<OnboardingState>) => void;
  setStep: (step: OnboardingStep) => void;
  setPendingPlan: (plan: PendingPlan) => void;
  setReferralCode: (code: string | null) => void;
  clear: () => void;
}

export function useOnboardingState(): UseOnboardingStateReturn {
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [step, setStepState] = useState<OnboardingStep>(1);
  const [pendingPlan, setPendingPlanState] = useState<PendingPlan>(null);
  const [referralCode, setReferralCodeState] = useState<string | null>(null);

  useEffect(() => {
    const blob = readOnboardingBlob();
    if (blob) {
      setState({
        city: blob.city,
        cityRequest: blob.cityRequest,
        language: blob.language,
        topics: blob.topics,
      });
      setStepState(blob.step);
      setPendingPlanState(blob.pendingPlan);
      setReferralCodeState(blob.referralCode);
    }
    try {
      const probe = "__nv_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
    } catch {
      setStorageAvailable(false);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const ok = writeOnboardingBlob({
      version: 1,
      city: state.city,
      cityRequest: state.cityRequest,
      language: state.language,
      topics: state.topics,
      pendingPlan,
      referralCode,
      step,
      updatedAt: Date.now(),
    });
    if (!ok) setStorageAvailable(false);
  }, [state, step, pendingPlan, referralCode, isHydrated]);

  const updateState = useCallback((patch: Partial<OnboardingState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const setStep = useCallback((next: OnboardingStep) => {
    setStepState(next);
  }, []);

  const setPendingPlan = useCallback((plan: PendingPlan) => {
    setPendingPlanState(plan);
  }, []);

  const setReferralCode = useCallback((code: string | null) => {
    setReferralCodeState(code);
  }, []);

  const clear = useCallback(() => {
    clearOnboardingBlob();
    setState(INITIAL_STATE);
    setStepState(1);
    setPendingPlanState(null);
    setReferralCodeState(null);
  }, []);

  return {
    isHydrated,
    storageAvailable,
    state,
    step,
    pendingPlan,
    referralCode,
    updateState,
    setStep,
    setPendingPlan,
    setReferralCode,
    clear,
  };
}
