'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { PreferredCommunication } from '@/types/preferences';

const STEPS = ['Email', 'Topics', 'Region', 'Done'];

export default function NextVotersLineLandingPage() {
  const router = useRouter();
  const [contact, setContact] = useState('');

  const preferredCommunication: PreferredCommunication = 'email';

  const validate = () => {
    const trimmed = contact.trim();
    if (!trimmed) return 'Please enter your email.';
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!ok) return 'Please enter a valid email address.';
    return null;
  };

  const onContinue = () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }
    router.push(
      `/alerts/interests?contact=${encodeURIComponent(contact.trim())}&type=${encodeURIComponent(preferredCommunication)}`
    );
  };

  const step = 0;

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-page flex flex-col pb-20">
      <div className="flex-1 flex flex-col justify-center w-full max-w-[560px] mx-auto px-5 sm:px-6 pt-10 pb-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={[
                  'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold',
                  i <= step ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400',
                ].join(' ')}
              >
                {i + 1}
              </div>
              <span
                className={[
                  'text-[12px] font-medium hidden sm:block',
                  i <= step ? 'text-gray-700' : 'text-gray-400',
                ].join(' ')}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={['flex-1 h-px w-6 sm:w-8', i < step ? 'bg-brand' : 'bg-gray-200'].join(' ')} />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] font-bold text-gray-950 mb-4 leading-[1.1] tracking-tight">
          Get weekly updates
          <br />
          about your local politics
        </h1>

        <p className="text-gray-700 mb-10 leading-snug">
          <span className="block text-[16px] font-medium text-gray-500">Always be in the know</span>
          <span className="text-[20px] sm:text-[22px] font-extrabold">
            <span className="relative inline-block">
              <span className="relative z-10">100% for free</span>
              <svg
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-1.5 h-3.5 w-[112%] -translate-x-[6%]"
                viewBox="0 0 240 36"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M8 12 C 70 34, 170 34, 232 12" stroke="#E12D39" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </span>
        </p>

        <div className="w-full max-w-[400px]">
          <div className="flex items-stretch border-2 border-gray-950 rounded-xl overflow-hidden bg-white">
            <div className="flex items-center justify-center px-4 border-r-2 border-gray-950 bg-gray-50">
              <Mail className="h-5 w-5 text-gray-700" aria-hidden="true" />
            </div>
            <input
              className="flex-1 min-w-0 px-4 py-3.5 text-[15px] sm:text-[17px] font-semibold text-gray-950 placeholder:text-gray-400 focus:outline-none"
              type="email"
              inputMode="email"
              placeholder="your@email.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onContinue(); }}
            />
          </div>

          <button
            type="button"
            className="mt-3.5 w-full inline-flex items-center justify-center min-h-[50px] px-6 py-3.5 text-[16px] sm:text-[18px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors touch-manipulation shadow-sm"
            onClick={onContinue}
          >
            Never fall behind again
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-page/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full bg-brand rounded-r-full transition-all duration-300" style={{ width: '25%' }} />
        </div>
        <p className="py-2 text-center text-[11px] text-gray-400">Step 1 of 4</p>
      </div>
    </div>
  );
}
