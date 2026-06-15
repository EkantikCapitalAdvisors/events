import type { EkantikEvent } from "./types";

/** Server-safe UTC fallback (client components re-render localized). */
export function formatUtc(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** Localized to the viewer's timezone — call only in the browser. */
export function formatLocal(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function durationLabel(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Pieces for the hero date/countdown lockup. */
export function dateParts(iso: string, utc = false): {
  month: string;
  day: string;
  time: string;
} {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = utc ? { timeZone: "UTC" } : {};
  return {
    month: d.toLocaleString(utc ? "en-US" : undefined, { ...opts, month: "short" }).toUpperCase(),
    day: d.toLocaleString(utc ? "en-US" : undefined, { ...opts, day: "numeric" }),
    time: d.toLocaleString(utc ? "en-US" : undefined, {
      ...opts,
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }),
  };
}

/**
 * Build an ICS file body (RFC 5545). The unique per-registrant join link goes
 * in LOCATION/DESCRIPTION in Phase 2; Phase 1 uses the registration URL.
 */
export function buildIcs(event: EkantikEvent, joinUrl?: string): string {
  const start = new Date(event.datetimeStart);
  const end = new Date(start.getTime() + event.durationMin * 60_000);
  const link = joinUrl ?? event.zoomRegistrationUrl ?? "";
  const stamp = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ekantik Capital Advisors//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@ekantikcapital.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.subtitle + (link ? `\n\nJoin: ${link}` : ""))}`,
    link ? `LOCATION:${esc(link)}` : "LOCATION:Online",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Google Calendar template link. */
export function googleCalendarUrl(event: EkantikEvent, joinUrl?: string): string {
  const start = new Date(event.datetimeStart);
  const end = new Date(start.getTime() + event.durationMin * 60_000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const link = joinUrl ?? event.zoomRegistrationUrl ?? "";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${event.subtitle}${link ? `\n\nJoin: ${link}` : ""}`,
    location: link || "Online",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
