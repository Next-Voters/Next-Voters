"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getStripe } from "@/lib/stripe"

export async function updateUserTopics(topics: string[]): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return { error: "Unauthorized" }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("contact", user.email)
    .maybeSingle()

  if (!subscription) return { error: "No subscription found" }

  // Verify Pro status live with Stripe
  let isPro = false
  if (subscription.stripe_subscription_id) {
    try {
      const stripeSub = await getStripe().subscriptions.retrieve(subscription.stripe_subscription_id)
      isPro = stripeSub.status === 'active' || stripeSub.status === 'trialing'
    } catch {
      isPro = false
    }
  }

  const maxTopics = isPro ? 3 : 1
  if (topics.length > maxTopics) {
    return { error: `Free plan is limited to ${maxTopics} topic. Please upgrade to Pro.` }
  }
  if (topics.length === 0) return { error: "Please select at least one topic." }

  const normalizedTopics = topics.map((t) => t.toLowerCase())
  const { data: topicRows, error: topicError } = await supabase
    .from("supported_topics")
    .select("topic_id, topic_name")
    .in("topic_name", normalizedTopics)

  if (topicError) return { error: "Failed to look up topics." }

  const { error: deleteError } = await supabase
    .from("subscription_topics")
    .delete()
    .eq("subscription_id", user.email)

  if (deleteError) return { error: deleteError.message }

  if (topicRows && topicRows.length > 0) {
    const { error: insertError } = await supabase
      .from("subscription_topics")
      .insert(topicRows.map((row) => ({ subscription_id: user.email, topic_id: row.topic_id })))

    if (insertError) return { error: insertError.message }
  }

  return {}
}
