"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Mail } from "lucide-react";
import {
  getSubscriberReports,
  type ReportCard,
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
    // Initial load only — subsequent loads driven by the observer.
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
          <p className="text-gray-400 text-[13px] py-4">Loading…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <ReportCardView key={`${card.report_id}-${card.topic_name}`} card={card} />
            ))}

            {!done && (
              <div
                ref={sentinelRef}
                className="py-4 text-center text-[12px] text-gray-400"
                aria-hidden="true"
              >
                {loadingMore ? "Loading more…" : " "}
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

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 inline-block px-2 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            {capitalize(card.topic_name)}
          </span>
          <span className="text-[13px] font-medium text-gray-900 truncate">
            {formatDate(card.report_date)}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="flex flex-col gap-3 pt-3">
            {card.items.length === 0 ? (
              <p className="text-[13px] text-gray-400">No items in this report.</p>
            ) : (
              card.items.map((item, i) => (
                <article key={i}>
                  <h3 className="text-[13.5px] font-semibold text-gray-900 leading-snug mb-1">
                    {item.header}
                  </h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{item.description}</p>
                </article>
              ))
            )}
          </div>

          {card.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Sources
              </p>
              <ul className="flex flex-col gap-1">
                {card.sources.map((url, i) => {
                  let hostname = url;
                  try {
                    hostname = new URL(url).hostname;
                  } catch {
                    // fall back to raw url
                  }
                  return (
                    <li key={i}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-brand hover:underline"
                      >
                        {hostname}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
