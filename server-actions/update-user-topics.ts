"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function updateUserTopics(topics: string[]): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return { error: "Unauthorized" }

  if (topics.length === 0) return { error: "Please select at least one topic." }
  if (topics.length > 3) return { error: "You can select up to 3 topics." }

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
