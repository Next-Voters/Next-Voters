"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

// ─── Sub-sections ────────────────────────────────────────────────────────────

function HeroSection() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const go = () => {
    if (message.trim()) router.push(`/chat?message=${encodeURIComponent(message)}`);
  };

  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-50/40 via-transparent to-transparent"
      />

      <div className="relative max-w-[760px] mx-auto px-5 sm:px-6 text-center">
        <h1 className="text-[40px] xs:text-[48px] sm:text-[56px] md:text-[64px] font-bold text-gray-950 leading-[1.04] tracking-tight mb-5">
          Understand policy.
          <br />
          <span className="text-brand">Vote with confidence.</span>
        </h1>

        <p className="text-[16px] sm:text-[18px] text-gray-500 leading-relaxed max-w-[540px] mx-auto mb-10">
          AI-powered answers to any civic question — grounded in facts, citing sources, showing all perspectives.
        </p>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-md mb-8 max-w-[580px] mx-auto">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about any policy or legislation…"
              className="flex-1 min-w-0 py-3 px-4 text-[15px] text-gray-900 bg-transparent rounded-xl focus:outline-none placeholder:text-gray-400"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
            <button
              type="button"
              aria-label="Submit question"
              onClick={go}
              className="shrink-0 min-w-[44px] min-h-[44px] w-11 h-11 bg-brand rounded-xl flex items-center justify-center hover:bg-brand-hover transition-colors touch-manipulation"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="pt-2 px-1">
            <PreferenceSelector />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <a
            href="/chat"
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[15px] font-semibold text-white bg-gray-950 rounded-xl hover:bg-gray-800 transition-colors shadow-sm touch-manipulation"
          >
            Start asking questions
          </a>
        </div>
      </div>
    </section>
  );
}

function SupportersSection() {
  return (
    <section className="py-8 border-y border-gray-100 bg-white">
      <div className="max-w-[900px] mx-auto px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-400">Supported by</p>
          <div className="flex items-center gap-8 sm:gap-12">
            <img
              src="/google-for-nonprofits-logo.png"
              alt="Google for Nonprofits"
              className="h-10 sm:h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
            <img
              src="/lookup-live-logo.png"
              alt="LOOK UP"
              className="h-8 sm:h-10 object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="py-16 sm:py-20 bg-page">
      <div className="max-w-[680px] mx-auto px-5 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-10 shadow-sm relative">
          {/* Quote mark */}
          <span className="absolute top-6 right-7 text-[80px] leading-none text-gray-100 font-serif select-none" aria-hidden>
            &ldquo;
          </span>

          <p className="text-[16px] sm:text-[17px] text-gray-700 leading-[1.75] italic mb-8 relative">
            "I enjoyed my session with the Youth Civic Leaders fellows. They were knowledgeable, engaged and asked good
            questions. What I found very exciting was their geographic heterogeneity which brings a variety of different
            perspectives to their work."
          </p>

          <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL09e96PtVn5lTnHNXYrEnsfM7BMPiV9D67g&s"
              alt="Professor Morris P. Fiorina"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
            />
            <div>
              <p className="text-[14px] font-semibold text-gray-900">Professor Morris P. Fiorina</p>
              <p className="text-[13px] text-gray-500">Political Science, Stanford University</p>
            </div>
            <img
              src="https://logos-world.net/wp-content/uploads/2021/10/Stanford-Symbol.png"
              alt="Stanford"
              className="h-8 w-auto ml-auto opacity-70"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    label: "Vision",
    text: "A democracy where participation and information isn't restricted by socioeconomic status, race, gender, or any other factor.",
  },
  {
    label: "Mission",
    text: "We create technology that makes trustworthy, unbiased civic education accessible to all so that every voice can be informed.",
  },
  {
    label: "Commitment",
    text: "Clear, AI-powered answers to civic questions — grounded in facts, citing sources, and presenting multiple perspectives.",
  },
];

function PillarsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pillars.map(({ label, text }) => (
            <div key={label} className="flex flex-col gap-3">
              <h2 className="text-[18px] font-bold text-gray-900">{label}</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionLetterSection() {
  return (
    <section className="py-16 sm:py-20 bg-page">
      <div className="max-w-[660px] mx-auto px-5 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand to-red-400" />
          <div className="px-7 sm:px-10 py-10">
            <div className="space-y-4 text-[15.5px] text-gray-700 leading-[1.8]">
              <p>
                Young voters deserve to understand policy and legislation without wading through jargon or partisan spin.
                We built Next Voters to give the next generation the tools to cut through the noise: clear, AI-powered
                answers to civic questions, grounded in facts.
              </p>
              <p>
                Our goal is simple: help students and first-time voters feel confident, informed, and ready to
                participate in democracy. Technology should empower civic engagement, not overwhelm it.
              </p>
              <p>
                Gen Z spends nearly three hours a day on social media, much of it scrolling past election-related
                content that is often unverified and designed to maximize engagement rather than understanding. The gap
                between confidence and skill is widening dangerously.
              </p>
              <p>
                We believe every citizen should be able to ask a question about policy and get a straight answer. Not a
                partisan take. Not a wall of legalese. Just clarity.
              </p>
              <p>
                Civic education shouldn't be a luxury. It should be as accessible as opening an app and typing a
                question. That's the world we're building toward.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src="/profile-pics/krishiv-thakuria.png"
                alt="Krishiv Thakuria"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0"
              />
              <div>
                <p className="font-signature text-2xl text-gray-900">Krishiv Thakuria</p>
                <p className="text-[13px] text-gray-500 mt-0.5">President, Next Voters</p>
              </div>
            </div>

            <div className="mt-7">
              <a
                href="/alerts"
                className="inline-flex items-center justify-center min-h-[46px] px-7 py-3 text-[15px] font-semibold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm touch-manipulation"
              >
                Subscribe to alerts
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const heroStat = {
  number: "87%",
  text: "of people believe online disinformation has already harmed political life in their country",
  source: "UNESCO-Ipsos, 8,000 respondents across 16 countries (2023)",
};

const statsGrid = [
  { stat: "85%", text: "are concerned about disinformation's influence on fellow citizens", cite: "UNESCO-Ipsos" },
  { stat: "94%", text: "have been misled by disinformation before realizing it was false", cite: "UNESCO-Ipsos" },
  { stat: "68%", text: "identify social media as the primary source of disinformation", cite: "UNESCO-Ipsos" },
  { stat: "78%", text: "often encounter deliberately falsified information on social media", cite: "UNESCO-Ipsos" },
];

const genZStats = [
  { stat: "2h 55m", label: "average daily social media use among teens", cite: "Pew, 2024" },
  { stat: "67%", label: "of people under 35 use social media frequently for news vs. 31% of those 55+", cite: "Ipsos" },
  { stat: "56%", label: "of internet users get news from social media vs. 44% from television", cite: "Ipsos" },
];

const trustStats = [
  { stat: "~50%", text: "of Americans struggle to know if election information is true", cite: "AP-NORC, 2024" },
  { stat: "64%", text: "lack confidence in the reliability of information from AI chatbots", cite: "OECD" },
];

const civicsGap = [
  { stat: "4%", label: "of young adults answered all four civics questions correctly", cite: "Citizens & Scholars" },
  { stat: "48%", label: "of young adults plan to vote vs. ~66% of the general public", cite: "Citizens & Scholars" },
  { stat: "61%", label: "of young adults do not identify with either major political party", cite: "Citizens & Scholars" },
];

function StatsSection() {
  return (
    <section className="py-20 sm:py-28 bg-page border-t border-gray-100">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6">
        {/* Section header */}
        <div className="mb-16 sm:mb-20 max-w-2xl">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 mb-4">The problem</p>
          <h2 className="text-[26px] sm:text-[32px] md:text-[40px] font-semibold text-gray-950 leading-[1.2] mb-5">
            Political misinformation is distracting Gen Z from voting on facts
          </h2>
          <p className="text-[16px] sm:text-[17px] text-gray-500 leading-relaxed">
            A global crisis of trust, civic literacy, and information integrity is reshaping how the next generation
            engages with democracy.
          </p>
        </div>

        {/* Hero stat */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 sm:p-14 text-center mb-8 shadow-sm">
          <div className="text-[64px] sm:text-[84px] md:text-[100px] font-bold leading-none text-gray-950 mb-4">
            {heroStat.number}
          </div>
          <p className="text-[16px] sm:text-[18px] text-gray-700 max-w-xl mx-auto leading-relaxed">{heroStat.text}</p>
          <p className="text-[12px] text-gray-400 mt-3">{heroStat.source}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {statsGrid.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <div className="text-[30px] sm:text-[34px] font-bold leading-none text-amber-700 mb-2">{item.stat}</div>
              <p className="text-[13.5px] text-gray-600 leading-snug">
                {item.text}{" "}
                <span className="text-gray-400 text-[12px]">({item.cite})</span>
              </p>
            </div>
          ))}
        </div>

        {/* Gen Z section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-700 mb-4">
              Where Gen Z gets their news
            </p>
            <h3 className="text-[22px] md:text-[26px] font-semibold text-gray-950 mb-5 leading-tight">
              Three hours a day. Influencers as teachers.
            </h3>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-4">
              Teens spend nearly three hours a day on social media (Pew Research, 2024). Almost 40% of young adults aged
              18–29 receive news through social media influencers, and 65% of those consumers say influencers helped them
              better understand current events.
            </p>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              Despite growing up online, research from the University of Virginia found that Gen Z and millennials are
              more vulnerable to fake news than older adults.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-7 divide-y divide-gray-100">
            {genZStats.map((item, i) => (
              <div key={i} className={i === 0 ? "pb-6" : i === genZStats.length - 1 ? "pt-6" : "py-6"}>
                <div className="text-[34px] sm:text-[40px] font-bold leading-none text-amber-700">{item.stat}</div>
                <p className="text-[13.5px] text-gray-600 mt-1 leading-snug">{item.label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">({item.cite})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust crisis box */}
        <div className="bg-gray-950 rounded-2xl p-8 sm:p-12 mb-16">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-500 mb-4">A trust crisis</p>
          <h3 className="text-[22px] md:text-[26px] font-semibold text-white mb-5">Who do you believe?</h3>
          <p className="text-[15px] text-gray-400 leading-relaxed mb-8 max-w-2xl">
            Young adults and some partisan groups now trust social media nearly as much as national news outlets. Only
            10% place great trust in government information on social media, yet 40% use it daily for government-related
            news.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trustStats.map((item, i) => (
              <div key={i} className="rounded-xl p-6 bg-white/5 border border-white/10">
                <div className="text-[34px] font-bold text-amber-400">{item.stat}</div>
                <p className="text-[13.5px] text-gray-400 mt-1 leading-snug">
                  {item.text}{" "}
                  <span className="text-gray-600">({item.cite})</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Civic knowledge gap */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 sm:p-10">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-amber-700 mb-4">
            The civic knowledge gap
          </p>
          <h3 className="text-[22px] md:text-[26px] font-semibold text-gray-950 mb-4 leading-tight">
            Four questions. Most couldn't answer them.
          </h3>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-8 max-w-2xl">
            Young adults aged 18–24 show significant gaps in basic civic knowledge. On a standard four-question civics
            assessment, only 4% answered all correctly; 40% could answer just one. 48% plan to vote vs. ~66% of the
            general public.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {civicsGap.map((item, i) => (
              <div key={i} className="rounded-xl p-5 bg-page border border-gray-200">
                <div className="text-[28px] font-bold leading-none text-amber-700 mb-2">{item.stat}</div>
                <p className="text-[13.5px] text-gray-600 leading-snug">
                  {item.label}{" "}
                  <span className="text-gray-400 text-[12px]">({item.cite})</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="mt-16 text-center">
          <p className="text-[16px] sm:text-[17px] text-gray-500 leading-relaxed mb-7 max-w-lg mx-auto">
            The gap between confidence and skill is widening. Young voters deserve tools that cut through the noise.
          </p>
          <a
            href="/chat"
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15px] font-semibold text-white bg-gray-950 rounded-full hover:bg-gray-800 transition-colors touch-manipulation"
          >
            Start asking questions
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function HomeContent() {
  return (
    <ClientMountWrapper className="min-h-screen bg-page">
      <div className="w-full">
        <HeroSection />
        <SupportersSection />
        <TestimonialSection />
        <PillarsSection />
        <MissionLetterSection />
        <StatsSection />
      </div>
    </ClientMountWrapper>
  );
}
