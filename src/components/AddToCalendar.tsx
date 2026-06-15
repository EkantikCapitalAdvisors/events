"use client";

import type { EkantikEvent } from "@/lib/types";
import { buildIcs, googleCalendarUrl } from "@/lib/format";

/**
 * Add-to-calendar (Feature #5) — reduces no-shows. Offers an ICS download and
 * a Google Calendar link. In Phase 2 the registrant's UNIQUE join link is
 * threaded into both (the link lives inside the calendar entry, §4); Phase 1
 * uses the event's registration URL.
 */
export function AddToCalendar({
  event,
  joinUrl,
}: {
  event: EkantikEvent;
  joinUrl?: string;
}) {
  function downloadIcs() {
    const blob = new Blob([buildIcs(event, joinUrl)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-label text-slate">
        Add to calendar
      </span>
      <button
        type="button"
        onClick={downloadIcs}
        className="rounded-md border border-navy/20 px-3 py-1.5 text-xs font-medium text-navy transition hover:border-gold hover:text-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Apple / Outlook (.ics)
      </button>
      <a
        href={googleCalendarUrl(event, joinUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-navy/20 px-3 py-1.5 text-xs font-medium text-navy transition hover:border-gold hover:text-gold-600"
      >
        Google Calendar
      </a>
    </div>
  );
}
