"use server";

import { transporter } from "@/lib/nodemailer";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { convertReferral } from "@/server-actions/referrals";

export async function submitRegionWaitlist(input: {
  city: string;
  referralCode?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const city = input.city?.trim();
  const referralCode = input.referralCode?.trim();

  if (!city) {
    return { ok: false, error: "Please enter a city." };
  }

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin
    .from("region_requests")
    .select("id, vote_count")
    .eq("city", city)
    .maybeSingle();

  if (existing) {
    await admin
      .from("region_requests")
      .update({ vote_count: (existing.vote_count ?? 0) + 1 })
      .eq("id", existing.id);
  } else {
    await admin.from("region_requests").insert({ city, vote_count: 1 });
  }

  if (referralCode) {
    await convertReferral(referralCode, "", { city });
  }

  const lines = [
    "New city waitlist request (Next Voters)",
    "",
    `City: ${city}`,
    ...(referralCode ? [`Referral code: ${referralCode}`] : []),
  ];

  const user = process.env.EMAIL_USER;
  if (!user) {
    return { ok: false, error: "Email is not configured on the server." };
  }

  try {
    await transporter.sendMail({
      from: `Next Voters <${user}>`,
      to: user,
      subject: `[Next Voters] City request: ${city}`,
      text: lines.join("\n"),
      html: `<pre style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">${lines
        .map((l) => (l === "" ? "<br/>" : l))
        .join("<br/>")}</pre>`,
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to send";
    return { ok: false, error: message };
  }
}
