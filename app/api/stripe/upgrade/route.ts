import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripe = getStripe();
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID!;

  // Look up customer via Stripe SDK
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer = customers.data[0];

  if (!customer) {
    return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
  }

  // Find any active subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active',
    limit: 1,
  });

  const stripeSub = subscriptions.data[0];

  if (!stripeSub) {
    // No active subscription — send them straight to Pro checkout
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: `${origin}/local?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/local?checkout=cancel`,
      metadata: { contact: user.email, plan: 'pro' },
      subscription_data: {
        metadata: { contact: user.email, plan: 'pro' },
      },
    });

    return NextResponse.json({ url: session.url });
  }

  const alreadyPro = stripeSub.items.data.some((item) => item.price?.id === proPriceId);
  if (alreadyPro) {
    return NextResponse.json({ error: 'Already on Pro' }, { status: 409 });
  }

  try {
    // Check if customer has a payment method on file
    const customerDetails = await stripe.customers.retrieve(customer.id) as { invoice_settings?: { default_payment_method?: string | null }; default_source?: string | null };
    const hasPaymentMethod = !!(customerDetails.invoice_settings?.default_payment_method || customerDetails.default_source);

    if (hasPaymentMethod) {
      // Swap the price directly
      const currentItem = stripeSub.items.data[0];
      await stripe.subscriptions.update(stripeSub.id, {
        items: [
          { id: currentItem.id, price: proPriceId },
        ],
        metadata: { contact: user.email, plan: 'pro' },
        proration_behavior: 'create_prorations',
      });
      return NextResponse.json({ success: true });
    }

    // No payment method — cancel the free sub and create a checkout session for Pro
    await stripe.subscriptions.cancel(stripeSub.id);

    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: proPriceId, quantity: 1 }],
      success_url: `${origin}/local?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/local?checkout=cancel`,
      metadata: { contact: user.email, plan: 'pro' },
      subscription_data: {
        metadata: { contact: user.email, plan: 'pro' },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upgrade';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
