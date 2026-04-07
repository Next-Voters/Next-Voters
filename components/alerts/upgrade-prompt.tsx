"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  redirectPath: string;
}

export function UpgradePrompt({
  open,
  onClose,
  isAuthenticated,
  redirectPath,
}: UpgradePromptProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(redirectPath)}`;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[360px]">
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-brand" />
          </div>
          <DialogTitle className="text-[20px] font-bold text-gray-950 leading-tight">
            Unlock all 3 topics
          </DialogTitle>
          <DialogDescription className="text-[14px] text-gray-500 mt-1 leading-relaxed">
            Upgrade to Pro to follow Immigration, Civil Rights, and Economy — all in one weekly alert.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5 mt-4">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full px-6 py-3 text-[15px] font-bold text-white bg-brand rounded-xl hover:bg-brand-hover transition-colors disabled:opacity-60"
          >
            {loading ? "Redirecting…" : isAuthenticated ? "Upgrade to Pro — $5/mo" : "Log in to upgrade"}
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-[14px] font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Continue with 1 topic
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
