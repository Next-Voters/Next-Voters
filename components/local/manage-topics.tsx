"use client";

import { useEffect, useState } from "react";
import { Check, Globe, Languages } from "lucide-react";
import topicOptions from "@/data/topic-options";
import { useSubscription } from "@/hooks/use-subscription";
import { TierBadge } from "@/components/local/tier-badge";
import { getUserTopics } from "@/server-actions/get-user-topics";
import { updateUserTopics } from "@/server-actions/update-user-topics";
import { getSupportedCities, getUserCity } from "@/server-actions/get-supported-cities";
import { updateUserCity } from "@/server-actions/update-user-city";
import { getSupportedLanguages, getUserLanguage } from "@/server-actions/get-supported-languages";
import { updateUserLanguage } from "@/server-actions/update-user-language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ManageTopics({ onSaved }: { onSaved?: () => void } = {}) {
  const { isPro, isLoading: subLoading, tier } = useSubscription();
  const MAX_TOPICS = isPro ? 3 : 1;

  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [topicsLoading, setTopicsLoading] = useState(true);

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    getSupportedCities().then(setCities);
    getUserCity().then((city) => { if (city) setSelectedCity(city); });
    getSupportedLanguages().then(setLanguages);
    getUserLanguage().then((lang) => { if (lang) setSelectedLanguage(lang); });
  }, []);

  useEffect(() => {
    if (subLoading) return;
    getUserTopics().then((topics) => {
      setSelected(topics.slice(0, MAX_TOPICS));
      setTopicsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subLoading, MAX_TOPICS]);

  const toggleTopic = (topic: string) => {
    const exists = selected.includes(topic);
    if (exists) {
      setSelected(selected.filter((t) => t !== topic));
    } else if (selected.length >= MAX_TOPICS) {
      if (!isPro) {
        setSelected([topic]);
      }
    } else {
      setSelected([...selected, topic]);
    }
    setSavedMsg("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    const [topicResult, cityResult, langResult] = await Promise.all([
      updateUserTopics(selected),
      selectedCity ? updateUserCity(selectedCity) : Promise.resolve({} as { error?: string }),
      selectedLanguage ? updateUserLanguage(selectedLanguage) : Promise.resolve({} as { error?: string }),
    ]);
    setSaving(false);
    const error = topicResult.error || cityResult.error || langResult.error;
    if (error) {
      setSavedMsg(error);
    } else {
      setSavedMsg("Saved!");
      onSaved?.();
    }
  };

  if (subLoading || topicsLoading) {
    return (
      <div className="w-full bg-page flex items-center justify-center py-20">
        <p className="text-gray-400 text-[14px]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-page flex flex-col">
      <div className="flex-1 w-full pt-12 pb-8">
        <div className="flex items-center gap-2.5 mb-3">
          <h1 className="text-[30px] sm:text-[38px] font-bold text-gray-950 leading-tight tracking-tight">
            NV Local
          </h1>
          <TierBadge tier={tier} />
        </div>
        <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">
          {isPro
            ? "Select up to 3 topics. We'll only send you updates related to your choices."
            : "Select 1 topic. Upgrade to Pro for all 3."}
        </p>

        {/* City selector */}
        <div className="mb-8">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Region
          </p>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full sm:w-[240px] bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px]">
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="hover:bg-gray-100 focus:bg-gray-100">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Language selector */}
        <div className="mb-8">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Preferred Language
          </p>
          <div className="flex items-center gap-3">
            <Languages className="h-4 w-4 text-gray-400 shrink-0" />
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full sm:w-[240px] bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px]">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="hover:bg-gray-100 focus:bg-gray-100">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Topics
        </p>
        <div className="flex flex-wrap gap-2.5 mb-6">
          {topicOptions.map((topic) => {
            const isActive = selected.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                aria-pressed={isActive}
                className={[
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-semibold text-[14.5px] transition-all",
                  isActive
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50",
                ].join(" ")}
              >
                {isActive && <Check className="w-4 h-4 shrink-0" />}
                {topic}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[16px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50 touch-manipulation"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {savedMsg && (
            <p className={`text-[13.5px] font-medium ${savedMsg === "Saved!" ? "text-green-600" : "text-red-500"}`}>
              {savedMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
