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
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  const customer = customers.data[0];

  if (!customer) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000';

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/local`,
  });

  return NextResponse.json({ url: portalSession.url });
}
