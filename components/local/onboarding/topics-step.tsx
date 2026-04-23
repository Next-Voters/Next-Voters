"use client";

import { Check } from "lucide-react";
import topicOptions from "@/data/topic-options";
import { OnboardingState } from "./types";

interface Props {
  state: OnboardingState;
  updateState: (patch: Partial<OnboardingState>) => void;
  onContinue: () => void;
}

export function TopicsStep({ state, updateState, onContinue }: Props) {
  const toggleTopic = (topic: string) => {
    const exists = state.topics.includes(topic);
    if (exists) {
      updateState({ topics: state.topics.filter((t) => t !== topic) });
    } else {
      updateState({ topics: [...state.topics, topic] });
    }
  };

  const count = state.topics.length;
  const counterText =
    count === 0
      ? "Tap a topic to get started."
      : count === 3
        ? "All three selected — Pro covers them all."
        : `${count} selected`;

  return (
    <div>
      <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
        Pick the issues you care about. Basic sends one; Pro sends all three.
      </p>

      <label className="block mb-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        Topics
      </label>
      <div className="flex flex-wrap gap-2.5 mb-2">
        {topicOptions.map((topic) => {
          const isActive = state.topics.includes(topic);
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

      <p className="mt-4 text-[13px] text-gray-400">{counterText}</p>

      <button
        type="button"
        onClick={onContinue}
        disabled={state.topics.length === 0}
        className="mt-8 w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center min-h-[48px] px-8 py-3 text-[15.5px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
