import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!proPriceId) {
    return NextResponse.json({ error: 'STRIPE_PRO_PRICE_ID is not configured' }, { status: 500 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;
      const contact = session.metadata?.contact;
      if (!contact) break;

      const checkoutCity = typeof session.metadata?.city === 'string' ? session.metadata.city.trim() : '';
      const checkoutPayload: Record<string, string> = {
        contact,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        stripe_status: 'active',
        tier: session.metadata?.plan === 'pro' ? 'pro' : 'free',
      };
      if (checkoutCity) checkoutPayload.city = checkoutCity;

      const { error: checkoutError } = await supabase
        .from('subscriptions')
        .upsert(checkoutPayload, { onConflict: 'contact' });
      if (checkoutError) {
        console.error(`Webhook ${event.type}:`, checkoutError);
        return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const contact = sub.metadata?.contact;
      if (!contact) break;

      const subTier = sub.items.data.some((i) => i.price.id === proPriceId) ? 'pro' : 'free'
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          stripe_status: sub.status,
          stripe_period_end: new Date(sub.items.data[0].current_period_end * 1000).toISOString(),
          tier: subTier,
        })
        .eq('contact', contact);
      if (updateError) {
        console.error(`Webhook ${event.type}:`, updateError);
        return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const contact = sub.metadata?.contact;
      if (!contact) break;

      const { error: deleteError } = await supabase
        .from('subscriptions')
        .update({ stripe_status: 'canceled' })
        .eq('contact', contact);
      if (deleteError) {
        console.error(`Webhook ${event.type}:`, deleteError);
        return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const rawSub = invoice.parent?.subscription_details?.subscription;
      const subId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
      if (!subId) break;

      const stripeSub = await getStripe().subscriptions.retrieve(subId);
      const contact = stripeSub.metadata?.contact;
      if (!contact) break;

      const paidTier = stripeSub.items.data.some((i) => i.price.id === proPriceId) ? 'pro' : 'free'
      const { error: paidError } = await supabase
        .from('subscriptions')
        .update({
          stripe_status: 'active',
          stripe_period_end: new Date(stripeSub.items.data[0].current_period_end * 1000).toISOString(),
          tier: paidTier,
        })
        .eq('contact', contact);
      if (paidError) {
        console.error(`Webhook ${event.type}:`, paidError);
        return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const rawSub = invoice.parent?.subscription_details?.subscription;
      const subId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
      if (!subId) break;

      const stripeSub = await getStripe().subscriptions.retrieve(subId);
      const contact = stripeSub.metadata?.contact;
      if (!contact) break;

      const { error: failedError } = await supabase
        .from('subscriptions')
        .update({ stripe_status: 'past_due' })
        .eq('contact', contact);
      if (failedError) {
        console.error(`Webhook ${event.type}:`, failedError);
        return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
