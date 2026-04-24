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
                  <span className="font-semibold text-gray-900">{analytics?.responseCount ?? "—"}</span> answers provided so far
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
            </div>
          </div>
        </section>

        {/* Google for Nonprofits Support Section */}
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <p className="text-sm text-gray-600 mb-3 font-plus-jakarta-sans">
              Proud to be supported by
            </p>
            <div className="flex justify-center items-center gap-8 md:gap-12">
              <img
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
                className="h-32 object-contain"
              />
              <img
                src="/lookup-live-logo.png"
                alt="LOOK UP"
                className="h-16 object-contain"
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
                  Z&apos;s chief civic classroom, but that&apos;s where misinformation
                  thrives. Young voters spend nearly three hours daily scrolling
                  past election-related content, much of it unverified and
                  influenced, propagated by engagement algorithms. Despite
                  being digital natives, Gen Z encounters a barrage of
                  conflicting sources that deters them from seeking quality
                  information. The gap between confidence and skill is widening
                  dangerously.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </ClientMountWrapper>
  );
};

export default Home;