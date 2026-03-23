"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";
import AuthButtons from "@/components/common/components/auth-buttons";

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
          <div className="absolute top-6 right-6 z-20">
            <AuthButtons variant="desktop" />
          </div>
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

        {/* Mission Section - Letter Style */}
        <section id="mission" className="py-16 md:py-20 bg-gray-50 scroll-mt-20">
          <div className="max-w-2xl mx-auto px-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="px-8 md:px-12 pt-10 pb-8 md:pt-12 md:pb-10">
                <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-6 font-plus-jakarta-sans">
                  Our Mission
                </h2>
                <div className="space-y-4 text-left">
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    Young voters deserve to understand policy and legislation without wading through jargon or partisan spin. We built Next Voters to give the next generation the tools to cut through the noise: clear, AI-powered answers to civic questions, grounded in facts.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    Our goal is simple: help students and first-time voters feel confident, informed, and ready to participate in democracy. Technology should empower civic engagement, not overwhelm it.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    The problem we saw was stark. Gen Z spends nearly three hours a day on social media, much of it scrolling past election-related content. That content is often unverified, algorithmically amplified, and designed to maximize engagement rather than understanding. Despite being digital natives, young voters encounter a barrage of conflicting sources that deters them from seeking quality information. The gap between confidence and skill is widening dangerously.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    We believe every citizen should be able to ask a question about policy and get a straight answer. Not a partisan take. Not a wall of legalese. Just clarity. That&apos;s why we built an AI that explains legislation in plain language, surfaces multiple perspectives, and cites its sources. You can ask about anything: local zoning, federal bills, ballot measures, and get answers you can trust.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    Civic education shouldn&apos;t be a luxury. It shouldn&apos;t require a law degree or a political science PhD. It should be as accessible as opening an app and typing a question. That&apos;s the world we&apos;re building toward: one where informed voting is the norm, not the exception.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    Our fellowship program extends this mission. We support young leaders who want to make a real impact, with grants, mentorship, and a community of peers who care about strengthening democracy. The next generation of voters isn&apos;t apathetic; they&apos;re overwhelmed. Give them the right tools, and they&apos;ll show up.
                  </p>
                  <p className="text-[16px] md:text-[17px] text-gray-700 leading-relaxed font-plus-jakarta-sans">
                    We&apos;re excited to have you here. Whether you&apos;re a student, a first-time voter, or someone who just wants to understand what&apos;s going on, you belong. Let&apos;s make informed voting the norm.
                  </p>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src="/profile-pics/krishiv-thakuria.png"
                    alt="Krishiv Thakuria"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />
                  <div>
                    <p className="font-signature text-2xl md:text-3xl text-gray-900">
                      Krishiv Thakuria
                    </p>
                    <p className="text-[14px] text-gray-600 font-plus-jakarta-sans mt-0.5">
                      President, Next Voters
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="/next-voters-local"
                    className="inline-block px-10 py-4 text-[18px] font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm"
                  >
                    <strong>Subscribe to Alerts</strong>
                  </a>
                  <span className="text-[16px] text-gray-600 font-plus-jakarta-sans font-normal">
                    Dash, it&apos;s free.
                  </span>
                </div>
              </div>
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

export default Home