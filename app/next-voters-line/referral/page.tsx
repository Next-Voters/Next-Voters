'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { sendReferralEmail } from '@/server-actions/mailer';

type ConfettiPiece = {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  r0: number;
  durationMs: number;
  delayMs: number;
  dx1: number;
  dy1: number;
  dx2: number;
  dy2: number;
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

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
      if (confettiTimerRef.current) window.clearTimeout(confettiTimerRef.current);
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
      try { await ctx.resume(); } catch { return; }
    }

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.08, now);
    master.connect(ctx.destination);

    [659.25, 783.99, 987.77].forEach((freq, i) => {
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
      return {
        id: `${ts}-${i}`,
        left: originX + rand(-28, 28),
        top: originY + rand(-8, 8),
        width, height,
        color: colors[i % colors.length],
        r0: rand(0, 360),
        durationMs: rand(1200, 2200),
        delayMs: rand(0, 120),
        dx1, dy1,
        dx2: dx1 * rand(1.6, 2.4),
        dy2: fallBase + rand(0, 160),
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
    if (error) { alert(error); return; }
    if (!referrerEmail) { alert('Missing referrer email. Please restart signup.'); return; }

    setIsSubmitting(true);
    try {
      try {
        await sendReferralEmail(referrerEmail, referralEmail.trim());
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        alert(`Could not send referral email: ${message}`);
        return;
      }

      burstConfetti();
      void playSuccessChime();
      setHasReferred(true);
      setNotice('Referral sent!');
      setReferralEmail('');
      if (noticeTimerRef.current) window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = window.setTimeout(() => setNotice(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page flex flex-col pb-20">
      <div className="flex-1 w-full max-w-[560px] mx-auto px-5 sm:px-6 pt-12 pb-8">
        {/* Success indicator */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-[14px] font-semibold text-green-700">You&apos;re signed up!</span>
        </div>

        <h1 className="text-[30px] sm:text-[38px] font-bold text-gray-950 mb-3 leading-tight tracking-tight">
          You&apos;re good to go!
        </h1>
        <p className="text-[15px] text-gray-500 mb-10 max-w-[440px] leading-relaxed">
          Want a potential future discount? Refer a friend and you&apos;ll automatically be considered for future deals based on referrals.
        </p>

        <div className="w-full max-w-[400px]">
          <div className="flex items-stretch border-2 border-gray-950 rounded-xl overflow-hidden bg-white">
            <div className="flex items-center justify-center px-4 border-r-2 border-gray-950 bg-gray-50">
              <Mail className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <input
              className="flex-1 px-4 py-3.5 text-[15px] sm:text-[17px] font-semibold text-gray-950 placeholder:text-gray-400 focus:outline-none"
              type="email"
              inputMode="email"
              placeholder="friend@email.com"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onRefer(); }}
            />
          </div>

          <button
            ref={buttonRef}
            type="button"
            disabled={isSubmitting}
            className="mt-3.5 inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[16px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-60 touch-manipulation shadow-sm"
            onClick={onRefer}
          >
            {isSubmitting ? 'Sending…' : hasReferred ? 'Refer another friend' : 'Refer a friend'}
          </button>

          {notice && (
            <div role="status" aria-live="polite" className="mt-3 flex items-center gap-2 text-[13px] text-green-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {notice}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a href="/" className="text-[14px] text-gray-500 hover:text-gray-900 font-medium transition-colors">
              ← Back to home
            </a>
          </div>
        </div>
      </div>

      {/* Confetti overlay */}
      {confettiPieces.length > 0 && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {confettiPieces.map((p) => (
            <span
              key={p.id}
              className="nv-confetti-piece"
              style={{
                left: `${p.left}px`,
                top: `${p.top}px`,
                width: `${p.width}px`,
                height: `${p.height}px`,
                backgroundColor: p.color,
                ['--r0' as string]: `${p.r0}deg`,
                ['--dur' as string]: `${p.durationMs}ms`,
                ['--delay' as string]: `${p.delayMs}ms`,
                ['--dx1' as string]: `${p.dx1}px`,
                ['--dy1' as string]: `${p.dy1}px`,
                ['--dx2' as string]: `${p.dx2}px`,
                ['--dy2' as string]: `${p.dy2}px`,
              } as React.CSSProperties}
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
              0% { transform: translate(0, 0) rotate(var(--r0)); opacity: 1; }
              15% { transform: translate(var(--dx1), var(--dy1)) rotate(calc(var(--r0) + 180deg)); opacity: 1; }
              100% { transform: translate(var(--dx2), var(--dy2)) rotate(calc(var(--r0) + 900deg)); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Progress */}
      <div className="fixed bottom-0 left-0 right-0 bg-page/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full bg-brand rounded-r-full" style={{ width: '100%' }} />
        </div>
        <p className="py-2 text-center text-[11px] text-gray-400">Step 4 of 4 — Complete!</p>
      </div>
    </div>
  );
}

export default function NextVotersLineReferralPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
      <NextVotersLineReferralInner />
    </Suspense>
  );
}
