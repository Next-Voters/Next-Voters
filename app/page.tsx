"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

type AnalyticsCounts = {
  requestCount: number;
  responseCount: number;
};

const Home = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const [analytics, setAnalytics] = useState<AnalyticsCounts | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as AnalyticsCounts;
        if (cancelled) return;

        setAnalytics(data);
      } catch {
        // analytics isn't critical for page function
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRedirectToChat = () => {
    router.push(`/chat?message=${encodeURIComponent(message)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleRedirectToChat();
    }
  };

  return (
    <ClientMountWrapper className="min-h-screen bg-white">
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16">
          <div className="relative max-w-[1000px] mx-auto px-6 text-center">
            <h1 className="text-[48px] md:text-[56px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans leading-tight">
              Next Voters
            </h1>
            <p className="text-[16px] md:text-[18px] text-gray-600 mb-12 font-plus-jakarta-sans leading-relaxed max-w-2xl mx-auto">
              Technology that empowers voters to understand policy and legislation fast
            </p>

            {/* Search + Preferences */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm mb-12">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask any question about policy"
                  className="w-full pl-6 pr-16 py-4 text-[16px] text-gray-900 rounded-lg border-2 border-red-300 focus:outline-none focus:border-red-400 bg-gray-50 font-plus-jakarta-sans relative z-10"
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
                  onClick={handleRedirectToChat}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <PreferenceSelector />
                </div>
                <div className="font-plus-jakarta-sans text-[13px] text-gray-600 whitespace-nowrap">
                  <span className="font-semibold text-gray-900">{analytics?.responseCount}</span> answers provided so far
                </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-12">
              <a
                href="/chat"
                className="inline-block px-8 py-4 text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
              >
                Start asking questions
              </a>
              <a
                href="/fellowship"
                className="inline-block px-8 py-4 text-[16px] font-semibold text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans"
              >
                Apply to fellowship
              </a>
            </div>

            {/* Stanford Professor Testimonial */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 pt-8 pb-4 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
                    alt="Professor Morris P. Fiorina"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-[18px] font-semibold text-gray-900 font-plus-jakarta-sans mb-1">
                      Professor Morris P. Fiorina
                    </h3>
                    <p className="text-[14px] text-gray-600 font-plus-jakarta-sans">
                      Professor of Political Science, Stanford University
                    </p>
                  </div>
                </div>
                <p className="text-[16px] text-gray-700 leading-relaxed font-plus-jakarta-sans mb-4 italic text-left">
                  "I enjoyed my session with the Youth Civic Leaders fellows. They were knowledgeable, engaged and asked good questions. What I found very exciting was their geographic heterogeneity which brings a variety of different perspectives to their work."
                </p>
                <div className="flex items-center justify-center pt-4 border-t border-gray-200 pb-4 border-b border-gray-200">
                  <img
                    src="https://logos-world.net/wp-content/uploads/2021/10/Stanford-Symbol.png"
                    alt="Stanford University"
                    className="h-24 md:h-28 w-auto"
                  />
                </div>
                <div className="flex justify-center pt-4">
                  <a
                    href="/fellowship"
                    className="inline-block px-8 py-3 text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
                  >
                    Join our fellowship
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google for Nonprofits Support Section */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-3 font-plus-jakarta-sans">
              Proud to be supported by
            </p>
            <div className="flex justify-center">
              <img
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
                className="h-32 object-contain"
              />
            </div>
          </div>
        </section>

        {/* 87% Statistics Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="text-[100px] md:text-[120px] font-bold text-gray-900 leading-none mb-6 font-plus-jakarta-sans">
                  87%
                </div>
                <p className="text-[16px] md:text-[18px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                  of people believe online disinformation has harmed their
                  country's politics{" "}
                  <span className="text-gray-500 text-[14px] md:text-[16px]">
                    (according to a survey by the United Nations)
                  </span>
                </p>
              </div>
              <div>
                <h2 className="text-[28px] md:text-[32px] font-semibold text-gray-900 mb-6 leading-tight font-plus-jakarta-sans">
                  Political misinformation is distracting Gen Z from voting on
                  facts
                </h2>
                <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                  TikTok, Instagram, and other social platforms have become Gen
                  Z's chief civic classroom, but that's where misinformation
                  thrives. Young voters spend nearly three hours daily scrolling
                  past election-related content—much of it unverified and
                  influenced content—propagated by engagement algorithms. Despite
                  being digital natives, Gen Z encounters a barrage of
                  conflicting sources that deters them from seeking quality
                  information. The gap between confidence and skill is widening
                  dangerously.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fellowship Section */}
        <section className="py-20 md:py-24 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 mb-4 font-plus-jakarta-sans leading-tight">
              Join the Next Voters Fellowship
            </h2>
            <p className="text-[18px] text-gray-600 mb-12 font-plus-jakarta-sans max-w-2xl mx-auto">
              Make a real change and strengthen democracy.
            </p>
            <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-2xl p-10 md:p-12 mb-10 shadow-lg">
              <p className="text-[18px] text-gray-900 mb-4 font-plus-jakarta-sans leading-[1.4]">
                Get access to a pool of
              </p>
              <div
                className="text-[64px] md:text-[72px] font-extrabold mb-4 leading-[1.05] font-plus-jakarta-sans"
                style={{
                  background: "linear-gradient(135deg, #B91C1C 0%, #1E40AF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                $10,000+
              </div>
              <p className="text-[17px] text-gray-900 leading-[1.5] font-plus-jakarta-sans">
                in no-strings-attached, impact-based grants for top-performing
                fellows
              </p>
            </div>
            <a
              href="/fellowship"
              className="inline-block px-10 py-4 text-[16px] text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-plus-jakarta-sans font-semibold shadow-sm"
            >
              Learn more
            </a>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
};

export default Home;