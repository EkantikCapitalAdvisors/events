/**
 * Domain types — mirror the Supabase `events` and `registrations` tables (§2).
 * The typed config seed (src/data/events.ts) is the Phase 1 source of truth;
 * the same shape maps 1:1 onto the Supabase rows for Phase 2.
 */

export type Category = "ecfs" | "alpha" | "epig" | "foundational";

/**
 * Decouples the legal lane from the display category (§2). The standing
 * disclaimer footer renders off this, NOT off `category`.
 */
export type ComplianceProfile = "futures" | "publisher" | "advisory";

export type SessionType = "webinar" | "meeting";

export type EventStatus = "upcoming" | "live" | "past";

export interface EkantikEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  /** Markdown. */
  description: string;
  whatYoullLearn: string[];
  category: Category;
  complianceProfile: ComplianceProfile;
  speakerName: string;
  speakerTitle: string;
  speakerBio: string;
  /** ISO 8601, stored UTC, rendered localized. */
  datetimeStart: string;
  durationMin: number;
  sessionType: SessionType;
  zoomSessionId?: string;
  /** Phase 1 link-out: per-event Zoom source-tracking registration link. */
  zoomRegistrationUrl?: string;
  capacity?: number;
  registrationCount: number;
  status: EventStatus;
  /** true = offering funnel (EPIG); excluded from public/indexed surfaces. */
  isGated: boolean;
  requiresAccreditation: boolean;
  replayUrl?: string;
  thumbnailUrl?: string;
}

/** Phase 2 native capture row (src/lib/types maps to Supabase `registrations`). */
export interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  accredited: boolean;
  /** From `?ref=` — the attribution key. */
  sourceRef?: string;
  zoomRegistrantId?: string;
  /** Unique per registrant — never cache/reuse across people. */
  zoomJoinUrl?: string;
  hubspotContactId?: string;
  createdAt: string;
}
