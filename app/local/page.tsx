'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { SubscriptionDashboard } from '@/components/local/subscription-dashboard';
import { fulfillCheckout } from '@/server-actions/fulfill-checkout';
import { syncSubscriptionFromStripe } from '@/server-actions/sync-subscription';

function NVLocalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading, refetch } = useSubscription();
  const [fulfilling, setFulfilling] = useState(false);
  const [kickingOff, setKickingOff] = useState(false);
  const [kickoffError, setKickoffError] = useState<string | null>(null);
  const fulfilledSessionRef = useRef<string | null>(null);
  const kickoffFiredRef = useRef(false);

  const isPostCheckout = searchParams.get('checkout') === 'success';
  const sessionId = searchParams.get('session_id');

  // URL-carried pending plan handed off from /local/onboarding after OAuth.
  const pendingPlan = searchParams.get('plan');
  const pendingCity = searchParams.get('city');
  const pendingLanguage = searchParams.get('language');
  const pendingTopicsRaw = searchParams.get('topics');
  const pendingCityRequest = searchParams.get('cityRequest');
  const pendingRef = searchParams.get('ref');
  const hasPendingCheckout = Boolean(
    pendingPlan && pendingCity && pendingLanguage && pendingTopicsRaw,
  );

  // Post-Stripe fulfillment. Ref keyed on sessionId guards against StrictMode
  // double-invocation (submitRegionWaitlist inside is not idempotent).
  useEffect(() => {
    if (!isPostCheckout || !sessionId || !user) return;
    if (fulfilledSessionRef.current === sessionId) return;
    fulfilledSessionRef.current = sessionId;
    setFulfilling(true);
    (async () => {
      try {
        const result = await fulfillCheckout(sessionId);
        if (result.success) await refetch();
      } finally {
        setFulfilling(false);
      }
    })();
  }, [isPostCheckout, sessionId, user, refetch]);

  // Auto-kickoff Stripe checkout using URL-carried plan selection (after OAuth
  // round-trip from /local/onboarding). Reads the params, POSTs to the checkout
  // API, redirects the user to Stripe. Falls through to the dashboard if the
  // user already has an active Stripe sub (via 409 + sync).
  useEffect(() => {
    if (authLoading || subLoading || fulfilling) return;
    if (!user || hasSubscription) return;
    if (!hasPendingCheckout) return;
    if (kickoffFiredRef.current) return;
    kickoffFiredRef.current = true;
    setKickingOff(true);

    const topics = pendingTopicsRaw!.split(',').filter(Boolean);
    const body = {
      plan: pendingPlan,
      city: pendingCity,
      language: pendingLanguage,
      topics,
      cityRequest: pendingCityRequest ? { city: pendingCityRequest } : null,
      referralCode: pendingRef || undefined,
    };

    (async () => {
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (res.status === 409) {
          const syncResult = await syncSubscriptionFromStripe();
          if (!syncResult.ok) {
            setKickoffError(
              syncResult.error ||
                "You already have an active subscription, but we couldn't sync it. Contact hello@nextvoters.com.",
            );
            setKickingOff(false);
            return;
          }
          // Clear URL params before rendering dashboard.
          router.replace('/local');
          await refetch();
          setKickingOff(false);
          return;
        }

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        setKickoffError(data.error ?? 'Something went wrong. Please try again.');
        setKickingOff(false);
      } catch {
        setKickoffError("We couldn't reach checkout. Please try again.");
        setKickingOff(false);
      }
    })();
  }, [
    authLoading,
    subLoading,
    fulfilling,
    user,
    hasSubscription,
    hasPendingCheckout,
    pendingPlan,
    pendingCity,
    pendingLanguage,
    pendingTopicsRaw,
    pendingCityRequest,
    pendingRef,
    refetch,
    router,
  ]);

  // Redirect to onboarding only when there's no pending kickoff in flight.
  useEffect(() => {
    if (authLoading || subLoading || fulfilling || kickingOff) return;
    if (hasPendingCheckout) return;
    if (!user || !hasSubscription) {
      router.replace('/local/onboarding');
    }
  }, [
    authLoading,
    subLoading,
    fulfilling,
    kickingOff,
    hasPendingCheckout,
    user,
    hasSubscription,
    router,
  ]);

  if (authLoading || subLoading || fulfilling || kickingOff) {
    const label = fulfilling
      ? 'Setting up your subscription…'
      : kickingOff
        ? 'Finishing your setup…'
        : 'Loading…';
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center px-5">
        <div className="flex items-center gap-3 text-gray-500 text-[14px]">
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          {label}
        </div>
      </div>
    );
  }

  if (kickoffError) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-[20px] font-bold text-gray-950 mb-2 tracking-tight">
            Checkout didn&apos;t start.
          </h1>
          <p
            className="text-[14px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6"
            role="alert"
            aria-live="polite"
          >
            {kickoffError}
          </p>
          <button
            type="button"
            onClick={() => router.replace('/local/onboarding')}
            className="inline-flex items-center justify-center min-h-[44px] px-6 text-[14.5px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
          >
            Back to plan selection
          </button>
        </div>
      </div>
    );
  }

  if (!user || !hasSubscription) return null;

  return <SubscriptionDashboard />;
}

export default function NVLocalPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center"><p className="text-gray-400 text-[14px]">Loading…</p></div>}>
      <NVLocalInner />
    </Suspense>
  );
}
