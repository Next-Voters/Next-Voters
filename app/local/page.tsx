'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { SubscriptionDashboard } from '@/components/local/subscription-dashboard';
import { fulfillCheckout } from '@/server-actions/fulfill-checkout';
import { clearOnboardingBlob } from '@/components/local/onboarding/use-onboarding-state';

function NVLocalInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading, refetch } = useSubscription();
  const [fulfilling, setFulfilling] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);

  const isPostCheckout = searchParams.get('checkout') === 'success';
  const sessionId = searchParams.get('session_id');

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

  // Signed-in users without a subscription go through onboarding.
  // Signed-out users see the sign-in CTA on this page.
  useEffect(() => {
    if (authLoading || subLoading || fulfilling) return;
    if (user && !hasSubscription) {
      router.replace('/local/onboarding');
    }
  }, [authLoading, subLoading, fulfilling, user, hasSubscription, router]);

  useEffect(() => {
    if (hasSubscription) clearOnboardingBlob();
  }, [hasSubscription]);

  const handleGoogleSignIn = async () => {
    setSigninError(null);
    setSigningIn(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/local')}`,
      },
    });
    if (error) {
      setSigninError(error.message);
      setSigningIn(false);
    }
  };

  if (authLoading || subLoading || fulfilling) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">{fulfilling ? 'Setting up your subscription…' : 'Loading…'}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-10">
            <a
              href="/"
              className="text-[22px] font-bold text-gray-950 tracking-tight hover:opacity-70 transition-opacity"
            >
              NV
            </a>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 mt-1">
              Next Voters
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <h1 className="text-[24px] font-bold text-gray-950 mb-2 tracking-tight">
              Sign in to NV Local.
            </h1>
            <p className="text-[14px] text-gray-500 mb-6 leading-relaxed">
              Log in to manage your city, language, and topics.
            </p>

            {signinError && (
              <p
                role="alert"
                aria-live="polite"
                className="text-red-700 text-[13px] bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4"
              >
                {signinError}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 min-h-[44px] text-[15px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60 shadow-sm"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
                  fill="#EA4335"
                />
              </svg>
              {signingIn ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <p className="text-center text-[12px] text-gray-400 mt-4">
              New here?{' '}
              <a href="/local/onboarding" className="font-semibold text-brand hover:underline">
                Get started
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSubscription) return null;

  return <SubscriptionDashboard />;
}

export default function NVLocalPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center"><p className="text-gray-400 text-[14px]">Loading…</p></div>}>
      <NVLocalInner />
    </Suspense>
  );
}
