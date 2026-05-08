import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = getStripe();
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!proPriceId) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const admin = createSupabaseAdminClient();

  // Prefer the stripe_customer_id stored in the DB over an email-based lookup.
  const { data: dbRow } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('contact', user.email)
    .maybeSingle();

  let customerId = dbRow?.stripe_customer_id;
  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    customerId = customers.data[0]?.id;
  }

  if (!customerId) {
    // No Stripe customer yet — client should open the payment modal directly
    // via /api/stripe/subscribe-pro which will create the customer.
    return NextResponse.json({ requiresPayment: true });
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  const stripeSub = subscriptions.data[0];

  if (!stripeSub) {
    // No active subscription — client opens payment modal.
    return NextResponse.json({ requiresPayment: true });
  }

  const alreadyPro = stripeSub.items.data.some((item) => item.price?.id === proPriceId);
  if (alreadyPro) {
    return NextResponse.json({ error: 'Already on Pro' }, { status: 409 });
  }

  try {
    // Check if the customer has a payment method on file.
    const customerDetails = await stripe.customers.retrieve(customerId) as {
      invoice_settings?: { default_payment_method?: string | null };
      default_source?: string | null;
    };
    const hasPaymentMethod = !!(
      customerDetails.invoice_settings?.default_payment_method ||
      customerDetails.default_source
    );

    if (hasPaymentMethod) {
      // Swap the price directly — no card needed.
      const currentItem = stripeSub.items.data[0];
      const updatedSub = await stripe.subscriptions.update(stripeSub.id, {
        items: [{ id: currentItem.id, price: proPriceId }],
        metadata: { contact: user.email, plan: 'pro' },
        proration_behavior: 'create_prorations',
      });

      // Write tier and period end immediately so refetch() sees the updated state.
      const periodEnd = updatedSub.items.data[0]?.current_period_end;
      const updatePayload: Record<string, string> = { tier: 'pro' };
      if (periodEnd) {
        updatePayload.stripe_period_end = new Date(periodEnd * 1000).toISOString();
      }

      const { error: tierError } = await admin.from('subscriptions').update(updatePayload).eq('contact', user.email);
      if (tierError) {
        console.error('Upgrade tier write failed:', tierError);
        // Stripe subscription is already updated — webhook will reconcile tier.
      }
      return NextResponse.json({ success: true });
    }

    // No payment method — client opens the payment modal.
    // /api/stripe/subscribe-pro will attach the PM and swap the price in one step.
    return NextResponse.json({ requiresPayment: true });
  } catch (err) {
    console.error('Upgrade error:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Failed to upgrade subscription' }, { status: 500 });
  }
}
