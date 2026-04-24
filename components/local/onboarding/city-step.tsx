"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { OnboardingState } from "./types";

interface Props {
  state: OnboardingState;
  supportedCities: string[];
  citiesLoading: boolean;
  updateState: (patch: Partial<OnboardingState>) => void;
  onContinue: (cityWasSupported: boolean) => void;
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
        Where do you want civic updates for? Type any city — if we don&rsquo;t cover it yet, we&rsquo;ll add you to the waitlist.
      </p>

      <label
        htmlFor="onb-city"
        className="block mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest"
      >
        City
      </label>

      <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50">
          <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id="onb-city"
          type="text"
          autoComplete="off"
          placeholder="E.g. Vancouver"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleContinue();
            }
          }}
          className="flex-1 min-w-0 px-3 py-3 text-[14.5px] text-gray-950 placeholder:text-gray-400 focus:outline-none"
          disabled={citiesLoading}
        />
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
