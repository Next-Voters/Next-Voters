"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

// Reconciles the public.subscriptions row for the current authed user with
// Stripe. Used when the DB is out of sync (row missing / stripe_status stale)
// but Stripe still reports an active subscription — /api/stripe/checkout
// 409s in that state, and we want /local to auto-heal rather than surface
// an error card.
export async function syncSubscriptionFromStripe(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, error: "Not authenticated" };

  const stripe = getStripe();
  const admin = createSupabaseAdminClient();

  // Prefer the stripe_customer_id stored in the DB over an email-based lookup.
  const { data: dbRow } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("contact", user.email)
    .maybeSingle();

  let customerId = dbRow?.stripe_customer_id;
  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    customerId = customers.data[0]?.id;
  }
  if (!customerId) return { ok: false, error: "No Stripe customer" };

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });
  const sub = subs.data[0];
  if (!sub) return { ok: false, error: "No active Stripe subscription" };

  const proPriceId = process.env.STRIPE_PRO_PRICE_ID
  if (!proPriceId) return { ok: false, error: 'STRIPE_PRO_PRICE_ID is not configured' }
  const tier = sub.items.data.some((i) => i.price.id === proPriceId) ? 'pro' : 'free'

  const periodEnd = sub.items.data[0]?.current_period_end;
  const upsertPayload: Record<string, string> = {
    contact: user.email,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    stripe_status: "active",
    tier,
  };
  if (periodEnd) {
    upsertPayload.stripe_period_end = new Date(periodEnd * 1000).toISOString();
  }

  const { error } = await admin.from("subscriptions").upsert(
    upsertPayload,
    { onConflict: "contact" },
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
