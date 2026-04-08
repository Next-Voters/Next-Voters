"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"

export async function getSubscriptionStatus(): Promise<{
  isPro: boolean;
  isAuthenticated: boolean;
  hasSubscription: boolean;
  tier: 'pro' | 'basic' | 'none';
}> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { isPro: false, isAuthenticated: false, hasSubscription: false, tier: 'none' }
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("contact", user.email)
    .maybeSingle()

  // No row at all — never signed up
  if (data === null) {
    return { isPro: false, isAuthenticated: true, hasSubscription: false, tier: 'none' }
  }

  // Row exists but no Stripe subscription — free/basic tier
  if (!data.stripe_subscription_id) {
    return { isPro: false, isAuthenticated: true, hasSubscription: true, tier: 'basic' }
  }

  // Verify live status directly with Stripe
  try {
    const stripeSub = await getStripe().subscriptions.retrieve(data.stripe_subscription_id)
    const isPro = stripeSub.status === 'active' || stripeSub.status === 'trialing'
    return {
      isPro,
      isAuthenticated: true,
      hasSubscription: true,
      tier: isPro ? 'pro' : 'basic',
    }
  } catch {
    return { isPro: false, isAuthenticated: true, hasSubscription: true, tier: 'basic' }
  }
}
