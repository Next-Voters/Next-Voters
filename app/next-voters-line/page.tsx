'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { PreferredCommunication } from '@/types/preferences';

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

    const trimmed = contact.trim();
    router.push(
      `/next-voters-line/interests?contact=${encodeURIComponent(trimmed)}&type=${encodeURIComponent(
        preferredCommunication
      )}`
    );
  };

  const progressPercent = 33;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white pb-20">
      <div className="w-full max-w-[980px] px-6 pt-20 pb-28">
        <h1 className="text-[44px] sm:text-[52px] font-bold text-gray-900 mb-10 font-plus-jakarta-sans leading-[1.05] tracking-tight">
          <span className="block">Get weekly executive updates</span>
          <span className="block md:whitespace-nowrap">on NYC politics you care about</span>
        </h1>

        <p className="text-gray-900 font-plus-jakarta-sans leading-tight mb-10">
          <span className="block text-[18px] sm:text-[20px] font-semibold">Always be in the know</span>
          <span className="block text-[22px] sm:text-[24px] font-extrabold">
            <span className="relative inline-block">
              <span className="relative z-10">100% for free</span>
              <svg
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-2 h-4 w-[112%] -translate-x-[6%]"
                viewBox="0 0 240 36"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M8 12 C 70 34, 170 34, 232 12"
                  stroke="#E12D39"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </span>
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
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onContinue();
              }}
            />
          </div>

          <button
            type="button"
            className="mt-5 w-full inline-flex items-center justify-center px-6 py-4 text-[22px] font-bold text-white bg-[#E12D39] rounded-lg hover:bg-[#c92631] transition-colors font-plus-jakarta-sans"
            onClick={onContinue}
          >
            Never fall behind again
          </button>
        </div>
      </div>

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

