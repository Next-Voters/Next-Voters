'use client';

import { useState } from 'react';
import { PreferredCommunication } from '@/types/preferences';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sendEmail } from '../../server-actions/send-confirmation-email';

const EmailServiceProduct = () => {
  const router = useRouter();
  const [contact, setContact] = useState('');
  // Step 1 collects contact only; step 2 collects interests.
  const [preferredCommunication] = useState<PreferredCommunication>('email');

  const validate = () => {
    const trimmed = contact.trim();

    if (!trimmed) return `Please enter your ${preferredCommunication}.`;

    if (preferredCommunication === 'email') {
      // simple email check (good enough for client-side)
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!ok) return 'Please enter a valid email address.';
    } else {
      // simple phone check (digits + common formatting chars)
      const ok = /^[0-9+\-().\s]{7,}$/.test(trimmed);
      if (!ok) return 'Please enter a valid phone number.';
    }

    return null;
  };

  const onContinue = async () => {
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
    const result = await handleSubscribe(contact.trim(), topics, preferredCommunication);
    if (result?.error) {
      alert(result.error);
    } else {
      alert('Subscribed successfully!');
      sendEmail(contact);
      setContact('');
      setTopics([]);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-white pb-20">
      <div className="w-full max-w-[980px] px-6 pt-20 pb-28">
        <h1 className="text-[44px] sm:text-[52px] font-bold text-gray-900 mb-8 font-plus-jakarta-sans leading-[1.05] tracking-tight">
          <span className="block">Get weekly executive updates</span>
          <span className="block md:whitespace-nowrap">on NYC politics you care about</span>
        </h1>

        <p className="text-gray-900 font-plus-jakarta-sans leading-tight mb-8">
          <span className="block text-[16px] sm:text-[18px] font-semibold">
            Always be in the know
          </span>
          <span className="block text-[18px] sm:text-[20px] font-extrabold">
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
            <div className="flex items-center justify-center px-3 border-r-2 border-gray-900">
              <Mail className="h-5 w-5 text-gray-900" aria-hidden="true" />
            </div>
            <input
              className="flex-1 px-4 py-3 text-[18px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none font-plus-jakarta-sans"
              type="email"
              inputMode="email"
              placeholder="example@email.com"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 text-[20px] font-bold text-white bg-[#E12D39] rounded-lg hover:bg-[#c92631] transition-colors font-plus-jakarta-sans"
            onClick={onContinue}
          >
            Never fall behind again
          </button>
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
};

export def