import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('contact', user.email)
    .maybeSingle();

  if (!subscription?.stripe_subscription_id) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  try {
    const updated = await getStripe().subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    await supabase
      .from('subscriptions')
      .update({ stripe_status: 'canceling' })
      .eq('contact', user.email);

    // cancel_at is set by Stripe when cancel_at_period_end is true
    const periodEnd = updated.cancel_at
      ? new Date(updated.cancel_at * 1000).toISOString()
      : null;

    return NextResponse.json({ success: true, periodEnd });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
