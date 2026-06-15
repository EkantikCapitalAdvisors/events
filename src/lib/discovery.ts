import type { TrackId } from "./tracks";

/**
 * Build the discovery-meeting (Calendly) URL with attribution preserved — the
 * same `?ref=` attribution loop (§5) carried through to the booking via UTM
 * params, plus the track so EPIG vs ECFS bookings stay distinguishable.
 */
export function buildDiscoveryUrl(
  base: string,
  opts: { track: TrackId; sourceRef?: string },
): string {
  try {
    const u = new URL(base);
    u.searchParams.set("utm_source", "ekantik-events");
    u.searchParams.set("utm_medium", opts.track);
    u.searchParams.set("utm_campaign", "discovery");
    if (opts.sourceRef) u.searchParams.set("utm_content", opts.sourceRef);
    return u.toString();
  } catch {
    return base;
  }
}
