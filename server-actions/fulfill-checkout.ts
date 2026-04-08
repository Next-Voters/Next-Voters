"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getStripe } from "@/lib/stripe"

export async function fulfillCheckout(sessionId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return { success: false, error: "Not authenticated" }

  let session
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId)
  } catch {
    return { success: false, error: "Invalid session" }
  }

  if (session.mode !== "subscription" || session.payment_status !== "paid") {
    return { success: false, error: "Session not completed" }
  }

  if (session.metadata?.contact !== user.email) {
    return { success: false, error: "Session mismatch" }
  }

  // Upsert: creates the row if the user upgraded before finishing the signup wizard
  const admin = createSupabaseAdminClient()
  const { error } = await admin
    .from("subscriptions")
    .upsert(
      {
        contact: user.email,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        stripe_status: "active",
      },
      { onConflict: "contact" }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}
