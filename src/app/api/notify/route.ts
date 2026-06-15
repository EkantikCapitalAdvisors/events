import { NextResponse, type NextRequest } from "next/server";
import { isTrackId, getTrack } from "@/lib/tracks";

/**
 * Notify-me capture (§3, Feature #8). Validates the opt-in and routes the lead
 * to the TRACK'S HubSpot stream — keeping the three audiences isolated (§5).
 *
 * Phase 1: persists/forwards the lead. The HubSpot upsert is stubbed behind an
 * env check so the form works end-to-end locally; wire HUBSPOT_TOKEN +
 * per-stream list IDs to make it live.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; track?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "Valid email required" }, { status: 422 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent required" }, { status: 422 });
  }
  if (!isTrackId(body.track)) {
    return NextResponse.json({ error: "Unknown track" }, { status: 422 });
  }

  const track = getTrack(body.track);

  // ── HubSpot upsert into the track's isolated stream (Phase 1 native sync) ──
  // Intentionally a no-op until credentials are configured, so the UX works
  // offline. Never mix streams: route by `track.hubspotStream`.
  if (process.env.HUBSPOT_TOKEN) {
    // TODO(phase-1): upsert contact + add to list `track.hubspotStream`,
    // set lifecycle stage = Lead, tag source = "events:notify-me".
  } else {
    console.info(
      `[notify] would enroll ${email} into HubSpot stream "${track.hubspotStream}"`,
    );
  }

  return NextResponse.json({ ok: true, stream: track.hubspotStream });
}
