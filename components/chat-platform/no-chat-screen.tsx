import React from "react";
import { MessageCircle } from "lucide-react";

const SUGGESTIONS = [
  "What are the main differences between Democrat and Republican immigration policies?",
  "How does the Federal Reserve control inflation?",
  "What does the Civil Rights Act protect against?",
  "How does healthcare policy differ between parties?",
];

interface NoChatScreenProps {
  onSuggestionClick?: (question: string) => void;
}

const NoChatScreen = ({ onSuggestionClick }: NoChatScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-10 text-center">
      <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-5">
        <MessageCircle className="w-6 h-6 text-brand" />
      </div>

      <h2 className="text-[20px] font-bold text-gray-950 mb-2 tracking-tight">
        Ask about any policy
      </h2>
      <p className="text-[14px] text-gray-500 mb-8 max-w-[320px] leading-relaxed">
        Get nonpartisan, sourced answers on legislation, civil rights, the economy, and more.
      </p>

      {onSuggestionClick && (
        <div className="w-full max-w-[520px] flex flex-col gap-2.5">
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSuggestionClick(q)}
              className="text-left px-4 py-3 rounded-xl border border-gray-200 bg-white text-[13.5px] text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoChatScreen;
