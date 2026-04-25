"use client";

import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingState } from "./types";

interface Props {
  state: OnboardingState;
  updateState: (patch: Partial<OnboardingState>) => void;
  onContinue: () => void;
}

// Mirrors `supported_languages` in the DB. Kept inline because the list is
// small, near-static, and adding a new language requires translation work
// elsewhere anyway. Avoiding the server-action round-trip also keeps the dev
// RSC stream from hanging when the action endpoint is slow to compile.
const LANGUAGES = ["English", "French", "Spanish"];

export function LanguageStep({ state, updateState, onContinue }: Props) {
  const handleChange = (value: string) => {
    updateState({ language: value });
  };

  return (
    <div>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
        Which language would you like your weekly civic updates in?
      </p>

      <label className="block mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        Preferred language
      </label>
      <Select value={state.language} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-900 text-[14px] rounded-xl min-h-[44px] pl-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Languages className="h-4 w-4 text-gray-400 shrink-0" />
            <SelectValue placeholder="Select your language" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white text-gray-900 border border-gray-200 z-[50]">
          {LANGUAGES.map((lang) => (
            <SelectItem
              key={lang}
              value={lang}
              className="hover:bg-gray-100 focus:bg-gray-100"
            >
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="button"
        onClick={onContinue}
        disabled={!state.language}
        className="mt-8 w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15.5px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
