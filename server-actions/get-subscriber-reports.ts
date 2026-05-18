"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ReportItem = {
  header: string;
  description: string;
};

export type ReportCard = {
  report_id: number;
  report_date: string;
  topic_name: string;
  items: ReportItem[];
  sources: string[];
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
      "id, report_date, report_headers(id, header, bullets, topic_id, supported_topics(topic_name))",
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

    // Group headers by topic so each card represents one topic within a report
    const byTopic = new Map<number, ReportHeaderRow[]>();
    for (const h of headers) {
      const list = byTopic.get(h.topic_id) ?? [];
      list.push(h);
      byTopic.set(h.topic_id, list);
    }

    for (const topicHeaders of byTopic.values()) {
      cards.push({
        report_id: report.id,
        report_date: report.report_date,
        topic_name: topicHeaders[0]?.supported_topics?.topic_name ?? "Unknown",
        items: topicHeaders.map((h) => ({
          header: h.header,
          description: (h.bullets as string[]).join(" "),
        })),
        sources: [],
      });
    }
  }

  const nextCursor =
    data.length === pageSize ? String(offset + data.length) : null;
  return { cards, nextCursor };
}
