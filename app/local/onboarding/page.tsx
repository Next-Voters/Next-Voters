"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { OnboardingWizard } from "@/components/local/onboarding/onboarding-wizard";

function OnboardingInner() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { hasSubscription, isLoading: subLoading } = useSubscription();

  useEffect(() => {
    if (authLoading || subLoading) return;
    if (user && hasSubscription) {
      router.replace("/local");
    }
  }, [authLoading, subLoading, user, hasSubscription, router]);

  if (authLoading || subLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">Loading…</p>
      </div>
    );
  }

  if (user && hasSubscription) return null;

  return <OnboardingWizard />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[calc(100vh-56px)] bg-page flex items-center justify-center">
        <p className="text-gray-400 text-[14px]">Loading…</p>
      </div>
    }>
      <OnboardingInner />
    </Suspense>
  );
}
