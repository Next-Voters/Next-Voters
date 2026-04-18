"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function updateUserCity(city: string): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("subscriptions")
    .update({ city })
    .eq("contact", user.email)

  if (error) return { error: error.message }
  return {}
}
