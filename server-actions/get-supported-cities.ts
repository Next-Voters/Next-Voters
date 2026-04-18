"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function getSupportedCities(): Promise<string[]> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from("supported_cities")
    .select("city")
    .order("city")

  return data?.map((row) => row.city) ?? []
}

export async function getUserCity(): Promise<string | null> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return null

  const { data } = await supabase
    .from("subscriptions")
    .select("city")
    .eq("contact", user.email)
    .maybeSingle()

  return data?.city ?? null
}
