"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { submitRegionWaitlist } from "@/server-actions/request-region";
import { trackReferralClick } from "@/server-actions/referrals";

interface Suggestion {
  label: string;
  name: string;
}

function RequestRegionForm() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const referralTrackedRef = useRef(false);

  useEffect(() => {
    if (refCode && !referralTrackedRef.current) {
      referralTrackedRef.current = true;
      trackReferralClick(refCode).catch(() => {});
    }
  }, [refCode]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    if (trimmed === selectedCity) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/cities/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await res.json()) as { cities?: Suggestion[] };
        setSuggestions(data.cities ?? []);
        setSuggestionsOpen(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, selectedCity]);

  const handlePick = (name: string) => {
    setQuery(name);
    setSelectedCity(name);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setError(null);
  };

  const onDone = async () => {
    setError(null);
    const cityName = query.trim();
    if (!cityName) {
      setError("Please enter a city.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitRegionWaitlist({
        city: cityName,
        referralCode: refCode || undefined,
      });
      if (result.ok === false) {
        setError(result.error);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center bg-page px-6 pb-16 pt-12">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-center text-[18px] font-bold text-gray-950">
          Thanks — we&apos;ll notify you when it&apos;s ready.
        </p>
        <a href="/" className="mt-7 text-[14.5px] font-semibold text-brand hover:underline">
          Back to Next Voters
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col bg-page">
      <div className="flex flex-1 flex-col items-center px-5 pt-12 sm:pt-16">
        <h1 className="text-center text-[24px] sm:text-[28px] font-bold text-gray-950 tracking-tight">
          Request your city.
        </h1>
        <p className="mt-2 text-center text-[15px] text-gray-500">
          We&apos;ll notify you when it&apos;s ready.
        </p>

        <div className="mt-10 w-full max-w-md flex-1">
          <label htmlFor="request-city" className="mb-1.5 block text-[13px] font-semibold text-gray-700">
            City
          </label>

          <div className="relative">
            <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="request-city"
                type="text"
                autoComplete="off"
                placeholder="Start typing a city name…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCity("");
                  setError(null);
                }}
                onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
                onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                className="flex-1 min-w-0 px-3 py-3 text-[14.5px] text-gray-950 placeholder:text-gray-400 focus:outline-none"
              />
            </div>

            {suggestionsOpen && (suggestions.length > 0 || loadingSuggestions) && (
              <ul
                className="absolute left-0 right-0 z-[60] mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                role="listbox"
              >
                {loadingSuggestions && suggestions.length === 0 && (
                  <li className="px-3 py-2.5 text-[13px] text-gray-400">Searching…</li>
                )}
                {suggestions.map((s) => (
                  <li key={s.label} role="option" aria-selected={selectedCity === s.name}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handlePick(s.name)}
                      className="w-full text-left px-3 py-2.5 text-[13.5px] text-gray-800 hover:bg-gray-50"
                    >
                      <span className="font-semibold">{s.name}</span>
                      {s.label !== s.name && (
                        <span className="text-gray-500">
                          {" — "}
                          {s.label.replace(`${s.name}, `, "")}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error ? (
            <p className="mt-4 text-[13px] font-medium text-brand bg-brand/5 border border-brand/20 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 justify-center px-5 pb-10 pt-6">
        <button
          type="button"
          disabled={submitting}
          onClick={onDone}
          className="min-h-[50px] min-w-[180px] rounded-xl bg-brand px-10 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Done"}
        </button>
      </div>
    </div>
  );
}

export default function RequestRegionPage() {
  return (
    <Suspense>
      <RequestRegionForm />
    </Suspense>
  );
}
