'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { REGIONS } from '@/data/regions';

const CheckIcon = ({ color = '#6b7280' }: { color?: string }) => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.12" />
    <path
      d="M4.5 8.5l2.5 2.5 4.5-5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function SubscriptionCards() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [basicLoading, setBasicLoading] = useState(false);
  const [proLoading, setProLoading] = useState(false);

  const handleCheckout = async (plan: 'basic' | 'pro') => {
    if (!selectedRegion) {
      alert('Please select a region first.');
      return;
    }
    const setLoading = plan === 'basic' ? setBasicLoading : setProLoading;
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page">
      <section className="px-5 pt-16 pb-10 text-center max-w-[640px] mx-auto">
        <h1 className="text-[36px] sm:text-[48px] font-bold text-gray-950 leading-[1.05] tracking-tight mb-4">
          Welcome to NV Local
        </h1>
        <p className="text-[16px] text-gray-500 leading-relaxed">
          Choose your plan to get started with weekly updates about local politics in your region.
        </p>
      </section>

      {/* Region selector */}
      <section className="px-4 sm:px-6 max-w-[800px] mx-auto mb-10">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center mb-5">
          Select your region
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => setSelectedRegion(region.id)}
              className={[
                'relative group rounded-xl overflow-hidden border-2 transition-all min-h-[120px]',
                selectedRegion === region.id
                  ? 'border-brand shadow-md'
                  : 'border-gray-200 hover:border-gray-300',
              ].join(' ')}
            >
              <div className="absolute inset-0">
                <Image
                  src={region.imageSrc}
                  alt=""
                  fill
                  className="object-cover opacity-20 group-hover:opacity-30 transition-opacity"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center gap-2 p-6">
                <span className="text-[16px] font-bold text-gray-950">{region.label}</span>
                {selectedRegion === region.id && (
                  <CheckCircle2 className="w-5 h-5 text-brand" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-4 sm:px-6 max-w-[800px] mx-auto mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Basic */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 flex flex-col shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
            <div className="mb-7">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Basic</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-[44px] font-bold text-gray-950 leading-none">$0</span>
              </div>
              <p className="text-[13px] text-gray-400">forever</p>
            </div>
            <ul className="flex flex-col gap-3.5 mb-8 flex-1" aria-label="Basic plan features">
              {['1 topic of your choice', 'Weekly civic updates via email', 'Nonpartisan policy analysis'].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon color="#9ca3af" />
                  <span className="text-[14.5px] text-gray-600 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleCheckout('basic')}
              disabled={basicLoading || !selectedRegion}
              className="w-full text-center px-6 py-3.5 text-[14.5px] font-bold text-gray-700 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {basicLoading ? 'Loading…' : 'Start for free'}
            </button>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-gray-950 bg-gray-950 p-8 flex flex-col shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center bg-brand text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow">
                Most Popular
              </span>
            </div>
            <div className="mb-7">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pro</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[44px] font-bold text-white leading-none">$5</span>
                <span className="text-[15px] text-gray-400">/&nbsp;mo</span>
              </div>
              <p className="text-[13px] text-gray-500">billed monthly &middot; cancel anytime</p>
            </div>
            <ul className="flex flex-col gap-3.5 mb-8 flex-1" aria-label="Pro plan features">
              {[
                'All 3 topics — Immigration, Civil Rights, Economy',
                'Weekly civic updates via email',
                'Nonpartisan policy analysis',
                'Cancel anytime, no questions asked',
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <CheckIcon color="#E12D39" />
                  <span className="text-[14.5px] text-gray-300 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleCheckout('pro')}
              disabled={proLoading || !selectedRegion}
              className="w-full px-6 py-3.5 text-[14.5px] font-bold text-gray-950 bg-white rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {proLoading ? 'Loading…' : 'Subscribe to Pro →'}
            </button>
          </div>
        </div>
        {!selectedRegion && (
          <p className="text-center text-[12.5px] text-gray-400 mt-5">
            Select a region above to continue
          </p>
        )}
      </section>
    </div>
  );
}
