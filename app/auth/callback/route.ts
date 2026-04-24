import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

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

  if (exchangeFailed && next.startsWith('/local/onboarding')) {
    return NextResponse.redirect(`${origin}/local/onboarding?error=oauth_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
