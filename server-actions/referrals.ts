"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateReferralCode, buildReferralLink } from "@/lib/referral";
import { sendReferralEmail } from "@/server-actions/mailer";

/**
 * Get or create a referral code for a user.
 */
export async function getOrCreateReferralCode(email: string): Promise<string> {
  const supabase = createSupabaseAdminClient();

  // Check for existing referral code
  const { data: existing } = await supabase
    .from("referrals")
    .select("referral_code")
    .eq("referrer_email", email)
    .limit(1)
    .single();

  if (existing?.referral_code) {
    return existing.referral_code;
  }

  // Generate and store a new code
  const code = generateReferralCode(email);

  const { error } = await supabase.from("referrals").insert({
    referrer_email: email,
    referral_code: code,
  });

  if (error && error.code === "23505") {
    // Unique constraint violation - code already exists, return it
    return code;
  }

  return code;
}

/**
 * Create a referral: generate code, store record, send invite email.
 */
export async function createReferral(
  referrerEmail: string,
  referredEmail: string,
): Promise<{ code: string; link: string }> {
  const supabase = createSupabaseAdminClient();
  const code = await getOrCreateReferralCode(referrerEmail);
  const link = buildReferralLink(code);

  // Insert referral record for this specific invite
  await supabase.from("referrals").insert({
    referrer_email: referrerEmail,
    referral_code: code + "_" + Date.now().toString(36),
    referred_email: referredEmail,
  });

  await sendReferralEmail(referrerEmail, referredEmail, code);

  return { code, link };
}

/**
 * Track when someone clicks a referral link.
 */
export async function trackReferralClick(code: string): Promise<void> {
  const supabase = createSupabaseAdminClient();

  await supabase
    .from("referrals")
    .update({
      status: "clicked",
      clicked_at: new Date().toISOString(),
    })
    .eq("referral_code", code)
    .eq("status", "pending");
}

/**
 * Convert a referral when the referred user signs up.
 */
export async function convertReferral(
  code: string,
  email: string,
  regionRequested?: { city: string },
): Promise<void> {
  const supabase = createSupabaseAdminClient();

  await supabase
    .from("referrals")
    .update({
      status: "signed_up",
      referred_email: email,
      converted_at: new Date().toISOString(),
      ...(regionRequested ? { region_requested: regionRequested } : {}),
    })
    .eq("referral_code", code)
    .in("status", ["pending", "clicked"]);
}

/**
 * Get referral stats for a user's dashboard.
 */
export async function getReferralStats(email: string): Promise<{
  totalReferrals: number;
  totalClicked: number;
  totalConverted: number;
  kFactor: number;
}> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("referrals")
    .select("status")
    .eq("referrer_email", email);

  if (error || !data) {
    return { totalReferrals: 0, totalClicked: 0, totalConverted: 0, kFactor: 0 };
  }

  const totalReferrals = data.length;
  const totalClicked = data.filter((r) => r.status !== "pending").length;
  const totalConverted = data.filter(
    (r) => r.status === "signed_up" || r.status === "subscribed",
  ).length;
  const kFactor = totalReferrals > 0 ? totalConverted / totalReferrals : 0;

  return { totalReferrals, totalClicked, totalConverted, kFactor };
}
