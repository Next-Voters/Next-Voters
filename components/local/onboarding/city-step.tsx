"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MapPin, Search } from "lucide-react";
import { OnboardingState } from "./types";

interface Props {
  state: OnboardingState;
  supportedCities: string[];
  citiesLoading: boolean;
  updateState: (patch: Partial<OnboardingState>) => void;
  onContinue: (cityWasSupported: boolean) => void;
}

interface PhotonSuggestion {
  label: string;
  name: string;
  country: string | null;
}

export function CityStep({
  state,
  supportedCities,
  citiesLoading,
  updateState,
  onContinue,
}: Props) {
  const [input, setInput] = useState(
    state.city || state.cityRequest?.city || "",
  );
  const [error, setError] = useState<string | null>(null);
  const [apiSuggestions, setApiSuggestions] = useState<PhotonSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [pickedCity, setPickedCity] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed.length < 2 || trimmed === pickedCity) {
      setApiSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(
          `/api/cities/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          setApiSuggestions([]);
          return;
        }
        const data = (await res.json()) as { cities?: PhotonSuggestion[] };
        setApiSuggestions(data.cities ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setApiSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [input, pickedCity]);

  const { supportedMatches, otherSuggestions } = useMemo(() => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed.length < 1) {
      return { supportedMatches: [], otherSuggestions: apiSuggestions };
    }
    const supportedMatches = supportedCities.filter((c) =>
      c.toLowerCase().includes(trimmed),
    );
    const supportedSet = new Set(supportedMatches.map((c) => c.toLowerCase()));
    const otherSuggestions = apiSuggestions.filter(
      (s) => !supportedSet.has(s.name.toLowerCase()),
    );
    return { supportedMatches, otherSuggestions };
  }, [input, supportedCities, apiSuggestions]);

  const hasDropdown =
    suggestionsOpen &&
    (supportedMatches.length > 0 ||
      otherSuggestions.length > 0 ||
      suggestionsLoading);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePick = (name: string) => {
    setInput(name);
    setPickedCity(name);
    setApiSuggestions([]);
    setSuggestionsOpen(false);
    setError(null);
  };

  const handleContinue = () => {
    setError(null);
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter your city.");
      return;
    }
    const match = supportedCities.find(
      (c) => c.toLowerCase() === trimmed.toLowerCase(),
    );
    if (match) {
      updateState({ city: match, cityRequest: null });
      onContinue(true);
    } else {
      updateState({ city: "", cityRequest: { city: trimmed } });
      onContinue(false);
    }
  };

  return (
    <div>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
        Where do you want civic updates for? Pick a city from the list or type
        any city — if we don&rsquo;t cover it yet, we&rsquo;ll add you to the
        waitlist.
      </p>

      <label
        htmlFor="onb-city"
        className="block mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
      >
        City
      </label>

      <div ref={containerRef} className="relative">
        <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
          <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="onb-city"
            type="text"
            autoComplete="off"
            placeholder="Start typing a city name…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setPickedCity("");
              setError(null);
              setSuggestionsOpen(true);
            }}
            onFocus={() => setSuggestionsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleContinue();
              }
              if (e.key === "Escape") {
                setSuggestionsOpen(false);
              }
            }}
            className="flex-1 min-w-0 px-3 py-3 text-[14.5px] text-gray-950 placeholder:text-gray-400 focus:outline-none"
            disabled={citiesLoading}
          />
        </div>

        {hasDropdown && (
          <div
            className="absolute left-0 right-0 z-[60] mt-1 max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
            role="listbox"
          >
            {supportedMatches.length > 0 && (
              <div>
                <p className="px-3 pt-2.5 pb-1 text-[11px] font-bold text-brand uppercase tracking-widest">
                  Available now
                </p>
                <ul>
                  {supportedMatches.map((city) => (
                    <li key={`sup-${city}`} role="option" aria-selected={input === city}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handlePick(city)}
                        className="w-full flex items-center gap-2 text-left px-3 py-2.5 text-[14px] text-gray-900 hover:bg-brand/5"
                      >
                        <Check className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                        <span className="font-semibold">{city}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {otherSuggestions.length > 0 && (
              <div>
                {supportedMatches.length > 0 && (
                  <div className="border-t border-gray-100" />
                )}
                <p className="px-3 pt-2.5 pb-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Request a city
                </p>
                <ul>
                  {otherSuggestions.map((s) => (
                    <li key={s.label} role="option" aria-selected={pickedCity === s.name}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handlePick(s.name)}
                        className="w-full flex items-start gap-2 text-left px-3 py-2.5 text-[13.5px] hover:bg-gray-50"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>
                          <span className="font-semibold text-gray-900">{s.name}</span>
                          {s.label !== s.name && (
                            <span className="text-gray-500">
                              {" — "}
                              {s.label.replace(`${s.name}, `, "")}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {supportedMatches.length === 0 &&
              otherSuggestions.length === 0 &&
              suggestionsLoading && (
                <p className="px-3 py-3 text-[13px] text-gray-400">Searching…</p>
              )}
          </div>
        )}
      </div>

      {error && (
        <p
          className="mt-2 text-[13px] text-red-700"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={citiesLoading || !input.trim()}
        className="mt-8 w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15.5px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50"
      >
        {citiesLoading ? "Loading…" : "Continue"}
      </button>
    </div>
  );
}
