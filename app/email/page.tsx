'use client';

import { useState } from 'react';
import { handleSubscribeEmail } from '@/server-actions/sub-to-email';
import topics from '@/data/topic-options';

const EmailServiceProduct = () => {

  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(null);

  return (
    <div className="w-full bg-white">
        <div className="max-w-[680px] mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-[48px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans leading-tight">
            Become informed.
          </h1>
          
          <p className="text-[16px] text-gray-600 mb-10 font-plus-jakarta-sans leading-relaxed">
            Changing the world comes from being educated!
          </p>
          
          <input 
            className="w-full max-w-sm mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-900 text-[14px] font-plus-jakarta-sans"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select 
            className="w-full max-w-sm mb-6 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent text-gray-900 text-[14px] font-plus-jakarta-sans"
            value={topic || ''}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option value="" disabled>Select a topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <button 
            className="inline-block px-8 py-3 text-[14px] text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans font-medium"
            onClick={async () => {
              const result = await handleSubscribeEmail(email);
              if (result?.error) {
                alert(result.error);
              } else {
                alert('Subscribed successfully!');
              }
            }}
          >
            Subscribe
          </button>
        </div>
    </div>
  );
}

export default EmailServiceProduct;
