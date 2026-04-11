"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function subscribeBasic(city: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return { error: "Not authenticated" }
  }

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("contact")
    .eq("contact", user.email)
    .maybeSingle()

  if (existing) {
    return { error: "Already subscribed" }
  }

  const { error } = await supabase
    .from("subscriptions")
    .insert({ contact: user.email, city, premium: false })

  if (error) {
    return { error: error.message }
  }

  return {}
}
