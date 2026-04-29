"use client";

import { MapPin, Layers, BookOpen, ArrowRight } from "lucide-react";
import ClientMountWrapper from "@/components/client-mount-wrapper";
import { NewsletterHero } from "@/components/home/newsletter-hero";

const Home = () => {
  return (
    <ClientMountWrapper className="min-h-screen bg-page">
      <div className="w-full font-plus-jakarta-sans">
        <NewsletterHero />

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
                className="h-24 md:h-28 object-contain grayscale hover:grayscale-0 transition"
              />
              <img
                src="/lookup-live-logo.png"
                alt="LOOK UP"
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition"
              />
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
                  icon: MapPin,
                  title: "Pick your city.",
                  body: "Tell us where you live. We follow council meetings, bylaws, and local bills for cities across North America.",
                },
                {
                  icon: Layers,
                  title: "We summarize what matters.",
                  body: "Every week, our team distills the week's most consequential local decisions into plain-English briefs — nonpartisan, never spun.",
                },
                {
                  icon: BookOpen,
                  title: "Read it in five minutes.",
                  body: "A single, clean email lands in your inbox each week. Every claim is backed by citations to official government documents.",
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
              Staying informed shouldn&apos;t require a law degree.
            </h2>
            <p className="mt-5 text-[16px] md:text-[18px] text-gray-300 leading-relaxed max-w-[560px] mx-auto">
              Get a free weekly digest of what&apos;s happening in your city —
              nonpartisan, cited, and in your inbox by Sunday.
            </p>
            <div className="mt-10 flex justify-center">
              <a
                href="/local/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[15px] font-semibold px-7 h-12 transition-colors w-full sm:w-auto shadow-lg shadow-red-900/30"
              >
                Subscribe to your city&apos;s weekly update
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </ClientMountWrapper>
  );
};

export default Home;
