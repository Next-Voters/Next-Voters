import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface StatusMessageProps {
  status: {
    type: "success" | "error";
    message: string;
  } | null;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`mt-4 flex items-start gap-2.5 text-[13px] font-medium px-3.5 py-2.5 rounded-xl ${
        status.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-brand border border-red-200"
      }`}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      )}
      <span>{status.message}</span>
    </div>
  );
};
