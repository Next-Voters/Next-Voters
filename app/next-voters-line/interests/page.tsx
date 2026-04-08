'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import topicOptions from '@/data/topic-options';
import { PreferredCommunication } from '@/types/preferences';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradePrompt } from '@/components/alerts/upgrade-prompt';
import { TierBadge } from '@/components/alerts/tier-badge';
import { fulfillCheckout } from '@/server-actions/fulfill-checkout';
import { Check } from 'lucide-react';

function NextVotersLineInterestsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const contact = useMemo(() => (searchParams.get('contact') ?? '').trim(), [searchParams]);
  const preferredCommunication = useMemo<PreferredCommunication>(() => {
    const type = (searchParams.get('type') ?? 'email').toLowerCase();
    return type === 'sms' ? 'sms' : 'email';
  }, [searchParams]);

  const isPostCheckout = searchParams.get('checkout') === 'success';
  const sessionId = searchParams.get('session_id');

  const { isPro, isAuthenticated, isLoading: subLoading, tier, refetch } = useSubscription();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!isPostCheckout || !sessionId) return;
    setVerifying(true);
    fulfillCheckout(sessionId)
      .then((result) => { if (result.success) refetch(); })
      .finally(() => setVerifying(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = verifying || subLoading;
  const MAX_TOPICS = isPro ? 3 : 1;

  const [selected, setSelected] = useState<string[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const toggleTopic = (topic: string) => {
    setSelected((prev) => {
      const exists = prev.includes(topic);
      if (exists) return prev.filter((t) => t !== topic);
      if (prev.length >= MAX_TOPICS) {
        setShowUpgrade(true);
        return prev;
      }
      return [...prev, topic];
    });
  };

  const onFinish = () => {
    if (!contact) { router.push('/alerts'); return; }
    if (selected.length === 0) { alert('Please select at least one interest.'); return; }
    const q = new URLSearchParams({ contact, type: preferredCommunication, topics: JSON.stringify(selected) });
    router.push(`/alerts/region?${q.toString()}`);
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/alerts/interests';

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page flex flex-col pb-20">
      <div className="flex-1 w-full max-w-[560px] mx-auto px-5 sm:px-6 pt-12 pb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <h1 className="text-[30px] sm:text-[38px] font-bold text-gray-950 leading-tight tracking-tight">
            You&apos;re almost done.
          </h1>
          {!loading && <TierBadge tier={tier} />}
        </div>

        {verifying && (
          <p className="text-[14px] text-brand font-medium mb-2">Verifying your payment…</p>
        )}

        <p className="text-[15px] sm:text-[16px] text-gray-500 mb-8 leading-relaxed">
          {loading
            ? 'Select your interests below.'
            : `Select up to ${MAX_TOPICS} topic${MAX_TOPICS === 1 ? '' : 's'}. We'll only send you updates related to your choice.`}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-6">
          {topicOptions.map((topic) => {
            const isActive = selected.includes(topic);
            const isDisabled = !isActive && selected.length >= MAX_TOPICS;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-pressed={isActive}
                className={[
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-[14.5px] transition-all',
                  isActive
                    ? 'border-brand bg-brand text-white shadow-sm'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50',
                  isDisabled && !isPro ? 'opacity-40' : '',
                ].join(' ')}
              >
                {isActive && <Check className="w-4 h-4 shrink-0" />}
                {topic}
              </button>
            );
          })}
        </div>

        {!isPro && !loading && (
          <p className="text-[13px] text-gray-500 mb-8">
            Want all 3 topics?{' '}
            <button onClick={() => setShowUpgrade(true)} className="text-brand font-semibold hover:underline">
              Upgrade to Pro
            </button>
          </p>
        )}

        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[16px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm touch-manipulation"
        >
          Continue →
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-page/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full bg-brand rounded-r-full transition-all duration-300" style={{ width: '50%' }} />
        </div>
        <p className="py-2 text-center text-[11px] text-gray-400">Step 2 of 4</p>
      </div>

      <UpgradePrompt
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        isAuthenticated={isAuthenticated}
        redirectPath={currentPath}
      />
    </div>
  );
}

export default function NextVotersLineInterestsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
      <NextVotersLineInterestsInner />
    </Suspense>
  );
}
