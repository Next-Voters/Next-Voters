"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export async function updateUserRegion(region: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return { error: "Unauthorized" }

  const admin = createSupabaseAdminClient()

  // City-level regions require a Pro subscription.
  const { data: regionRow } = await admin
    .from("supported_regions")
    .select("type, parent_region")
    .eq("region", region)
    .maybeSingle()

  if (regionRow?.type === "city") {
    const { data: sub } = await admin
      .from("subscriptions")
      .select("tier")
      .eq("contact", user.email)
      .maybeSingle()

    if (sub?.tier !== "pro") {
      return { error: "City-level updates require a Pro subscription." }
    }
  }

  const { error } = await admin
    .from("subscriptions")
    .update({ region })
    .eq("contact", user.email)

  if (error) return { error: error.message }
  return {}
}
