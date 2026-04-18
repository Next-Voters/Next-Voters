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

  // Look up customer and active subscription via Stripe SDK
  const stripe = getStripe()
  const customers = await stripe.customers.list({ email: user.email, limit: 1 })
  const customer = customers.data[0]

  if (!customer) {
    return { isPro: false, isAuthenticated: true, hasSubscription: false, tier: 'none' }
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1,
  })

  const stripeSub = subscriptions.data[0]

  if (!stripeSub) {
    return { isPro: false, isAuthenticated: true, hasSubscription: false, tier: 'none' }
  }

  const proPriceId = process.env.STRIPE_PRO_PRICE_ID
  const isPro = stripeSub.items.data.some((item) => item.price?.id === proPriceId)

  return {
    isPro,
    isAuthenticated: true,
    hasSubscription: true,
    tier: isPro ? 'pro' : 'basic',
  }
}
