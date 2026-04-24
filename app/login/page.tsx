'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { readPendingAction } from '@/lib/pending-action';

function LoginInner() {
  const searchParams = useSearchParams();
  const urlRedirectTo = searchParams.get('redirectTo');
  // Resolution priority: explicit ?redirectTo= URL param > pending-action
  // cookie (so a mid-flow user who ended up on /login gets bounced back to
  // /local or /local/onboarding to run the kickoff) > `/` home.
  const [resolvedRedirect, setResolvedRedirect] = useState<string>(
    urlRedirectTo ?? '/',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlRedirectTo) {
      setResolvedRedirect(urlRedirectTo);
      return;
    }
    const pending = readPendingAction();
    if (pending?.type === 'subscribe') {
      setResolvedRedirect('/local');
    } else if (pending?.type === 'request') {
      setResolvedRedirect('/local/onboarding');
    } else {
      setResolvedRedirect('/');
    }
  }, [urlRedirectTo]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(resolvedRedirect)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-page flex items-center justify-center px-5">
      <div className="w-full max-w-[400px]">
        {/* Brand mark */}
        <div className="text-center mb-10">
          <a href="/" className="text-[22px] font-bold text-gray-950 tracking-tight hover:opacity-70 transition-opacity">
            NV
          </a>
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400 mt-1">Next Voters</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-[24px] font-bold text-gray-950 mb-1 tracking-tight">Welcome.</h1>
          <p className="text-[14px] text-gray-500 mb-7">Sign in to your Next Voters account.</p>

          {error && (
            <p className="text-brand text-[13px] bg-brand/5 border border-brand/20 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 text-[15px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-60 shadow-sm"
          >
            {/* Google logo */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-6">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-gray-600">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
