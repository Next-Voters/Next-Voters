"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Layers, BookOpen, ArrowRight } from "lucide-react";
import PreferenceSelector from "@/components/preference-selector";
import ClientMountWrapper from "@/components/client-mount-wrapper";

type AnalyticsCounts = {
  requestCount: number;
  responseCount: number;
};

type ExampleQuestion = {
  tag: string;
  tagTone: "brand" | "neutral" | "muted";
  title: string;
  blurb: string;
};

const EXAMPLE_QUESTIONS: ExampleQuestion[] = [
  {
    tag: "Federal",
    tagTone: "brand",
    title: "What's actually in the new infrastructure bill?",
    blurb: "Break down the spending, the tradeoffs, and who gets what.",
  },
  {
    tag: "Local",
    tagTone: "neutral",
    title: "How does my city's zoning policy affect housing?",
    blurb: "See the rules, the debate, and the downstream effects.",
  },
  {
    tag: "Rights",
    tagTone: "muted",
    title: "What are the current voter ID requirements in my state?",
    blurb: "Know what you need before you show up at the polls.",
  },
  {
    tag: "Economy",
    tagTone: "neutral",
    title: "How do tariffs change consumer prices?",
    blurb: "Trace the line from policy to your grocery bill.",
  },
  {
    tag: "Ballot",
    tagTone: "brand",
    title: "What does this ballot measure really do?",
    blurb: "Cut past the marketing and read what's on the page.",
  },
  {
    tag: "Civics",
    tagTone: "muted",
    title: "How does a bill actually become law?",
    blurb: "The short version, with the parts that actually matter.",
  },
];

const tagClasses: Record<ExampleQuestion["tagTone"], string> = {
  brand: "bg-red-50 text-red-700 ring-1 ring-red-100",
  neutral: "bg-gray-900 text-white",
  muted: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
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

  const goToChat = (q?: string) => {
    const query = (q ?? message).trim();
    if (query) {
      router.push(`/chat?message=${encodeURIComponent(query)}`);
    } else {
      router.push("/chat");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") goToChat();
  };

  return (
    <ClientMountWrapper className="min-h-screen bg-page">
      <div className="w-full font-plus-jakarta-sans">
        {/* ───────────── Hero ───────────── */}
        <section className="relative overflow-hidden">
          {/* Radial accent glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 h-[620px] opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(235, 34, 64, 0.18) 0%, rgba(235, 34, 64, 0.06) 45%, rgba(235, 34, 64, 0) 78%)",
            }}
          />
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at center top, black 40%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center top, black 40%, transparent 80%)",
            }}
          />

          <div className="relative max-w-[1100px] mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-gray-950 text-white ring-1 ring-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] pl-3 pr-4 py-2 text-[13px] font-medium">
                {/* Item 1: Google for Nonprofits */}
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-white text-gray-950">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M21.35 11.1H12v2.98h5.35c-.23 1.47-1.8 4.32-5.35 4.32-3.22 0-5.85-2.67-5.85-5.96S8.78 6.48 12 6.48c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.88 4.05 14.63 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.19 0 8.63-3.65 8.63-8.78 0-.59-.06-1.04-.13-1.5z"
                      />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Google for Nonprofits</span>
                </span>

                <span aria-hidden className="h-4 w-px bg-white/20" />

                {/* Item 2: Nonpartisan & cited */}
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-white text-gray-950">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M12 2 4 5v6c0 5 3.4 9.5 8 11 4.6-1.5 8-6 8-11V5l-8-3zm-1 14.17-3.59-3.58L6 14l5 5 9-9-1.41-1.42L11 16.17z"
                      />
                    </svg>
                  </span>
                  <span className="whitespace-nowrap">Nonpartisan &amp; cited</span>
                </span>
              </div>
            </div>

            <h1 className="text-center text-[44px] sm:text-[56px] md:text-[68px] font-bold tracking-tight text-gray-900 leading-[1.05] max-w-[900px] mx-auto">
              Understand policy the way it actually{" "}
              <span className="relative inline-block">
                <span className="relative z-10">works.</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 md:bottom-2 h-2 md:h-3 bg-red-200/70 -z-0 rounded"
                />
              </span>
            </h1>

            <p className="mt-6 text-center text-[17px] md:text-[19px] text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Ask any civic question and get clear, multi-perspective answers
              with citations — not spin, not jargon, not a feed.
            </p>

            {/* Search card */}
            <div className="mt-10 max-w-[720px] mx-auto">
              <div className="group relative rounded-2xl bg-white border border-gray-200 shadow-[0_1px_0_rgba(17,17,17,0.04),0_20px_40px_-20px_rgba(17,17,17,0.12)] p-2.5 pr-2.5 transition-shadow focus-within:shadow-[0_0_0_4px_rgba(235,34,64,0.08),0_20px_40px_-20px_rgba(17,17,17,0.18)]">
                <div className="flex items-stretch gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="e.g. What does Bill C-27 actually do?"
                      className="w-full h-12 pl-4 pr-3 text-[15px] text-gray-900 bg-transparent border-0 outline-none placeholder:text-gray-400"
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => goToChat()}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[14px] font-semibold px-4 md:px-5 h-12 transition-colors shadow-sm"
                  >
                    <span className="hidden sm:inline">Ask</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 mt-2 pl-1.5 pr-1">
                  <div className="min-w-0 flex-1">
                    <PreferenceSelector />
                  </div>
                  <span className="shrink-0 text-[12.5px] text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {analytics?.responseCount?.toLocaleString() ?? "—"}
                    </span>{" "}
                    answers delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 hover:bg-black text-white text-[15px] font-semibold px-6 h-12 transition-colors w-full sm:w-auto"
              >
                Start asking questions
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/next-voters-local"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-gray-50 text-gray-900 text-[15px] font-semibold px-6 h-12 border border-gray-200 transition-colors w-full sm:w-auto"
              >
                Get weekly local alerts
              </a>
            </div>
            <p className="mt-4 text-center text-[12.5px] text-gray-500">
              Free. Nonpartisan. No newsletter spam.
            </p>
          </div>
        </section>

        {/* ───────────── Supporters strip ───────────── */}
        <section className="border-y border-gray-200/80 bg-white/60 backdrop-blur">
          <div className="max-w-[1100px] mx-auto px-6 py-10 md:py-12">
            <p className="text-center text-[11.5px] tracking-[0.14em] uppercase text-gray-500 font-medium mb-6">
              Proud to be supported by
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-80">
              <img
                src="/google-for-nonprofits-logo.png"
                alt="Google for Nonprofits"
                className="h-20 md:h-24 object-contain grayscale hover:grayscale-0 transition"
              />
              <img
                src="/lookup-live-logo.png"
                alt="LOOK UP"
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
          </div>
        </section>

        {/* ───────────── Example questions grid ───────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
              <div>
                <p className="text-[11.5px] tracking-[0.14em] uppercase text-red-600 font-semibold mb-3">
                  Try a real question
                </p>
                <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight leading-[1.1] max-w-[640px]">
                  Every question gets a grounded, sourced answer.
                </h2>
              </div>
              <a
                href="/chat"
                className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-900 hover:text-red-600 transition-colors"
              >
                Browse the chat <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q.title}
                  type="button"
                  onClick={() => goToChat(q.title)}
                  className="group relative text-left rounded-xl bg-white border border-gray-200 p-6 hover:border-gray-300 hover:shadow-[0_10px_30px_-12px_rgba(17,17,17,0.12)] transition-all duration-200"
                >
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${tagClasses[q.tagTone]}`}
                  >
                    {q.tag}
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
                    {q.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-gray-600 leading-relaxed">
                    {q.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 group-hover:text-red-600 transition-colors">
                    Ask this
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── How it works ───────────── */}
        <section className="relative py-20 md:py-28 bg-white border-y border-gray-200/80">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="max-w-2xl mb-14 md:mb-20">
              <p className="text-[11.5px] tracking-[0.14em] uppercase text-red-600 font-semibold mb-3">
                How it works
              </p>
              <h2 className="text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight leading-[1.1]">
                Built for clarity, not for clicks.
              </h2>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: MessageSquare,
                  title: "Ask any civic question.",
                  body: "From federal bills to local zoning to the measure on page 3 of your ballot — if it's civic, it's fair game.",
                },
                {
                  icon: Layers,
                  title: "Get every perspective.",
                  body: "Answers are generated per political party in parallel, so you see how each side frames it — side-by-side, in plain English.",
                },
                {
                  icon: BookOpen,
                  title: "Dig into the sources.",
                  body: "Every claim is backed by citations from official party platforms and government documents. Trust, then verify.",
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-900 text-white text-[14px] font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-50 text-red-600 ring-1 ring-red-100">
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                      </span>
                    </div>
                    <h3 className="text-[20px] font-semibold text-gray-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">
                      {step.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ───────────── Stat section ───────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <div className="lg:col-span-5">
                <div className="text-[120px] md:text-[160px] font-bold text-gray-900 leading-none tracking-tight">
                  <span className="relative inline-block">
                    87<span className="text-red-500">%</span>
                  </span>
                </div>
                <p className="mt-4 text-[15px] md:text-[16px] text-gray-600 leading-relaxed max-w-sm">
                  of people believe online disinformation has harmed their
                  country&apos;s politics.
                  <span className="block mt-1 text-gray-400 text-[13px]">
                    — United Nations survey
                  </span>
                </p>
              </div>
              <div className="lg:col-span-7">
                <h2 className="text-[28px] md:text-[36px] font-bold text-gray-900 leading-[1.15] tracking-tight">
                  Political misinformation is distracting Gen&nbsp;Z from voting on facts.
                </h2>
                <p className="mt-5 text-[16px] md:text-[17px] text-gray-600 leading-relaxed">
                  Young voters spend nearly three hours a day scrolling past
                  election content — most of it unverified, amplified by
                  engagement algorithms. Despite being digital natives, they
                  encounter conflicting sources that deter them from seeking
                  quality information. The gap between confidence and skill is
                  widening dangerously.
                </p>
                <p className="mt-5 text-[16px] md:text-[17px] text-gray-900 font-semibold">
                  Next Voters is the correction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Final CTA ───────────── */}
        <section className="relative overflow-hidden border-t border-gray-200/80 bg-gray-950">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(50% 70% at 30% 50%, rgba(235, 34, 64, 0.35) 0%, rgba(235, 34, 64, 0) 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse at 70% 50%, black 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 70% 50%, black 30%, transparent 80%)",
            }}
          />
          <div className="relative max-w-[1100px] mx-auto px-6 py-20 md:py-28 text-center">
            <h2 className="text-[32px] md:text-[48px] font-bold text-white tracking-tight leading-[1.05] max-w-[760px] mx-auto">
              Informed voting shouldn&apos;t require a law degree.
            </h2>
            <p className="mt-5 text-[16px] md:text-[18px] text-gray-300 leading-relaxed max-w-[560px] mx-auto">
              Ask a question now — or get a free weekly digest of what&apos;s
              happening in your city.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[15px] font-semibold px-7 h-12 transition-colors w-full sm:w-auto shadow-lg shadow-red-900/30"
              >
                Ask your first question
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/next-voters-local"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[15px] font-semibold px-7 h-12 border border-white/15 transition-colors w-full sm:w-auto backdrop-blur"
              >
                Subscribe to alerts
              </a>
            </div>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
};

export default Home;
