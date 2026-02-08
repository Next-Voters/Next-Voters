'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { sendConfirmationEmail, sendReferralEmail } from '@/server-actions/mailer';

function NextVotersLineReferralInner() {
  const searchParams = useSearchParams();
  const referrerEmail = useMemo(() => (searchParams.get('referrer') ?? '').trim(), [searchParams]);

  const [referralEmail, setReferralEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReferred, setHasReferred] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const progressPercent = 100;

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const validate = () => {
    const trimmed = referralEmail.trim();
    if (!trimmed) return 'Please enter an email address.';
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!ok) return 'Please enter a valid email address.';
    return null;
  };

  const onRefer = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    if (!referrerEmail) {
      alert('Missing referrer email. Please restart signup.');
      return;
    }

    setIsSubmitting(true);
    try {
      try {
        await sendReferralEmail(referrerEmail, referralEmail.trim());
        await sendConfirmationEmail(referralEmail.trim());
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        alert(`Could not send referral email: ${message}`);
        return;
      }
      setHasReferred(true);
      setNotice('Referral email sent!');
      setReferralEmail('');
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
      noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white pb-20">
      <div className="w-full max-w-[980px] px-6 pt-20 pb-28">
        <h1 className="text-[44px] sm:text-[52px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans leading-[1.05] tracking-tight">
          You&apos;re good to go!
          <br />
          Want a potential future discount?
        </h1>

        <p className="text-[15px] sm:text-[16px] text-gray-900 font-plus-jakarta-sans font-semibold leading-snug mb-10 max-w-[520px]">
          Help a friend stay in the know by referring them.
          <br />
          You&apos;ll automatically be considered for future deals based on number of referrals.
        </p>

        <div className="w-full max-w-[420px]">
          <div className="flex items-stretch border-2 border-gray-900 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center justify-center px-4 border-r-2 border-gray-900">
              <Mail className="h-6 w-6 text-gray-900" aria-hidden="true" />
            </div>
            <input
              className="flex-1 px-4 py-4 text-[20px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none font-plus-jakarta-sans"
              type="email"
              inputMode="email"
              placeholder="example@email.com"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
            />
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            className="mt-5 inline-flex items-center justify-center px-10 py-3 text-[18px] font-bold text-white bg-[#E12D39] rounded-lg hover:bg-[#c92631] transition-colors font-plus-jakarta-sans disabled:opacity-60"
            onClick={onRefer}
          >
            {isSubmitting ? 'Submitting…' : hasReferred ? 'Refer another friend' : 'Refer a friend'}
          </button>

          {notice ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 text-[13px] font-plus-jakarta-sans text-gray-700"
            >
              {notice}
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom progress bar (as in Figma) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="w-full px-0">
          <div className="h-[5px] w-full bg-gray-200">
            <div
              className="h-full bg-[#E12D39] rounded-r-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="py-2 text-center text-[11px] text-gray-500 font-plus-jakarta-sans">
            {progressPercent}% Complete
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NextVotersLineReferralPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading…</div>}>
      <NextVotersLineReferralInner />
    </Suspense>
  );
}

