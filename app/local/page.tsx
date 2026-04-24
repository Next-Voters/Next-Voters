'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { SubscriptionDashboard } from '@/components/local/subscription-dashboard';
import { fulfillCheckout } from '@/server-actions/fulfill-checkout';
import {
  ONBOARDING_STORAGE_KEY,
  clearOnboardingBlob,
  readOnboardingBlob,
  type StoredOnboardingBlob,
} from '@/components/local/onboarding/use-onboarding-state';

// Synchronously clear pendingPlan from the stored blob before navigating to
// Stripe, so a back-button bounce doesn't re-fire the kickoff.
function clearPendingPlanInStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return;
    const blob = JSON.parse(raw) as StoredOnboardingBlob;
    blob.pendingPlan = null;
    blob.updatedAt = Date.now();
    window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(blob));
  } catch {
    /* ignore */
  }
}

function NVLocalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading, refetch } = useSubscription();
  const [fulfilling, setFulfilling] = useState(false);
  const [kickoffState, setKickoffState] = useState<'idle' | 'running' | 'error'>('idle');
  const [kickoffError, setKickoffError] = useState<string | null>(null);
  const kickoffFiredRef = useRef(false);

  const isPostCheckout = searchParams.get('checkout') === 'success';
  const sessionId = searchParams.get('session_id');

  // Post-Stripe fulfillment.
  useEffect(() => {
    if (!isPostCheckout || !sessionId || !user) return;
    setFulfilling(true);
    fulfillCheckout(sessionId)
      .then((result) => {
        if (result.success) refetch();
      })
      .finally(() => setFulfilling(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostCheckout, sessionId, user]);

  // Decide what to do once auth + subscription state have settled:
  // 1. Signed-in + subscribed → dashboard (no effect needed, render handles it).
  // 2. Signed-in + no sub + blob has a pending plan → fire Stripe checkout.
  // 3. Signed-in + no sub + no pending plan → onboarding.
  // 4. Signed-out → onboarding.
  useEffect(() => {
    if (authLoading || subLoading || fulfilling) return;
    if (kickoffFiredRef.current) return;

    if (!user) {
      router.replace('/local/onboarding');
      return;
    }

    if (hasSubscription) return;

    const blob = readOnboardingBlob();
    const canResumeCheckout = Boolean(
      blob &&
        blob.mode === 'subscribe' &&
        blob.pendingPlan &&
        blob.city &&
        blob.language &&
        blob.topics.length > 0,
    );

    if (!canResumeCheckout) {
      router.replace('/local/onboarding');
      return;
    }

    kickoffFiredRef.current = true;
    setKickoffState('running');
    (async () => {
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: blob!.pendingPlan,
            city: blob!.city,
            language: blob!.language,
            topics: blob!.topics,
            cityRequest: blob!.cityRequest,
            referralCode: blob!.referralCode || undefined,
          }),
        });
        const data = await res.json();
        if (data.url) {
          clearPendingPlanInStorage();
          window.location.href = data.url;
          return;
        }
        setKickoffState('error');
        setKickoffError(data.error ?? "Something went wrong. Please try again.");
      } catch {
        setKickoffState('error');
        setKickoffError("We couldn't reach checkout. Please try again.");
      }
    })();
  }, [authLoading, subLoading, fulfilling, user, hasSubscription, router]);

  useEffect(() => {
    if (hasSubscription) clearOnboardingBlob();
  }, [hasSubscription]);

  if (authLoading || subLoading || fulfilling || kickoffState === 'running') {
    const label = fulfilling
      ? 'Setting up your subscription…'
      : kickoffState === 'running'
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

  if (kickoffState === 'error') {
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
            {kickoffError ?? 'Something went wrong.'}
          </p>
          <button
            type="button"
            onClick={() => {
              kickoffFiredRef.current = false;
              setKickoffState('idle');
              setKickoffError(null);
              router.replace('/local/onboarding');
            }}
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
