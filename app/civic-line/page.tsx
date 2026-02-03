'use client';

import { useMemo, useState } from 'react';
import { handleSubscribe } from '@/server-actions/sub-to-civicline';
import topicOptions from '@/data/topic-options';

type PreferredCommunication = 'email' | 'sms';

const EmailServiceProduct = () => {
  const [preferredCommunication, setPreferredCommunication] =
    useState<PreferredCommunication>('email');

  const [contact, setContact] = useState('');
  const [topics, setTopics] = useState<string[]>([]);

  const contactConfig = useMemo(() => {
    if (preferredCommunication === 'sms') {
      return {
        label: 'Your Phone Number',
        placeholder: '+1 (647) 555-0123',
        inputMode: 'tel' as const,
        type: 'tel' as const,
      };
    }
    return {
      label: 'Your Email Address',
      placeholder: 'changemaker@nextvoters.com',
      inputMode: 'email' as const,
      type: 'email' as const,
    };
  }, [preferredCommunication]);

  const validate = () => {
    const trimmed = contact.trim();

    if (!trimmed) return `Please enter your ${preferredCommunication}.`;
    if (topics.length === 0) return 'Please select at least one topic.';

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

  const onSubscribe = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const result = await handleSubscribe(contact.trim(), topics);
    if (result?.error) {
      alert(result.error);
    } else {
      alert('Subscribed successfully!');
      setContact('');
      setTopics([]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-[680px] px-6 py-20 text-center">
        <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans leading-tight">
          Become informed.
        </h1>

        <p className="text-[16px] text-gray-600 mb-12 font-plus-jakarta-sans leading-relaxed">
          Changing the world comes from being educated!
        </p>

        <div className="flex flex-col items-center gap-4">
          <label className="font-plus-jakarta-sans text-gray-900">
            What is your preferred way to be contacted?
          </label>

          <select
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 text-[14px] font-plus-jakarta-sans"
            value={preferredCommunication}
            onChange={(e) => {
              const next = e.target.value as PreferredCommunication;
              setPreferredCommunication(next);
              setContact(''); // reset when switching modes
            }}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>

          <label className="font-plus-jakarta-sans text-gray-900">
            {contactConfig.label}
          </label>

          <input
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 text-[14px] font-plus-jakarta-sans"
            type={contactConfig.type}
            inputMode={contactConfig.inputMode}
            placeholder={contactConfig.placeholder}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <label className="font-plus-jakarta-sans text-gray-900">
            What are your areas of interest?
          </label>

          <select
            multiple
            className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900 text-[14px] font-plus-jakarta-sans"
            value={topics}
            onChange={(e) =>
              setTopics(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <button
            className="mt-4 inline-flex items-center justify-center px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans font-medium"
            onClick={onSubscribe}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailServiceProduct;
