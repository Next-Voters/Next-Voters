"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReportItem = {
  header: string;
  bullets: string[];
};

export type TopicSection = {
  topic_name: string;
  items: ReportItem[];
};

export type ReportCard = {
  report_id: number;
  report_date: string;
  city: string;
  topics: TopicSection[];
};

export type GetSubscriberReportsInput = {
  cursor?: string | null;
  pageSize?: number;
};

export type GetSubscriberReportsResult = {
  cards: ReportCard[];
  nextCursor: string | null;
};

const DEFAULT_PAGE_SIZE = 10;

type ReportHeaderRow = {
  id: number;
  header: string;
  bullets: string[];
  topic_id: number;
  supported_topics: { topic_name: string } | null;
};

type ReportRow = {
  id: number;
  report_date: string;
  city: string | null;
  report_headers: ReportHeaderRow[];
};

type TopicRow = {
  topic_id: number;
};

export async function getSubscriberReports(
  input?: GetSubscriberReportsInput,
): Promise<GetSubscriberReportsResult> {
  const pageSize = Math.max(1, input?.pageSize ?? DEFAULT_PAGE_SIZE);
  const offset = input?.cursor ? parseInt(input.cursor, 10) : 0;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { cards: [], nextCursor: null };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("region")
    .eq("contact", user.email)
    .maybeSingle();
  if (!sub?.region) return { cards: [], nextCursor: null };

  const { data: topicRows } = await supabase
    .from("subscription_topics")
    .select("topic_id")
    .eq("subscription_id", user.email);

  const topicIds = ((topicRows ?? []) as TopicRow[]).map((r) => r.topic_id);

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, report_date, city, report_headers(id, header, bullets, topic_id, supported_topics(topic_name))",
    )
    .eq("region", sub.region)
    .order("report_date", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) return { cards: [], nextCursor: null };

  const cards: ReportCard[] = [];
  for (const report of data as unknown as ReportRow[]) {
    let headers = report.report_headers ?? [];
    if (topicIds.length > 0) {
      headers = headers.filter((h) => topicIds.includes(h.topic_id));
    }
    if (headers.length === 0) continue;

    // Group headers by topic — each topic becomes a section within the card
    const byTopic = new Map<
      number,
      { name: string; items: ReportItem[] }
    >();
    for (const h of headers) {
      const existing = byTopic.get(h.topic_id) ?? {
        name: h.supported_topics?.topic_name ?? "Unknown",
        items: [],
      };
      existing.items.push({
        header: h.header,
        bullets: h.bullets as string[],
      });
      byTopic.set(h.topic_id, existing);
    }

    cards.push({
      report_id: report.id,
      report_date: report.report_date,
      city: report.city ?? sub.region,
      topics: Array.from(byTopic.values()).map((t) => ({
        topic_name: t.name,
        items: t.items,
      })),
    });
  }

  const nextCursor =
    data.length === pageSize ? String(offset + data.length) : null;
  return { cards, nextCursor };
}
