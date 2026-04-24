"use client";

import { useCallback, useEffect, useState } from "react";
import { getSubscriptionStatus } from "@/server-actions/get-subscription-status";

interface SubscriptionState {
  isPro: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSubscription: boolean;
  tier: 'pro' | 'free' | 'none';
}

export function useSubscription(): SubscriptionState & { refetch: () => Promise<void> } {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isAuthenticated: false,
    isLoading: true,
    hasSubscription: false,
    tier: 'none',
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const result = await getSubscriptionStatus();
    setState({ ...result, isLoading: false });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
