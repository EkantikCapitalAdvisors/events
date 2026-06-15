import type { EkantikEvent } from "@/lib/types";

/**
 * schema.org/Event JSON-LD (Feature #14) — emitted ONLY for public, indexable
 * tracks. The caller (the events page) must not render this for the gated EPIG
 * surface; suppressing structured data is part of keeping the offering off any
 * indexed surface (§6).
 */
export function EventSchema({ events }: { events: EkantikEvent[] }) {
  const data = events
    .filter((e) => e.status !== "past" && !e.isGated)
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      description: e.subtitle,
      startDate: e.datetimeStart,
      endDate: new Date(
        Date.parse(e.datetimeStart) + e.durationMin * 60_000,
      ).toISOString(),
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: e.zoomRegistrationUrl ?? "https://ekantikcapital.com",
      },
      organizer: {
        "@type": "Organization",
        name: "Ekantik Capital Advisors",
        url: "https://ekantikcapital.com",
      },
      performer: {
        "@type": "Person",
        name: e.speakerName,
      },
    }));

  if (data.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, server-rendered structured data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
