"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getRegionVoteCount(city: string): Promise<number> {
  const trimmed = city?.trim();
  if (!trimmed) return 0;

  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("region_requests")
      .select("vote_count")
      .eq("city", trimmed)
      .maybeSingle();
    return data?.vote_count ?? 0;
  } catch {
    return 0;
  }
}
