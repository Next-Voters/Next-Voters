'use client';

import { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleSubscribe } from '@/server-actions/sub-to-nextvoterslocal';

const REGIONS = [
  { id: 'toronto', label: 'Toronto', imageSrc: '/regions/toronto.png' },
  { id: 'new-york-city', label: 'New York City', imageSrc: '/regions/nyc.png' },
  { id: 'san-diego', label: 'San Diego', imageSrc: '/regions/san-diego.png' },
] as const;

function RegionSelectionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const contact = useMemo(() => (searchParams.get('contact') ?? '').trim(), [searchParams]);
  const topics = useMemo(() => {
    const raw = searchParams.get('topics');
    if (!raw) return [] as string[];
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch { return [] as string[]; }
  }, [searchParams]);

  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const referralUrl = useMemo(() => {
    const referrer = encodeURIComponent(contact);
    return `/alerts/referral?referrer=${referrer}`;
  }, [contact]);

  const onSelectRegion = async (regionId: string) => {
    if (!contact || topics.length === 0) { router.push('/alerts'); return; }

    const region = REGIONS.find((r) => r.id === regionId);
    const cityLabel = region?.label ?? regionId;

    setSubmittingId(regionId);
    try {
      let result: { error?: string } | void;
      try {
        result = await handleSubscribe(contact, topics, cityLabel);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        alert(`Could not save your signup: ${message}`);
        router.push(referralUrl);
        return;
      }
      if (result?.error) {
        alert(result.error);
        router.push(referralUrl);
        return;
      }
      router.push(referralUrl);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-gray-950">
      {/* Header hint */}
      <div className="px-5 pt-8 pb-6 text-center">
        <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight mb-1.5">
          Select your region
        </h1>
        <p className="text-[14px] text-gray-400">We'll send you weekly updates about local politics in your city.</p>
      </div>

      {/* Region grid */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row gap-px bg-gray-800">
        {REGIONS.map((region) => {
          const isBusy = submittingId !== null;
          const isThis = submittingId === region.id;
          return (
            <button
              key={region.id}
              type="button"
              disabled={isBusy}
              aria-label={isThis ? `Saving ${region.label}` : `Select ${region.label}`}
              onClick={() => onSelectRegion(region.id)}
              className={[
                'group relative flex min-h-[180px] flex-1 basis-0 flex-col overflow-hidden bg-gray-900 text-left',
                'cursor-pointer transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                'disabled:cursor-not-allowed disabled:opacity-40',
              ].join(' ')}
            >
              {/* Background image */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={region.imageSrc}
                  alt=""
                  fill
                  className="object-cover blur-[2px] scale-110 opacity-25 transition-all duration-500 group-hover:opacity-35 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={region.id === 'toronto'}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />

              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-4 py-10">
                <span className="text-center text-[22px] sm:text-[26px] font-bold text-white leading-tight tracking-tight">
                  {region.label}
                </span>
                <span
                  className={[
                    'inline-flex min-h-[44px] w-full max-w-[200px] items-center justify-center rounded-xl font-bold text-[14.5px] transition-all duration-200',
                    isThis
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white text-gray-950 group-hover:bg-gray-100 shadow-md',
                  ].join(' ')}
                >
                  {isThis ? 'Saving…' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="shrink-0 bg-gray-950 pb-[env(safe-area-inset-bottom)]">
        <div className="h-1 w-full bg-gray-800">
          <div className="h-full bg-brand transition-all duration-300" style={{ width: '75%' }} />
        </div>
        <p className="py-2 text-center text-[11px] text-gray-500">Step 3 of 4</p>
      </div>
    </div>
  );
}

export default function RegionSelectionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading…</div>}>
      <RegionSelectionInner />
    </Suspense>
  );
}
