import React, { FC } from "react";
import { Citation } from "@/types/citations";
import { ExternalLink } from "lucide-react";

interface PartyCardProps {
  title: string;
  partyStance?: string[];
  supportingDetails?: string[];
  color: "blue" | "red";
  citations: Citation[];
}

const PoliticalPerspective: FC<PartyCardProps> = ({
  title,
  partyStance,
  supportingDetails,
  color,
  citations,
}) => {
  const accentColor = color === "blue" ? "#2563EB" : "#E12D39";
  const bgColor = color === "blue" ? "bg-blue-50/50" : "bg-red-50/50";
  const textColor = color === "blue" ? "text-blue-700" : "text-brand";
  const borderColor = color === "blue" ? "border-blue-200" : "border-red-200";

  return (
    <div className={`flex-1 rounded-2xl border ${borderColor} bg-white overflow-hidden`}>
      {/* Party header with colored left bar */}
      <div className={`flex items-center gap-3 px-4 py-3.5 ${bgColor} border-b ${borderColor}`}>
        <div className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
        <h3 className={`text-[15px] font-bold ${textColor}`}>{title}</h3>
      </div>

      <div className="p-4 space-y-5">
        {partyStance && partyStance.length > 0 && (
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Party Stance</p>
            <ul className="space-y-2">
              {partyStance.map((stance, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-gray-800 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                  {stance}
                </li>
              ))}
            </ul>
          </div>
        )}

        {supportingDetails && supportingDetails.length > 0 && (
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Supporting Details</p>
            <ul className="space-y-2">
              {supportingDetails.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-gray-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {citations && citations.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-[11.5px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Sources</p>
            <div className="space-y-2">
              {citations.map((citation, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-blue-600 hover:underline leading-snug"
                    >
                      {citation.document_name || "Source"}
                    </a>
                    {citation.author && (
                      <p className="text-[11px] text-gray-400">{citation.author}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliticalPerspective;
