"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import {
  getSubscriberReports,
  type ReportCard,
  type TopicSection,
} from "@/server-actions/get-subscriber-reports";

const PAGE_SIZE = 10;

const formatDate = (yyyyMmDd: string): string => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  if (!y || !m || !d) return yyyyMmDd;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function EmailHistory() {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inflightRef = useRef(false);
  const initialLoadedRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [cards, setCards] = useState<ReportCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (inflightRef.current || done) return;
    inflightRef.current = true;
    if (!initialLoadedRef.current) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await getSubscriberReports({ cursor, pageSize: PAGE_SIZE });
      if (!mountedRef.current) return;
      setCards((prev) => [...prev, ...res.cards]);
      setCursor(res.nextCursor);
      if (!res.nextCursor) setDone(true);
      initialLoadedRef.current = true;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
      inflightRef.current = false;
    }
  }, [cursor, done]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollRootRef.current;
    if (!sentinel || !root || done) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root, rootMargin: "0px 0px 200px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, done]);

  return (
    <div className="w-full">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
        Past reports
      </p>
      <p className="text-[13px] text-gray-500 mb-4">
        Reports we&apos;ve sent for your city and topics.
      </p>

      <div
        ref={scrollRootRef}
        className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1 -mr-1"
      >
        {loading && cards.length === 0 ? (
          <p className="text-gray-400 text-[13px] py-4">Loading...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cards.map((card) => (
              <ReportCardView key={card.report_id} card={card} />
            ))}

            {!done && (
              <div
                ref={sentinelRef}
                className="py-4 text-center text-[12px] text-gray-400"
                aria-hidden="true"
              >
                {loadingMore ? "Loading more..." : " "}
              </div>
            )}

            {done && cards.length === 0 && (
              <div className="border border-dashed border-gray-200 rounded-xl px-4 py-8 text-center">
                <Mail className="h-5 w-5 text-gray-300 mx-auto mb-2" aria-hidden="true" />
                <p className="text-[13.5px] text-gray-500">
                  No reports yet. Your first one is on the way.
                </p>
              </div>
            )}

            {done && cards.length > 0 && (
              <p className="py-4 text-center text-[12px] text-gray-400">
                You&apos;re all caught up.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportCardView({ card }: { card: ReportCard }) {
  const [expanded, setExpanded] = useState(false);

  const itemCount = card.topics.reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Red header — mirrors email template branding */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left group"
      >
        <div className="bg-brand px-4 py-3 flex items-center justify-between gap-3 transition-[filter] group-hover:brightness-110">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 text-[18px] font-extrabold tracking-[2px] text-white/90 leading-none select-none">
              NV
            </span>
            <div className="h-4 w-px bg-white/25 shrink-0" />
            <div className="min-w-0">
              <span className="block text-[13px] font-semibold text-white truncate">
                {formatDate(card.report_date)}
              </span>
              <span className="block text-[11px] text-white/60 truncate">
                {card.city}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50 font-medium tabular-nums">
              {itemCount}
            </span>
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-white/60 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-white/60 shrink-0" aria-hidden="true" />
            )}
          </div>
        </div>
      </button>

      {/* Collapsed: topic pills for scannability */}
      {!expanded && (
        <div className="px-4 py-2.5 flex flex-wrap items-center gap-1.5">
          {card.topics.map((t) => (
            <span
              key={t.topic_name}
              className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-500 uppercase tracking-wide"
            >
              {capitalize(t.topic_name)}
            </span>
          ))}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-4">
          {card.topics.map((topic, ti) => (
            <TopicSectionView
              key={topic.topic_name}
              topic={topic}
              isLast={ti === card.topics.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicSectionView({
  topic,
  isLast,
}: {
  topic: TopicSection;
  isLast: boolean;
}) {
  return (
    <div className={isLast ? "" : "mb-4 pb-4 border-b border-gray-100"}>
      <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand/10 text-[11px] font-bold text-brand uppercase tracking-wide mb-3">
        {capitalize(topic.topic_name)}
      </span>

      <div className="flex flex-col gap-3">
        {topic.items.map((item, i) => (
          <article key={i}>
            <h3 className="text-[13.5px] font-semibold text-gray-900 leading-snug mb-1">
              {item.header}
            </h3>
            <ul className="space-y-0.5 pl-4 list-disc marker:text-gray-300">
              {item.bullets.map((bullet, bi) => (
                <li
                  key={bi}
                  className="text-[12.5px] text-gray-600 leading-relaxed pl-0.5"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
