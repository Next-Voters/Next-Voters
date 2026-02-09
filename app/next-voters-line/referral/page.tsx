'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { sendConfirmationEmail, sendReferralEmail } from '@/server-actions/mailer';

type ConfettiPiece = {
  id: string;
  left: number; // px
  top: number; // px
  width: number; // px
  height: number; // px
  color: string;
  r0: number; // deg
  durationMs: number;
  delayMs: number;
  dx1: number; // px
  dy1: number; // px
  dx2: number; // px
  dy2: number; // px
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function NextVotersLineReferralInner() {
  const searchParams = useSearchParams();
  const referrerEmail = useMemo(() => (searchParams.get('referrer') ?? '').trim(), [searchParams]);

  const [referralEmail, setReferralEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReferred, setHasReferred] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const confettiTimerRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const progressPercent = 100;

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
      if (confettiTimerRef.current) {
        window.clearTimeout(confettiTimerRef.current);
      }
    };
  }, []);

  const playSuccessChime = async () => {
    if (typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = audioCtxRef.current ?? new AudioCtx();
    audioCtxRef.current = ctx;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return;
      }
    }

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.08, now);
    master.connect(ctx.destination);

    const notes = [659.25, 783.99, 987.77]; // E5, G5, B5
    notes.forEach((freq, i) => {
      const start = now + i * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.9, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(gain);
      gain.connect(master);

      osc.start(start);
      osc.stop(start + 0.17);
    });
  };

  const burstConfetti = () => {
    if (typeof window === 'undefined') return;

    // Respect reduced-motion preference.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.45;

    const fallBase = window.innerHeight - originY + 220;
    const colors = ['#E12D39', '#111827', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
    const count = 44;
    const ts = Date.now();

    const pieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => {
      const width = rand(6, 12);
      const height = width * rand(0.45, 0.9);
      const dx1 = rand(-90, 90);
      const dy1 = rand(-190, -110);
      const dx2 = dx1 * rand(1.6, 2.4);
      const dy2 = fallBase + rand(0, 160);

      return {
        id: `${ts}-${i}`,
        left: originX + rand(-28, 28),
        top: originY + rand(-8, 8),
        width,
        height,
        color: colors[i % colors.length],
        r0: rand(0, 360),
        durationMs: rand(1200, 2200),
        delayMs: rand(0, 120),
        dx1,
        dy1,
        dx2,
        dy2,
      };
    });

    setConfettiPieces(pieces);

    const maxMs = pieces.reduce((max, p) => Math.max(max, p.delayMs + p.durationMs), 0);
    if (confettiTimerRef.current) window.clearTimeout(confettiTimerRef.current);
    confettiTimerRef.current = window.setTimeout(() => setConfettiPieces([]), maxMs + 250);
  };

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

      // Celebrate only on success.
      burstConfetti();
      void playSuccessChime();

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
            ref={buttonRef}
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

      {/* Confetti overlay */}
      {confettiPieces.length > 0 ? (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confettiPieces.map((p) => (
            <span
              key={p.id}
              className="nv-confetti-piece"
              style={
                {
                  left: `${p.left}px`,
                  top: `${p.top}px`,
                  width: `${p.width}px`,
                  height: `${p.height}px`,
                  backgroundColor: p.color,
                  ['--r0' as any]: `${p.r0}deg`,
                  ['--dur' as any]: `${p.durationMs}ms`,
                  ['--delay' as any]: `${p.delayMs}ms`,
                  ['--dx1' as any]: `${p.dx1}px`,
                  ['--dy1' as any]: `${p.dy1}px`,
                  ['--dx2' as any]: `${p.dx2}px`,
                  ['--dy2' as any]: `${p.dy2}px`,
                } as any
              }
            />
          ))}
          <style jsx>{`
            .nv-confetti-piece {
              position: fixed;
              border-radius: 2px;
              will-change: transform, opacity;
              animation: nv-confetti-burst var(--dur) cubic-bezier(0.2, 0.7, 0.2, 1) var(--delay) forwards;
            }

            @keyframes nv-confetti-burst {
              0% {
                transform: translate(0, 0) rotate(var(--r0));
                opacity: 1;
              }
              15% {
                transform: translate(var(--dx1), var(--dy1)) rotate(calc(var(--r0) + 180deg));
                opacity: 1;
              }
              100% {
                transform: translate(var(--dx2), var(--dy2)) rotate(calc(var(--r0) + 900deg));
                opacity: 0;
              }
            }
          `}</style>
        </div>
      ) : null}

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

