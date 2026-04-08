"use client";

import { useCallback, useEffect, useState } from "react";
import { getSubscriptionStatus } from "@/server-actions/get-subscription-status";

interface SubscriptionState {
  isPro: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSubscription: boolean;
  tier: 'pro' | 'basic' | 'none';
}

export function useSubscription(): SubscriptionState & { refetch: () => void } {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isAuthenticated: false,
    isLoading: true,
    hasSubscription: false,
    tier: 'none',
  });

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    getSubscriptionStatus().then((result) => {
      setState({ ...result, isLoading: false });
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
