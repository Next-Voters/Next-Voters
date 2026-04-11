'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { SubscriptionCards } from '@/components/local/subscription-cards';
import { SubscriptionDashboard } from '@/components/local/subscription-dashboard';

function NVLocalInner() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading, refetch } = useSubscription();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirectTo=/local');
    }
  }, [authLoading, user, router]);

  if (authLoading || subLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">Loading…</p>
      </div>
    );
  }

  if (!user) return null;

  if (!hasSubscription) {
    return <SubscriptionCards onSubscribed={refetch} />;
  }

  return <SubscriptionDashboard />;
}

export default function NVLocalPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center"><p className="text-gray-400 text-[14px]">Loading…</p></div>}>
      <NVLocalInner />
    </Suspense>
  );
}
