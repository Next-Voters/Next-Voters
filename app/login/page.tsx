'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const supabase = createSupabaseBrowserClient();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    }

    setLoading(false);
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
          <h1 className="text-[24px] font-bold text-gray-950 mb-1 tracking-tight">
            {mode === 'signin' ? 'Welcome back.' : 'Create an account.'}
          </h1>
          <p className="text-[14px] text-gray-500 mb-7">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                  className="text-brand font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
                  className="text-brand font-semibold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-all bg-gray-50/50 placeholder:text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-[14.5px] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-all bg-gray-50/50 placeholder:text-gray-400"
            />

            {error && (
              <p className="text-brand text-[13px] bg-brand/5 border border-brand/20 rounded-lg px-3 py-2">{error}</p>
            )}
            {message && (
              <p className="text-green-700 text-[13px] bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-[15px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors mt-1 disabled:opacity-60"
            >
              {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          </form>
        </div>
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
