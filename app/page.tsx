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
    <ClientMountWrapper className="min-h-screen bg-page">
      <div className="w-full">
        {/* Hero Section */}
        <section className="relative pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="relative max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-[36px] xs:text-[42px] sm:text-[48px] md:text-[56px] font-bold text-gray-900 mb-4 sm:mb-6 font-plus-jakarta-sans leading-tight">
              Next Voters
            </h1>
            <p className="text-[15px] sm:text-[16px] md:text-[18px] text-gray-600 mb-8 sm:mb-12 font-plus-jakarta-sans leading-relaxed max-w-2xl mx-auto px-0 sm:px-2">
              Technology that empowers voters to understand policy and legislation fast
            </p>

            {/* Search + Preferences */}
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-8 sm:mb-12">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask any question about policy"
                  className="w-full pl-4 sm:pl-6 pr-14 sm:pr-16 py-3.5 sm:py-4 text-[16px] text-gray-900 rounded-lg border-2 border-red-300 focus:outline-none focus:border-red-400 bg-white font-plus-jakarta-sans relative z-10 min-h-[48px]"
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  aria-label="Submit question"
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 min-w-[44px] min-h-[44px] w-10 h-10 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20 touch-manipulation"
                  onClick={handleRedirectToChat}
                >
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

                <div className="mt-4 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <PreferenceSelector />
                </div>
                <div className="font-plus-jakarta-sans text-[12px] sm:text-[13px] text-gray-600 text-center xs:text-left shrink-0">
                  <span className="font-semibold text-gray-900">{analytics?.responseCount ?? "—"}</span> answers provided so far
                </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-12 sm:mb-16 mt-8 sm:mt-12">
              <a
                href="/chat"
                className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm touch-manipulation"
              >
                Start asking questions
              </a>
              <a
                href="/fellowship"
                className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-semibold text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-plus-jakarta-sans touch-manipulation"
              >
                Apply to fellowship
              </a>
            </div>

            {/* Stanford Professor Testimonial */}
            <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="bg-page border border-gray-200 rounded-xl px-5 sm:px-8 pt-6 sm:pt-8 pb-4 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
                    alt="Professor Morris P. Fiorina"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 font-plus-jakarta-sans mb-1">
                      Professor Morris P. Fiorina
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-600 font-plus-jakarta-sans">
                      Professor of Political Science, Stanford University
                    </p>
                  </div>
                </div>
                <p className="text-[15px] sm:text-[16px] text-gray-700 leading-relaxed font-plus-jakarta-sans mb-4 italic text-left">
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
                    className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 py-3 text-[15px] sm:text-[16px] font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm touch-manipulation"
                  >
                    Join our fellowship
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google for Nonprofits Support Section */}
        <section className="py-10 sm:py-12 bg-page">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-gray-600 mb-3 font-plus-jakarta-sans">
              Proud to be supported by
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12">
              <img
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
                className="h-24 sm:h-32 object-contain"
              />
              <img
                src="/lookup-live-logo.png"
                alt="LOOK UP"
                className="h-14 sm:h-16 object-contain"
              />
            </div>
          </div>
        </section>

        {/* Mission Section - Letter Style */}
        <section id="mission" className="py-12 sm:py-16 md:py-20 bg-page scroll-mt-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="px-5 sm:px-8 md:px-12 pt-8 sm:pt-10 pb-6 sm:pb-8 md:pt-12 md:pb-10">
                <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 mb-4 sm:mb-6 font-plus-jakarta-sans">
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
                <div className="mt-6 sm:mt-8">
                  <a
                    href="/next-voters-line"
                    className="inline-flex items-center justify-center min-h-[48px] px-8 sm:px-10 py-3.5 sm:py-4 text-[16px] sm:text-[18px] font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-plus-jakarta-sans shadow-sm touch-manipulation"
                  >
                    <strong>Subscribe to Alerts</strong>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem: Disinformation & Democracy Section */}
        <section className="py-16 sm:py-24 md:py-32 bg-page">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            {/* Lead - editorial, human */}
            <div className="mb-12 sm:mb-20 md:mb-24">
              <p className="text-[13px] font-medium tracking-widest uppercase mb-4 font-plus-jakarta-sans" style={{ color: "#78716C" }}>
                The problem
              </p>
              <h2 className="text-[22px] sm:text-[28px] md:text-[40px] font-semibold mb-4 sm:mb-6 font-plus-jakarta-sans leading-[1.2]" style={{ color: "#1C1917" }}>
                Political misinformation is distracting Gen Z from voting on facts
              </h2>
              <p className="text-[17px] md:text-[19px] leading-[1.7] font-plus-jakarta-sans max-w-2xl" style={{ color: "#57534E" }}>
                A global crisis of trust, civic literacy, and information integrity is reshaping how the next generation engages with democracy. Here&apos;s what the data shows.
              </p>
            </div>

            {/* Hero stat - warm, understated */}
            <div className="mb-12 sm:mb-20 rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 text-center" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="text-[56px] sm:text-[72px] md:text-[100px] font-semibold leading-none mb-3 sm:mb-4 font-plus-jakarta-sans" style={{ color: "#1C1917" }}>
                87%
              </div>
              <p className="text-[17px] md:text-[19px] font-plus-jakarta-sans max-w-xl mx-auto leading-relaxed" style={{ color: "#44403C" }}>
                of people believe online disinformation has already harmed political life in their country
              </p>
              <p className="text-[13px] font-plus-jakarta-sans mt-4" style={{ color: "#A8A29E" }}>
                UNESCO-Ipsos survey, 8,000 respondents across 16 countries (2023)
              </p>
            </div>

            {/* Stats grid - warm cards, soft accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-20">
              {[
                { stat: "85%", text: "are concerned about disinformation's influence on fellow citizens" },
                { stat: "94%", text: "have been misled by disinformation before realizing it was false" },
                { stat: "68%", text: "identify social media as the primary source of disinformation" },
                { stat: "78%", text: "often encounter deliberately falsified information on social media" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}>
                  <div className="text-[28px] sm:text-[32px] md:text-[38px] font-semibold leading-none mb-2 font-plus-jakarta-sans" style={{ color: "#B45309" }}>{item.stat}</div>
                  <p className="text-[14px] leading-[1.5] font-plus-jakarta-sans" style={{ color: "#57534E" }}>{item.text} <span style={{ color: "#A8A29E" }}>(UNESCO-Ipsos, 2023)</span></p>
                </div>
              ))}
            </div>

            {/* Gen Z section - two column, warm */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-start mb-12 sm:mb-20">
              <div>
                <p className="text-[12px] font-medium tracking-widest uppercase mb-4 font-plus-jakarta-sans" style={{ color: "#B45309" }}>Where Gen Z gets their news</p>
                <h3 className="text-[22px] md:text-[26px] font-semibold mb-6 font-plus-jakarta-sans leading-tight" style={{ color: "#1C1917" }}>
                  Three hours a day. Influencers as teachers.
                </h3>
                <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans mb-6" style={{ color: "#44403C" }}>
                  Teens spend nearly three hours a day on social media (Pew Research, 2024). Almost 40% of young adults aged 18 to 29 receive news through social media influencers, and 65% of those consumers say influencers helped them better understand current events and civic issues (Pew Research, 2024). YouTube, TikTok, and Instagram dominate. Facebook has dropped from 71% teen usage in 2014 to 32% in 2024 (Pew Research).
                </p>
                <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans" style={{ color: "#44403C" }}>
                  Despite growing up online, research from the University of Virginia found that Gen Z and millennials are more vulnerable to fake news than older adults. Older adults are better at spotting AI-generated fake headlines, thanks to experience built over a lifetime.
                </p>
              </div>
              <div className="rounded-2xl p-8" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}>
                <div className="space-y-8">
                  {[
                    { stat: "2h 55m", label: "average daily social media use among teens", cite: "Pew, 2024" },
                    { stat: "67%", label: "of people under 35 use social media frequently for news vs. 31% of those 55+", cite: "Ipsos" },
                    { stat: "56%", label: "of internet users get news from social media vs. 44% from television", cite: "Ipsos" },
                  ].map((item, i) => (
                    <div key={i} className="pb-8 last:pb-0 last:border-0" style={{ borderBottom: i < 2 ? "1px solid #E7E5E4" : "none" }}>
                      <div className="text-[36px] md:text-[42px] font-semibold leading-none font-plus-jakarta-sans" style={{ color: "#B45309" }}>{item.stat}</div>
                      <p className="text-[14px] mt-1 font-plus-jakarta-sans" style={{ color: "#57534E" }}>{item.label}</p>
                      <p className="text-[12px] mt-0.5 font-plus-jakarta-sans" style={{ color: "#A8A29E" }}>({item.cite})</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust crisis - warm navy, not harsh black */}
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-14 mb-12 sm:mb-20" style={{ backgroundColor: "#1E293B" }}>
              <p className="text-[12px] font-medium tracking-widest uppercase mb-4 font-plus-jakarta-sans" style={{ color: "#94A3B8" }}>A trust crisis</p>
              <h3 className="text-[22px] md:text-[26px] font-semibold mb-6 font-plus-jakarta-sans text-white">
                Who do you believe?
              </h3>
              <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans mb-8 max-w-2xl" style={{ color: "#CBD5E1" }}>
                Young adults and some partisan groups now trust social media nearly as much as national news outlets. In one Pew survey (2024), 37% of Republicans trusted social media for information compared to 40% who trusted national news, a 30-point drop in national news trust since 2016. Roughly half of Americans say it&apos;s hard to know what&apos;s true about election news (Pew, AP-NORC). Only 10% place great trust in government information on social media, yet 40% use it daily for government-related news (AP-NORC, 2024).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-[36px] font-semibold font-plus-jakarta-sans" style={{ color: "#FBBF24" }}>~50%</div>
                  <p className="text-[14px] mt-1 font-plus-jakarta-sans" style={{ color: "#94A3B8" }}>of Americans struggle to know if election information is true (AP-NORC, 2024)</p>
                </div>
                <div className="rounded-xl p-6" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-[36px] font-semibold font-plus-jakarta-sans" style={{ color: "#FBBF24" }}>64%</div>
                  <p className="text-[14px] mt-1 font-plus-jakarta-sans" style={{ color: "#94A3B8" }}>lack confidence in the reliability of information from AI chatbots (OECD)</p>
                </div>
              </div>
            </div>

            {/* AI and deepfakes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-start mb-12 sm:mb-20">
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl p-8" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <div className="space-y-8">
                    {[
                      { stat: "133", label: "deepfakes tracked across 30 countries in 2024 elections", cite: "GMF" },
                      { stat: "80%", label: "of countries with competitive 2024 elections had generative AI incidents", cite: "IPIE" },
                      { stat: "69%", label: "of AI election incidents were described as having a harmful role", cite: "IPIE" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-[32px] md:text-[40px] font-semibold leading-none shrink-0 font-plus-jakarta-sans" style={{ color: "#B45309" }}>{item.stat}</div>
                        <div>
                          <p className="text-[14px] font-plus-jakarta-sans" style={{ color: "#44403C" }}>{item.label}</p>
                          <p className="text-[12px] mt-0.5 font-plus-jakarta-sans" style={{ color: "#A8A29E" }}>({item.cite})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-[12px] font-medium tracking-widest uppercase mb-4 font-plus-jakarta-sans" style={{ color: "#B45309" }}>AI and deepfakes in elections</p>
                <h3 className="text-[22px] md:text-[26px] font-semibold mb-6 font-plus-jakarta-sans leading-tight" style={{ color: "#1C1917" }}>
                  The barriers have never been lower
                </h3>
                <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans mb-6" style={{ color: "#44403C" }}>
                  In 2024, over 60 countries representing nearly half the global population held elections. AI-generated content became a major factor. Audio deepfakes dominated (69% of instances), followed by video (55%) and images (20%) (GMF). Almost half of AI-generated incidents had no known source; 25% came from political candidates and parties, 20% from foreign actors (IPIE).
                </p>
                <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans" style={{ color: "#44403C" }}>
                  52% of adults are concerned about AI tools&apos; impact on how they get information (OECD Truth Quest Survey). The barriers to creating convincing fake media have never been lower.
                </p>
              </div>
            </div>

            {/* Civic knowledge gap */}
            <div className="rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-14" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E7E5E4" }}>
              <p className="text-[12px] font-medium tracking-widest uppercase mb-4 font-plus-jakarta-sans" style={{ color: "#B45309" }}>The civic knowledge gap</p>
              <h3 className="text-[22px] md:text-[26px] font-semibold mb-6 font-plus-jakarta-sans leading-tight" style={{ color: "#1C1917" }}>
                Four questions. Most couldn&apos;t answer them.
              </h3>
              <p className="text-[16px] leading-[1.7] font-plus-jakarta-sans mb-8 max-w-2xl" style={{ color: "#44403C" }}>
                Young adults aged 18 to 24 show significant gaps in basic civic knowledge (Citizens & Scholars). On a standard four-question civics assessment, only 4% answered all correctly; 40% could answer just one. On average, young adults answered 1.6 out of four questions correctly, regardless of education level. Only 48% plan to vote in the next general election, compared to about two-thirds of the general public. 52% have no or little trust in government institutions; 57% are dissatisfied with the political system.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { stat: "4%", label: "of young adults answered all four civics questions correctly", cite: "Citizens & Scholars" },
                  { stat: "48%", label: "of young adults plan to vote vs. ~66% of the general public", cite: "Citizens & Scholars" },
                  { stat: "61%", label: "of young adults do not identify with either major political party", cite: "Citizens & Scholars" },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-6 bg-page border border-gray-200">
                    <div className="text-[32px] font-semibold leading-none font-plus-jakarta-sans" style={{ color: "#B45309" }}>{item.stat}</div>
                    <p className="text-[14px] mt-2 font-plus-jakarta-sans" style={{ color: "#57534E" }}>{item.label}</p>
                    <p className="text-[12px] mt-1 font-plus-jakarta-sans" style={{ color: "#A8A29E" }}>({item.cite})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Closing CTA - warm, inviting */}
            <div className="mt-12 sm:mt-20 text-center px-2">
              <p className="text-[15px] sm:text-[17px] md:text-[19px] leading-relaxed font-plus-jakarta-sans mb-6 sm:mb-8 max-w-xl mx-auto" style={{ color: "#57534E" }}>
                The gap between confidence and skill is widening. Young voters deserve tools that cut through the noise.
              </p>
              <a
                href="/chat"
                className="inline-flex items-center justify-center min-h-[48px] px-6 sm:px-8 py-3.5 text-[15px] font-medium rounded-full font-plus-jakarta-sans transition-all hover:opacity-90 touch-manipulation"
                style={{ backgroundColor: "#1C1917", color: "#FFFFFF" }}
              >
                Start asking questions
              </a>
            </div>
          </div>
        </section>

        {/* Fellowship Section */}
        <section className="py-12 sm:py-20 md:py-24 bg-page">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-bold text-gray-900 mb-3 sm:mb-4 font-plus-jakarta-sans leading-tight">
              Join the Next Voters Fellowship
            </h2>
            <p className="text-[16px] sm:text-[18px] text-gray-600 mb-8 sm:mb-12 font-plus-jakarta-sans max-w-2xl mx-auto">
              Make a real change and strengthen democracy.
            </p>
            <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 mb-8 sm:mb-10 shadow-lg">
              <p className="text-[16px] sm:text-[18px] text-gray-900 mb-3 sm:mb-4 font-plus-jakarta-sans leading-[1.4]">
                Get access to a pool of
              </p>
              <div
                className="text-[48px] sm:text-[64px] md:text-[72px] font-extrabold mb-3 sm:mb-4 leading-[1.05] font-plus-jakarta-sans"
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
              className="inline-flex items-center justify-center min-h-[48px] px-8 sm:px-10 py-3.5 sm:py-4 text-[15px] sm:text-[16px] text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors font-plus-jakarta-sans font-semibold shadow-sm touch-manipulation"
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