import { NextResponse, type NextRequest } from "next/server";
import { TRACK_HEADER } from "@/lib/resolveTrack";
import { isTrackId, trackForHost } from "@/lib/tracks";

/**
 * Resolves the track once per request and stamps it on a request header so
 * every server component reads a single source of truth.
 *
 * Production: track comes from the subdomain host (cashflow / alpha / epig500).
 * Local/preview: a `?track=` query param overrides, so all three surfaces are
 * viewable on localhost without subdomain DNS.
 */
export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const preview = url.searchParams.get("track");
  const fromHost = trackForHost(req.headers.get("host"));

  const track = isTrackId(preview) ? preview : fromHost;

  const requestHeaders = new Headers(req.headers);
  if (track) requestHeaders.set(TRACK_HEADER, track);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|thumbnails).*)"],
};
