import { headers } from "next/headers";
import { DEFAULT_TRACK, isTrackId, trackForHost, type TrackId } from "./tracks";

export const TRACK_HEADER = "x-ekantik-track";

/**
 * Trusted hostname forwarded by the edge (Cloudflare Worker) when the events
 * app is embedded at `/events` on an existing landing page. In that topology
 * the request reaches Vercel with the Vercel hostname, so the real subdomain
 * (which selects the track) arrives in this header instead. See
 * infra/cloudflare/events-router.js.
 */
export const EDGE_HOST_HEADER = "x-ekantik-host";

/**
 * Resolve the active track for a server render. Priority:
 *   1. The `x-ekantik-track` header set by the proxy (from host or ?track=).
 *   2. The forwarded edge host, then the raw host header (defensive).
 *   3. DEFAULT_TRACK.
 *
 * Production resolves by subdomain host (§1) — either the direct Host header
 * (dedicated subdomain) or the edge-forwarded host (embedded /events path).
 */
export async function resolveTrack(): Promise<TrackId> {
  const h = await headers();

  const fromHeader = h.get(TRACK_HEADER);
  if (isTrackId(fromHeader)) return fromHeader;

  const fromHost = trackForHost(h.get(EDGE_HOST_HEADER) ?? h.get("host"));
  if (fromHost) return fromHost;

  return DEFAULT_TRACK;
}
