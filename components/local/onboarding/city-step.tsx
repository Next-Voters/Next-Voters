"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Globe, Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { getSupportedCities } from "@/server-actions/get-supported-cities";
import { OnboardingState, REQUEST_CITY_VALUE } from "./types";

interface Props {
  state: OnboardingState;
  updateState: (patch: Partial<OnboardingState>) => void;
  onContinue: () => void;
}

interface Suggestion {
  label: string;
  name: string;
}

export function CityStep({ state, updateState, onContinue }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState(false);

  const initialDropdown = state.cityRequest ? REQUEST_CITY_VALUE : state.city;
  const [dropdownValue, setDropdownValue] = useState(initialDropdown);

  const [query, setQuery] = useState(state.cityRequest?.city ?? "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(state.cityRequest?.city ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadCities = useCallback(() => {
    setLoadingCities(true);
    setCitiesError(false);
    getSupportedCities()
      .then(setCities)
      .catch(() => setCitiesError(true))
      .finally(() => setLoadingCities(false));
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const isRequestMode = dropdownValue === REQUEST_CITY_VALUE;

  useEffect(() => {
    if (!isRequestMode) return;
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
  }, [query, isRequestMode, selectedCity]);

  const handleDropdownChange = (value: string) => {
    setFormError(null);
    setDropdownValue(value);
    if (value === REQUEST_CITY_VALUE) {
      updateState({ city: "", cityRequest: null });
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        inputRef.current?.focus();
      });
    } else {
      updateState({ city: value, cityRequest: null });
      setQuery("");
      setSelectedCity("");
      setSuggestions([]);
    }
  };

  const handlePick = (name: string) => {
    setQuery(name);
    setSelectedCity(name);
    setSuggestions([]);
    setSuggestionsOpen(false);
    setFormError(null);
  };

  const canContinue = useMemo(() => {
    if (isRequestMode) return Boolean(query.trim());
    return Boolean(state.city);
  }, [isRequestMode, query, state.city]);

  const handleContinue = () => {
    setFormError(null);
    if (isRequestMode) {
      const cityName = query.trim();
      if (!cityName) {
        setFormError("Please enter a city.");
        return;
      }
      updateState({
        city: cityName,
        cityRequest: { city: cityName },
      });
    }
    onContinue();
  };

  return (
    <div>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
        Pick the city you want civic updates for. Don&rsquo;t see yours? Request it and we&rsquo;ll notify you when it launches.
      </p>

      <label className="block mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        City
      </label>

      {citiesError && cities.length === 0 && (
        <p className="mb-3 text-[13px] text-red-700">
          Couldn&rsquo;t load the city list.{" "}
          <button type="button" onClick={loadCities} className="font-semibold underline">
            Try again
          </button>
        </p>
      )}

      <Select
        value={dropdownValue}
        onValueChange={handleDropdownChange}
        disabled={loadingCities}
      >
        <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px] pl-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Globe className="h-4 w-4 text-gray-400 shrink-0" />
            {dropdownValue === REQUEST_CITY_VALUE ? (
              <span className="text-gray-900 truncate">Requesting a new city</span>
            ) : (
              <SelectValue placeholder={loadingCities ? "Loading cities…" : "Select your city"} />
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
          {cities.map((city) => (
            <SelectItem
              key={city}
              value={city}
              className="hover:bg-gray-100 focus:bg-gray-100"
            >
              {city}
            </SelectItem>
          ))}
          {cities.length > 0 && <SelectSeparator />}
          <SelectItem
            value={REQUEST_CITY_VALUE}
            className="hover:bg-brand/5 focus:bg-brand/5 text-brand font-semibold"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              Request a city
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {isRequestMode && (
        <div className="mt-3 text-[12px] font-semibold text-brand">
          We&rsquo;ll add this city next.
        </div>
      )}

      {isRequestMode && (
        <div
          ref={formRef}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-5 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
            Search for your city. You&rsquo;ll still be able to subscribe now, and we&rsquo;ll email you as soon as it launches.
          </p>

          <label htmlFor="onb-city-search" className="mb-1.5 block text-[12px] font-semibold text-gray-700">
            City
          </label>

          <div className="relative">
            <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
              <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="onb-city-search"
                ref={inputRef}
                type="text"
                autoComplete="off"
                placeholder="Start typing a city name…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCity("");
                  setFormError(null);
                }}
                onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
                onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
                className="flex-1 min-w-0 px-3 py-2.5 text-[14px] text-gray-950 placeholder:text-gray-400 focus:outline-none"
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

          {formError && (
            <p
              className="mt-3 text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="mt-8 w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15.5px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
