import { EVENTS } from "@/data/events";
import type { EkantikEvent } from "./types";
import { getTrack, type TrackId } from "./tracks";

/**
 * Track-scoped event access. This is the single choke point that enforces the
 * cross-contamination guardrail (§6): a surface only ever sees events whose
 * category is in its track's allow-list, and gated EPIG events can never leak
 * onto a public surface.
 *
 * Swap the EVENTS import for a Supabase query in Phase 2 — the function
 * signatures stay identical.
 */

export function eventsForTrack(trackId: TrackId): EkantikEvent[] {
  const track = getTrack(trackId);
  return EVENTS.filter((e) => {
    // Allow-list by category (load-bearing isolation).
    if (!track.categories.includes(e.category)) return false;
    // Belt-and-suspenders: a public surface never renders a gated event.
    if (!track.gated && e.isGated) return false;
    return true;
  }).sort(byChrono);
}

export function eventForSlug(
  trackId: TrackId,
  slug: string,
): EkantikEvent | undefined {
  return eventsForTrack(trackId).find((e) => e.slug === slug);
}

/** Next upcoming session for the hero feature, or undefined if none. */
export function nextSession(events: EkantikEvent[]): EkantikEvent | undefined {
  const now = Date.now();
  return [...events]
    .filter((e) => e.status !== "past" && Date.parse(e.datetimeStart) >= now)
    .sort(byChrono)[0];
}

/** Chronological by start time, soonest first. */
function byChrono(a: EkantikEvent, b: EkantikEvent): number {
  return Date.parse(a.datetimeStart) - Date.parse(b.datetimeStart);
}

/** Seats remaining, or null when capacity is uncapped. */
export function seatsRemaining(event: EkantikEvent): number | null {
  if (event.capacity == null) return null;
  return Math.max(0, event.capacity - event.registrationCount);
}
