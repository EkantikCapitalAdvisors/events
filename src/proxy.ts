import { NextResponse, type NextRequest } from "next/server";
import { TRACK_HEADER, EDGE_HOST_HEADER } from "@/lib/resolveTrack";
import { isTrackId, trackForHost } from "@/lib/tracks";

/**
 * Resolves the track once per request and stamps it on a request header so
 * every server component reads a single source of truth.
 *
 * Track host priority:
 *   • `x-ekantik-host` — real subdomain forwarded by the edge Worker when the
 *     app is embedded at /events on an existing landing page.
 *   • `host` — direct subdomain hit (dedicated host).
 * Local/preview: a `?track=` query param overrides both, so all three surfaces
 * are viewable on localhost (and the .vercel.app preview) without DNS.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const preview = url.searchParams.get("track");
  const effectiveHost =
    req.headers.get(EDGE_HOST_HEADER) ?? req.headers.get("host");
  const fromHost = trackForHost(effectiveHost);

  const track = isTrackId(preview) ? preview : fromHost;

  const requestHeaders = new Headers(req.headers);
  if (track) requestHeaders.set(TRACK_HEADER, track);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|thumbnails).*)"],
};
