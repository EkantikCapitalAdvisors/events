import type { Category, ComplianceProfile } from "./types";

/**
 * Track configuration — the heart of "build once, render thrice" (§1).
 *
 * One events module renders three distinct regulatory surfaces. The track is
 * resolved from the request host (see resolveTrack.ts); each surface is
 * PRE-SCOPED to its own category set and carries its own gating + indexability
 * + compliance lane. The cross-contamination guardrail (§6) is enforced here:
 * a public surface can NEVER include the gated EPIG category.
 */
export type TrackId = "ecfs" | "alpha" | "epig";

export interface TrackConfig {
  id: TrackId;
  /** Landing-page subdomain this surface is embedded on. */
  host: string;
  /** Short display label. */
  label: string;
  /** Hero conviction line (§3 / §9 — a thesis, not "Upcoming Webinars"). */
  heroKicker: string;
  heroHeadline: string;
  heroThesis: string;
  /** Categories this surface is allowed to render. Load-bearing for §6. */
  categories: Category[];
  complianceProfile: ComplianceProfile;
  /** true = offering funnel (EPIG). Gated → noindex, accreditation/token. */
  gated: boolean;
  /** Drives robots meta + Event schema emission. Gated is never indexed. */
  indexable: boolean;
  /** HubSpot stream tag — three fully isolated streams (§5). */
  hubspotStream: string;
  /**
   * Per-surface introduction (the "Ekantik Approach" context band). Speaks ONLY
   * this lane's program — no sibling product's name, claims, or figures — so the
   * §6 guardrail holds. Attorney-gated draft template like all §7 copy.
   */
  intro: {
    /** Program framing line, e.g. "The Ekantik Cash-Flow System". */
    heading: string;
    /** What the program is + why these sessions exist (no figures). */
    body: string;
    /** Who the program / these sessions are for. */
    forWhom: string;
  };
  /**
   * Calendly link for a 1:1 discovery meeting, shown when a session time
   * doesn't work. Set ONLY on lanes where a personalized consultation is an
   * appropriate next step — advisory (EPIG) and futures (ECFS). Deliberately
   * absent on the publisher (Alpha) lane: a personalized-call CTA there would
   * make the public session a solicitation, which the publisher posture and
   * §6 guardrail forbid (Alpha routes accredited interest via the WF5 bridge).
   */
  discoveryUrl?: string;
}

/** Single Calendly target (env-overridable for staging). */
const DISCOVERY_URL =
  process.env.NEXT_PUBLIC_DISCOVERY_URL ??
  "https://calendly.com/hd-ekantikcapital/30min";

/** Legal entity + firm-level conviction — identical on every surface (safe). */
export const FIRM_NAME = "Ekantik Capital Advisors LLC";
export const FIRM_LEAD =
  "Ekantik Capital Advisors LLC is built on a single conviction: disciplined, transparent process beats prediction.";

export const TRACKS: Record<TrackId, TrackConfig> = {
  ecfs: {
    id: "ecfs",
    host: "cashflow.ekantikcapital.com",
    label: "ECFS",
    heroKicker: "Ekantik Cash-Flow System",
    heroHeadline: "A system that doesn't need to predict the market.",
    heroThesis:
      "These sessions exist for one reason: to show the rulebook in the open. Rules-based intraday futures, a hand-logged record, and downside engineered before upside — examined live, nothing hidden.",
    categories: ["ecfs", "foundational"],
    complianceProfile: "futures",
    gated: false,
    indexable: true,
    hubspotStream: "ecfs",
    intro: {
      heading: "The Ekantik Cash-Flow System",
      body: "A rules-based intraday futures methodology — entries, exits, and risk defined in advance, every trade hand-logged, the downside engineered before the upside. These sessions open the rulebook and the record, examined live, so you can judge the approach on its structure rather than its story.",
      forWhom:
        "For traders and allocators who want to evaluate a cash-flow approach on how it is built.",
    },
    discoveryUrl: DISCOVERY_URL,
  },
  alpha: {
    id: "alpha",
    host: "alpha.ekantikcapital.com",
    label: "Alpha Engine",
    heroKicker: "Ekantik Alpha Engine",
    heroHeadline: "A research process, made explicit.",
    heroThesis:
      "Everyone has opinions; we have a process. These sessions open the institutional-grade research pipeline — signal to thesis — so a serious self-directed investor can see how disciplined idea-generation actually works. Educational research, not advice.",
    categories: ["alpha", "foundational"],
    complianceProfile: "publisher",
    gated: false,
    indexable: true,
    hubspotStream: "alpha-research",
    intro: {
      heading: "The Ekantik Alpha Engine",
      body: "An institutional-grade research process for the self-directed investor — a repeatable pipeline that moves an idea from signal to thesis, with the steps made explicit. These sessions teach the process itself: educational research, openly walked through, never a tip or a personalized recommendation.",
      forWhom:
        "For self-directed investors who would rather understand a research process than be handed a pick.",
    },
    // Alpha (publisher) has NO discoveryUrl — see TrackConfig.
  },
  epig: {
    id: "epig",
    host: "epig500.ekantikcapital.com",
    label: "EPIG Managed",
    heroKicker: "The Ekantik 500",
    heroHeadline: "By invitation. For accredited families.",
    heroThesis:
      "A managed approach for a small number of accredited families who want their capital handled with institutional discipline and full fiduciary accountability. Methodology and fit, said plainly — never a return promise.",
    categories: ["epig"],
    complianceProfile: "advisory",
    gated: true,
    indexable: false,
    hubspotStream: "epig",
    intro: {
      heading: "The Ekantik 500",
      body: "A managed approach for a small number of accredited families — institutional discipline, full fiduciary accountability, and capital handled with care. These private briefings cover the methodology and whether it fits your situation, candidly, before any relationship begins.",
      forWhom:
        "For accredited investors and families evaluating a fiduciary, full-accountability manager.",
    },
    discoveryUrl: DISCOVERY_URL,
  },
};

export const DEFAULT_TRACK: TrackId = "ecfs";

export function isTrackId(value: string | null | undefined): value is TrackId {
  return value === "ecfs" || value === "alpha" || value === "epig";
}

export function getTrack(id: TrackId): TrackConfig {
  return TRACKS[id];
}

/** Map a request host to its track. Subdomain CNAME pattern (§1). */
export function trackForHost(host: string | null | undefined): TrackId | null {
  if (!host) return null;
  const h = host.toLowerCase().split(":")[0];
  for (const track of Object.values(TRACKS)) {
    if (h === track.host) return track.id;
  }
  return null;
}
