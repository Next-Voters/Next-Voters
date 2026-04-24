"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CityAutocomplete } from "@/components/local/city-autocomplete";

export function NewsletterHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    const trimmed = city.trim();
    if (!trimmed) {
      setError("Please enter your city.");
      return;
    }
    router.push(`/local/onboarding?city=${encodeURIComponent(trimmed)}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 h-[620px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(235, 34, 64, 0.18) 0%, rgba(235, 34, 64, 0.06) 45%, rgba(235, 34, 64, 0) 78%)",
        }}
      />
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
          Local civic updates, delivered{" "}
          <span className="relative inline-block">
            <span className="relative z-10">weekly.</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 md:bottom-2 h-2 md:h-3 bg-red-200/70 -z-0 rounded"
            />
          </span>
        </h1>

        <p className="mt-6 text-center text-[17px] md:text-[19px] text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Nonpartisan summaries of council meetings, bylaws, and local bills —
          in your inbox, every week. Just enter your city to start.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-10 max-w-[640px] mx-auto"
          noValidate
        >
          <div className="relative rounded-2xl bg-white border border-gray-200 shadow-[0_1px_0_rgba(17,17,17,0.04),0_20px_40px_-20px_rgba(17,17,17,0.12)] p-1.5 transition-shadow focus-within:shadow-[0_0_0_4px_rgba(235,34,64,0.08),0_20px_40px_-20px_rgba(17,17,17,0.18)]">
            <div className="flex items-stretch gap-2">
              <div className="flex-1 min-w-0">
                <CityAutocomplete
                  variant="hero"
                  value={city}
                  onValueChange={(next) => {
                    setCity(next);
                    setError(null);
                  }}
                  onSubmit={handleSubmit}
                  placeholder="e.g. Vancouver"
                  inputId="home-city"
                />
              </div>
              <button
                type="submit"
                disabled={!city.trim()}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] sm:text-[14.5px] font-semibold px-4 sm:px-5 h-12 transition-colors shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {error && (
            <p
              className="mt-3 text-center text-[13px] text-red-700"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
          <p className="mt-4 text-center text-[12.5px] text-gray-500">
            Free. Nonpartisan. No newsletter spam.
          </p>
        </form>
      </div>
    </section>
  );
}
