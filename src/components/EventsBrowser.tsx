"use client";

import { useMemo, useState } from "react";
import type { EkantikEvent, Category } from "@/lib/types";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { categoryLabel } from "./CategoryTag";

type Tab = "upcoming" | "past";

/**
 * The sticky control bar + grid — "the one piece of real interactivity; keep
 * it fast" (§3). Pure client-side filtering over a pre-scoped event set:
 *   • keyword search (title / subtitle / speaker)  — Feature #1
 *   • category sub-filter                          — Feature #2
 *   • Upcoming / Past (On-Demand) toggle           — Feature #3
 *
 * The set handed in is ALREADY track-scoped server-side (lib/events), so this
 * component can never surface a cross-lane or gated event by accident.
 */
export function EventsBrowser({
  events,
  sourceRef,
}: {
  events: EkantikEvent[];
  sourceRef?: string;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("upcoming");
  const [category, setCategory] = useState<Category | "all">("all");

  // Only offer the category filter when the surface actually spans >1 category.
  const categories = useMemo(() => {
    const set = new Set<Category>(events.map((e) => e.category));
    return Array.from(set);
  }, [events]);
  const showCategoryFilter = categories.length > 1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const isPast = e.status === "past";
      if (tab === "upcoming" && isPast) return false;
      if (tab === "past" && !isPast) return false;
      if (category !== "all" && e.category !== category) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q) ||
        e.speakerName.toLowerCase().includes(q)
      );
    });
  }, [events, query, tab, category]);

  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-navy/10 bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1 sm:max-w-xs">
            <span className="sr-only">Search sessions</span>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="M14 14l4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic, or speaker"
              className="w-full rounded-md border border-navy/15 bg-white py-2 pl-9 pr-3 text-sm text-navy placeholder:text-slate focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {showCategoryFilter && (
              <label className="flex items-center gap-2">
                <span className="sr-only">Filter by category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category | "all")}
                  className="rounded-md border border-navy/15 bg-white py-2 pl-3 pr-8 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="all">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(c)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div
              role="tablist"
              aria-label="Session timing"
              className="inline-flex rounded-md border border-navy/15 bg-white p-0.5"
            >
              {(["upcoming", "past"] as Tab[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={
                    "rounded px-3 py-1.5 font-mono text-xs uppercase tracking-label transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold " +
                    (tab === t
                      ? "bg-navy text-ivory"
                      : "text-slate hover:text-navy")
                  }
                >
                  {t === "past" ? "On-Demand" : "Upcoming"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {filtered.length === 0 ? (
          <EmptyState tab={tab} hasQuery={query.trim().length > 0} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} sourceRef={sourceRef} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
