import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Always redirect post-auth users to /local. /local is cookie-aware and
// handles every flow:
//   - subscribe-intent cookie -> fires Stripe kickoff
//   - request-intent cookie  -> bounces to /local/onboarding (wizard auto-
//                               submits the waitlist)
//   - existing subscriber    -> SubscriptionDashboard
//   - fresh user, no cookie  -> bounces to /local/onboarding (step 1)
//
// We deliberately do NOT honor a `?next=` query param. Supabase strict-
// matches the redirect URL whitelist and strips/rejects query strings on
// the OAuth callback, so any `?next=` we pass through `signInWithOAuth`
// would arrive empty here and the user would land on the Site URL (/).
// Hard-coding /local removes that fragile coupling entirely.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  let exchangeFailed = !code;

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) exchangeFailed = true;
    } catch {
      exchangeFailed = true;
    }
  }

  if (exchangeFailed) {
    return NextResponse.redirect(`${origin}/local/onboarding?error=oauth_failed`);
  }

  return NextResponse.redirect(`${origin}/local`);
}
