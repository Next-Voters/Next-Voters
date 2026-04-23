import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface CityRequestBody {
  city?: unknown;
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body.plan === 'pro' ? 'pro' : 'free';

  const rawCity = typeof body.city === 'string' ? body.city.trim() : '';
  const rawLanguage = typeof body.language === 'string' ? body.language.trim() : '';
  const rawTopics: string[] = Array.isArray(body.topics)
    ? body.topics.filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0).map((t: string) => t.trim())
    : [];

  if (!rawCity) {
    return NextResponse.json({ error: 'Please select a city.' }, { status: 400 });
  }
  if (!rawLanguage) {
    return NextResponse.json({ error: 'Please select a language.' }, { status: 400 });
  }
  if (rawTopics.length === 0) {
    return NextResponse.json({ error: 'Please select at least one topic.' }, { status: 400 });
  }

  const cityRequest = body.cityRequest as CityRequestBody | null | undefined;
  let cityRequestMeta = '';
  if (cityRequest && typeof cityRequest === 'object') {
    const city = typeof cityRequest.city === 'string' ? cityRequest.city.trim() : '';
    if (city) cityRequestMeta = city;
  }

  const referralCode = typeof body.referralCode === 'string' ? body.referralCode.trim() : '';

  // Env var intentionally named STRIPE_BASIC_PRICE_ID — UI labels the tier "Free" but the Stripe price config retains the original name to avoid a coordinated secrets rotation.
  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRO_PRICE_ID!
    : process.env.STRIPE_BASIC_PRICE_ID!;

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';
  const stripe = getStripe();

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

  if (!stripeCustomerId) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    stripeCustomerId = newCustomer.id;
  }

  const metadata: Record<string, string> = {
    contact: user.email,
    plan,
    city: rawCity,
    language: rawLanguage,
    topics: rawTopics.join('|'),
  };
  if (cityRequestMeta) metadata.city_request = cityRequestMeta;
  if (referralCode) metadata.referral_code = referralCode;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    ...(plan === 'free' && { payment_method_collection: 'if_required' as const }),
    success_url: `${origin}/local?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/local/onboarding?checkout=cancel`,
    metadata,
    subscription_data: {
      metadata,
    },
  });

  return NextResponse.json({ url: session.url });
}
