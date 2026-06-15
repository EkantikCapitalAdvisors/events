import { NextResponse, type NextRequest } from "next/server";
import { resolveTrack } from "@/lib/resolveTrack";
import { getTrack } from "@/lib/tracks";
import { eventForSlug } from "@/lib/events";

/**
 * Phase 2 — native registration (§4). This is the owned path that replaces the
 * Phase 1 Zoom link-out. It is intentionally a documented STUB: the production
 * build is gated on a Zoom Server-to-Server OAuth app + HubSpot token (§12).
 * The full intended flow is encoded below so the swap is mechanical.
 *
 * Flow (type-agnostic — only the Zoom endpoint differs by session_type):
 *   1. Validate + write Supabase `registrations`
 *      { event_id, name, email, phone, accredited, source_ref }.
 *   2. Zoom S2S OAuth → POST /v2/{webinars|meetings}/{id}/registrants
 *      → { registrant_id, join_url }   // join_url is UNIQUE per person.
 *   3. Update the Supabase row → zoom_registrant_id, zoom_join_url.
 *   4. Upsert HubSpot contact into the TRACK'S stream → write properties
 *      incl. zoom_join_url, webinar_source_ref, accreditation_status.
 *   5. Enroll in the track's confirmation workflow (merges zoom_join_url);
 *      Zoom's default confirmation is disabled in Phase 2.
 *   6. Return ICS + Google Calendar link (join_url inside the entry).
 *
 * Gotchas baked into the contract: idempotency key = event_id + email;
 * never send confirmation until join_url exists; Zoom approval = auto.
 */
export async function POST(req: NextRequest) {
  let body: {
    slug?: string;
    name?: string;
    email?: string;
    phone?: string;
    accredited?: boolean;
    sourceRef?: string;
    consent?: boolean;
    // Lane-specific fields (§8). Captured here so the Phase 2 HubSpot upsert
    // has everything it needs; the public-lane accreditation self-ID is a
    // routing signal only (WF5 bridge), never a gate.
    accreditationSelfId?: string;
    primaryInterest?: string;
    futuresTrader?: string;
    researchInterest?: string;
    investableAssets?: string;
    inviteCode?: string;
    prompt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trackId = await resolveTrack();
  const track = getTrack(trackId);
  const event = body.slug ? eventForSlug(trackId, body.slug) : undefined;

  // Scoped lookup means a gated session can't be registered from a public host.
  if (!event) {
    return NextResponse.json({ error: "Unknown session" }, { status: 404 });
  }

  // Basic validation (full schema validation lands with the Supabase wiring).
  const email = (body.email ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body.name) {
    return NextResponse.json(
      { error: "Name and valid email required" },
      { status: 422 },
    );
  }
  // The accreditation attestation IS the gate for the advisory lane (§8).
  if (event.requiresAccreditation && !body.accredited) {
    return NextResponse.json(
      { error: "Accreditation attestation required for this session" },
      { status: 403 },
    );
  }
  // Advisory lane is higher-intent: phone + investable-assets band are required
  // (§8 EPIG form). Public lanes keep these optional / absent.
  if (event.requiresAccreditation) {
    if (!body.phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 422 });
    }
    if (!body.investableAssets) {
      return NextResponse.json(
        { error: "Investable-assets range required" },
        { status: 422 },
      );
    }
  }

  // The HubSpot upsert targets the TRACK'S isolated stream (§5) with these
  // properties — never mixing audiences across lanes:
  //   email, firstname, lastname, phone, webinar_source_ref,
  //   accreditation_status (attestation on advisory; self-ID on public),
  //   research_interest (Alpha), zoom_join_url, webinar_datetime,
  //   last_webinar_registered.
  const ready = Boolean(process.env.ZOOM_ACCOUNT_ID && process.env.HUBSPOT_TOKEN);
  if (!ready) {
    return NextResponse.json(
      {
        error: "native_registration_not_configured",
        message:
          "Phase 2 native registration requires Zoom S2S OAuth + HubSpot credentials. Use the Phase 1 Zoom link-out until configured.",
        fallbackUrl: event.zoomRegistrationUrl ?? null,
        stream: track.hubspotStream,
      },
      { status: 501 },
    );
  }

  // TODO(phase-2): steps 1–6 above once credentials are present.
  return NextResponse.json({ error: "not_implemented" }, { status: 501 });
}
