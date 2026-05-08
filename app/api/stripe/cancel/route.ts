import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = getStripe();
  const admin = createSupabaseAdminClient();

  // Prefer the stripe_customer_id stored in the DB over an email-based lookup,
  // since Stripe allows multiple customers with the same email.
  const { data: dbRow } = await admin
    .from('subscriptions')
    .select('stripe_customer_id, stripe_subscription_id')
    .eq('contact', user.email)
    .maybeSingle();

  let customerId = dbRow?.stripe_customer_id;
  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    customerId = customers.data[0]?.id;
  }

  if (!customerId) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  // Verify the subscription matches what we have in the DB to avoid
  // canceling a subscription that belongs to a different account.
  if (dbRow?.stripe_subscription_id && dbRow.stripe_subscription_id !== subscription.id) {
    return NextResponse.json({ error: 'Subscription mismatch' }, { status: 409 });
  }

  try {
    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // cancel_at is set by Stripe when cancel_at_period_end is true
    const periodEnd = updated.cancel_at
      ? new Date(updated.cancel_at * 1000).toISOString()
      : null;

    // Persist the cancellation period end to the DB so the UI can show
    // "access until <date>" even on subsequent page loads.
    if (periodEnd) {
      const { error: updateError } = await admin
        .from('subscriptions')
        .update({ stripe_period_end: periodEnd })
        .eq('contact', user.email);
      if (updateError) {
        console.error('Cancel: failed to write period end to DB:', updateError);
        // Non-fatal — Stripe webhook will reconcile later.
      }
    }

    return NextResponse.json({ success: true, periodEnd });
  } catch (err) {
    console.error('Cancel subscription error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
