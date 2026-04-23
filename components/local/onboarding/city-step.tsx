"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Globe, Plus } from "lucide-react";
import { Country, State, City } from "country-state-city";
import type { IState, ICity } from "country-state-city";
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

function sortByName<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

function matchState(states: IState[], regionCode?: string, regionName?: string): IState | undefined {
  if (regionCode) {
    const rc = regionCode.toUpperCase();
    const direct = states.find((s) => s.isoCode.toUpperCase() === rc);
    if (direct) return direct;
    const tail = rc.includes("-") ? rc.split("-").pop()! : rc;
    const byTail = states.find((s) => s.isoCode.toUpperCase() === tail);
    if (byTail) return byTail;
  }
  if (regionName?.trim()) {
    const n = regionName.trim().toLowerCase();
    return (
      states.find((s) => s.name.toLowerCase() === n) ||
      states.find(
        (s) => n.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(n),
      )
    );
  }
  return undefined;
}

function matchCityName(cities: ICity[], city?: string): string | undefined {
  if (!city?.trim()) return undefined;
  const n = city.trim().toLowerCase();
  const exact = cities.find((c) => c.name.toLowerCase() === n);
  if (exact) return exact.name;
  const partial = cities.find(
    (c) => c.name.toLowerCase().includes(n) || n.includes(c.name.toLowerCase()),
  );
  return partial?.name;
}

export function CityStep({ state, updateState, onContinue }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState(false);

  const initialDropdown = state.cityRequest ? REQUEST_CITY_VALUE : state.city;
  const [dropdownValue, setDropdownValue] = useState(initialDropdown);

  const [countryIso, setCountryIso] = useState(state.cityRequest?.countryIso ?? "");
  const [stateCode, setStateCode] = useState(state.cityRequest?.stateCode ?? "");
  const [cityName, setCityName] = useState(state.cityRequest?.city ?? "");
  const [formError, setFormError] = useState<string | null>(null);

  const userEditedRef = useRef(Boolean(state.cityRequest));
  const formRef = useRef<HTMLDivElement>(null);

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

  const countries = useMemo(() => sortByName(Country.getAllCountries()), []);

  const states: IState[] = useMemo(() => {
    if (!countryIso) return [];
    return sortByName(State.getStatesOfCountry(countryIso));
  }, [countryIso]);

  const requestCities: ICity[] = useMemo(() => {
    if (!countryIso) return [];
    if (states.length > 0) {
      if (!stateCode) return [];
      return sortByName(City.getCitiesOfState(countryIso, stateCode));
    }
    return sortByName(City.getCitiesOfCountry(countryIso) ?? []);
  }, [countryIso, stateCode, states.length]);

  const isRequestMode = dropdownValue === REQUEST_CITY_VALUE;

  useEffect(() => {
    if (!isRequestMode) return;
    if (userEditedRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/geo");
        const data = (await res.json()) as
          | { ok: true; countryCode: string; regionCode?: string; regionName?: string; city?: string }
          | { ok: false };
        if (cancelled || !data.ok || userEditedRef.current) return;
        const iso = data.countryCode;
        if (!countries.some((c) => c.isoCode === iso)) return;

        const subdivisions = sortByName(State.getStatesOfCountry(iso));
        if (subdivisions.length > 0) {
          const stateMatch = matchState(subdivisions, data.regionCode, data.regionName);
          if (!stateMatch) {
            if (userEditedRef.current) return;
            setCountryIso(iso);
            setStateCode("");
            setCityName("");
            return;
          }
          const cityList = sortByName(City.getCitiesOfState(iso, stateMatch.isoCode));
          const cityPick = matchCityName(cityList, data.city);
          if (userEditedRef.current) return;
          setCountryIso(iso);
          setStateCode(stateMatch.isoCode);
          setCityName(cityPick ?? "");
          return;
        }

        const cityList = sortByName(City.getCitiesOfCountry(iso) ?? []);
        const cityPick = matchCityName(cityList, data.city);
        if (userEditedRef.current) return;
        setCountryIso(iso);
        setStateCode("");
        setCityName(cityPick ?? "");
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isRequestMode, countries]);

  const handleDropdownChange = (value: string) => {
    setFormError(null);
    setDropdownValue(value);
    if (value === REQUEST_CITY_VALUE) {
      updateState({ city: "", cityRequest: null });
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    } else {
      updateState({ city: value, cityRequest: null });
      userEditedRef.current = false;
      setCountryIso("");
      setStateCode("");
      setCityName("");
    }
  };

  const handleCountryChange = (iso: string) => {
    userEditedRef.current = true;
    setCountryIso(iso);
    setStateCode("");
    setCityName("");
    setFormError(null);
  };

  const handleStateChange = (code: string) => {
    userEditedRef.current = true;
    setStateCode(code);
    setCityName("");
    setFormError(null);
  };

  const handleCityChange = (name: string) => {
    userEditedRef.current = true;
    setCityName(name);
    setFormError(null);
  };

  const canContinue = isRequestMode
    ? Boolean(countryIso && cityName.trim() && (states.length === 0 || stateCode))
    : Boolean(state.city);

  const handleContinue = () => {
    setFormError(null);
    if (isRequestMode) {
      if (!countryIso || !cityName.trim()) {
        setFormError("Please select a country and city.");
        return;
      }
      if (states.length > 0 && !stateCode) {
        setFormError("Please select a state or province.");
        return;
      }
      const countryLabel =
        countries.find((c) => c.isoCode === countryIso)?.name ?? countryIso;
      const stateLabel =
        states.find((s) => s.isoCode === stateCode)?.name ?? "";
      updateState({
        city: cityName.trim(),
        cityRequest: {
          country: countryLabel,
          state: stateLabel || "—",
          city: cityName.trim(),
          countryIso,
          stateCode,
        },
      });
    }
    onContinue();
  };

  const stateDisabled = !countryIso || states.length === 0;
  const cityDisabled =
    !countryIso ||
    (states.length > 0 && !stateCode) ||
    (states.length === 0 && requestCities.length === 0);

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
          className="mt-6 rounded-xl border border-gray-200 bg-white p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Tell us where you are. You&rsquo;ll still be able to subscribe now, and we&rsquo;ll email you as soon as your city launches.
          </p>

          <div>
            <label htmlFor="onb-country" className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              Country
            </label>
            <Select value={countryIso} onValueChange={handleCountryChange}>
              <SelectTrigger
                id="onb-country"
                className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px]"
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
                {countries.map((c) => (
                  <SelectItem
                    key={c.isoCode}
                    value={c.isoCode}
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="onb-state" className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              State / province
            </label>
            <Select
              value={stateCode}
              onValueChange={handleStateChange}
              disabled={stateDisabled}
            >
              <SelectTrigger
                id="onb-state"
                className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <SelectValue
                  placeholder={
                    states.length === 0 && countryIso
                      ? "No subdivisions — pick a city below"
                      : "Select state / province"
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
                {states.map((s) => (
                  <SelectItem
                    key={s.isoCode}
                    value={s.isoCode}
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="onb-city" className="mb-1.5 block text-[12px] font-semibold text-gray-700">
              City
            </label>
            <Select
              value={cityName}
              onValueChange={handleCityChange}
              disabled={cityDisabled}
            >
              <SelectTrigger
                id="onb-city"
                className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
                {requestCities.map((c, i) => (
                  <SelectItem
                    key={`${c.name}-${c.latitude ?? i}-${c.longitude ?? ""}`}
                    value={c.name}
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formError && (
            <p
              className="text-[13px] font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
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
