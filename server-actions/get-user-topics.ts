"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import topicOptions from "@/data/topic-options"

type TopicRow = { supported_topics: { topic_name: string } | null }

export async function getUserTopics(): Promise<string[]> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return []

  const { data } = await supabase
    .from("subscription_topics")
    .select("supported_topics(topic_name)")
    .eq("subscription_id", user.email)

  if (!data) return []

  const dbNames = (data as unknown as TopicRow[])
    .map((row) => row.supported_topics?.topic_name ?? "")
    .filter(Boolean)

  // Match DB names (lowercase) back to the canonical topicOptions casing
  return dbNames
    .map((dbName) => topicOptions.find((opt) => opt.toLowerCase() === dbName.toLowerCase()))
    .filter((name): name is string => !!name)
}
