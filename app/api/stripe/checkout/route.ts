import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body.plan === 'pro' ? 'pro' : 'basic';

  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRO_PRICE_ID!
    : process.env.STRIPE_BASIC_PRICE_ID!;

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';
  const stripe = getStripe();

  // Look up existing customer and subscription via Stripe SDK
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer = customers.data[0];

  if (customer) {
    const activeSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      limit: 1,
    });
    if (activeSubs.data.length > 0) {
      return NextResponse.json({ error: 'You already have an active subscription. Manage it from your dashboard.' }, { status: 409 });
    }
  }

  let stripeCustomerId = customer?.id;

  // Create a new Stripe customer if none exists
  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = newCustomer.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    ...(plan === 'basic' && { payment_method_collection: 'if_required' as const }),
    success_url: `${origin}/local?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/local?checkout=cancel`,
    metadata: { contact: user.email, plan },
    subscription_data: {
      metadata: { contact: user.email, plan },
    },
  });

  return NextResponse.json({ url: session.url });
}
