import { headers } from "next/headers";
import { DEFAULT_TRACK, isTrackId, trackForHost, type TrackId } from "./tracks";

export const TRACK_HEADER = "x-ekantik-track";

/**
 * Resolve the active track for a server render. Priority:
 *   1. The `x-ekantik-track` header set by middleware (from host or ?track=).
 *   2. The raw host header (defensive — e.g. if middleware is bypassed).
 *   3. DEFAULT_TRACK.
 *
 * Production resolves purely by subdomain host (§1). The `?track=` override is
 * a local/preview convenience wired in middleware, never a public entry point.
 */
export async function resolveTrack(): Promise<TrackId> {
  const h = await headers();

  const fromHeader = h.get(TRACK_HEADER);
  if (isTrackId(fromHeader)) return fromHeader;

  const fromHost = trackForHost(h.get("host"));
  if (fromHost) return fromHost;

  return DEFAULT_TRACK;
}
