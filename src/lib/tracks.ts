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
}

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
