"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

export async function getSubscriptionStatus(): Promise<{
  isPro: boolean;
  isAuthenticated: boolean;
  hasSubscription: boolean;
  tier: 'pro' | 'free' | 'none';
}> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { isPro: false, isAuthenticated: false, hasSubscription: false, tier: 'none' }
  }

  // Source of truth: the subscriptions row written by fulfillCheckout.
  // Avoid stripe.subscriptions.list which can miss just-created subs.
  const admin = createSupabaseAdminClient()
  const { data: row } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id, stripe_status")
    .eq("contact", user.email)
    .maybeSingle()

  if (!row || !row.stripe_subscription_id || row.stripe_status !== "active") {
    return { isPro: false, isAuthenticated: true, hasSubscription: false, tier: 'none' }
  }

  // Determine tier from the specific Stripe subscription (one retrieve, reliable).
  try {
    const stripeSub = await getStripe().subscriptions.retrieve(row.stripe_subscription_id)
    if (stripeSub.status !== 'active' && stripeSub.status !== 'trialing') {
      return { isPro: false, isAuthenticated: true, hasSubscription: false, tier: 'none' }
    }
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID
    const isPro = stripeSub.items.data.some((item) => item.price?.id === proPriceId)
    return {
      isPro,
      isAuthenticated: true,
      hasSubscription: true,
      tier: isPro ? 'pro' : 'free',
    }
  } catch {
    // Stripe unreachable: trust the DB row. Default tier to free so the dashboard renders.
    return {
      isPro: false,
      isAuthenticated: true,
      hasSubscription: true,
      tier: 'free',
    }
  }
}
