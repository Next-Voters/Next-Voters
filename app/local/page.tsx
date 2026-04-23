'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { SubscriptionDashboard } from '@/components/local/subscription-dashboard';
import { fulfillCheckout } from '@/server-actions/fulfill-checkout';
import { clearOnboardingBlob } from '@/components/local/onboarding/use-onboarding-state';

function NVLocalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading, refetch } = useSubscription();
  const [fulfilling, setFulfilling] = useState(false);

  const isPostCheckout = searchParams.get('checkout') === 'success';
  const sessionId = searchParams.get('session_id');

  // Handle post-checkout fulfillment at the page level so it runs
  // regardless of whether the subscription row exists yet
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirectTo=/local');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || subLoading || fulfilling) return;
    if (!user) return;
    if (!hasSubscription) {
      router.replace('/local/onboarding');
    }
  }, [authLoading, subLoading, fulfilling, user, hasSubscription, router]);

  useEffect(() => {
    if (hasSubscription) clearOnboardingBlob();
  }, [hasSubscription]);

  if (authLoading || subLoading || fulfilling) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">{fulfilling ? 'Setting up your subscription…' : 'Loading…'}</p>
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
