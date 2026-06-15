import type { EkantikEvent } from "@/lib/types";

/**
 * Phase 1 typed config seed (the "MVP shortcut" from §2). This is the source
 * of truth until Supabase is wired in Phase 2; the shape maps 1:1 onto the
 * `events` table (see supabase/migrations).
 *
 * ⚠️ ATTORNEY GATE: every title/description below is a §7 draft template.
 * Performance figures are bracketed placeholders. Nothing ships until
 * securities-counsel review. The three claim sets never share a surface.
 *
 * Dates are illustrative future/past timestamps relative to launch; swap in
 * the real first-series dates per §12.
 */

const SPEAKER = {
  name: "Hiren Desai",
  title: "Founder & CIO, Ekantik Capital Advisors",
  // Track-neutral by design: the shared bio never names a sibling product
  // line, so no surface (e.g. public futures) carries another lane's brand or
  // claims (§6 cross-contamination guardrail).
  bio: "Hiren Desai is the founder and Chief Investment Officer of Ekantik Capital Advisors. He works from a single conviction — that disciplined, transparent process beats prediction — and holds every program he runs to that standard: rules defined in advance, risk engineered before return, and a record kept in the open.",
};

export const EVENTS: EkantikEvent[] = [
  // ───────────────────────── Track A — ECFS (public · futures) ─────────────
  {
    id: "ecfs-a1",
    slug: "cash-flow-machine-rules-based-futures",
    title:
      "The Cash-Flow Machine: How a Rules-Based Futures System Works Without Predicting the Market",
    subtitle: "A live walkthrough of the methodology.",
    description:
      "Most traders try to predict. We built a system that doesn't need to. Hiren Desai opens the actual rulebook — how entries, exits, and risk are defined in advance, why discipline beats forecasting, and what rules-based intraday futures looks like in practice. No black boxes. No hindsight charts.",
    whatYoullLearn: [
      "Why rules remove prediction",
      "How risk is defined before a trade",
      "What separates a logged, repeatable process from discretionary trading",
      "How to evaluate any cash-flow strategy for structural soundness",
    ],
    category: "ecfs",
    complianceProfile: "futures",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-09T17:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    zoomRegistrationUrl:
      "https://zoom.us/webinar/register/PLACEHOLDER-ecfs-a1?ref=site",
    capacity: 500,
    registrationCount: 214,
    status: "upcoming",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/ecfs-a1.svg",
  },
  {
    id: "ecfs-a2",
    slug: "nothing-hidden-logged-futures-record",
    title: "Nothing Hidden: A Trade-by-Trade Look at a Logged Futures Record",
    subtitle: "Radical transparency — the hand-logged record, examined live.",
    description:
      "Most performance claims are a number on a slide. We'd rather show you the trades. We walk through a representative segment of the hand-logged record — wins and losses both — and what the data does and doesn't say. _[Figures are hand-logged actuals, attorney-reviewed. Past performance does not guarantee future results.]_",
    whatYoullLearn: [
      "How a transparent record is maintained",
      "How to read win rate, profit factor, and expectancy without being misled",
      "Why losses are part of a sound process",
      "The questions to ask before trusting any track record",
    ],
    category: "ecfs",
    complianceProfile: "futures",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-23T17:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    zoomRegistrationUrl:
      "https://zoom.us/webinar/register/PLACEHOLDER-ecfs-a2?ref=site",
    capacity: 500,
    registrationCount: 88,
    status: "upcoming",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/ecfs-a2.svg",
  },
  {
    id: "ecfs-a3",
    slug: "loss-first-architecture",
    title:
      "Loss-First Architecture: Why We Engineer the Downside Before the Upside",
    subtitle: "The discipline of designing for survival first.",
    description:
      "Returns get the attention. Survival earns them. Hiren Desai explains Loss-First Architecture — risk engineered before return is pursued, how position risk is bounded, why disciplined downside management is a practice, not a promise. _[Risk frameworks are operating disciplines, not guarantees or principal protection.]_",
    whatYoullLearn: [
      "Why downside design precedes upside pursuit",
      "How a loss-to-principal standard shapes decisions",
      "The difference between managing risk and promising outcomes",
      "How to pressure-test any strategy's risk discipline",
    ],
    category: "ecfs",
    complianceProfile: "futures",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-05-21T17:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    replayUrl: "https://zoom.us/rec/PLACEHOLDER-ecfs-a3",
    registrationCount: 332,
    status: "past",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/ecfs-a3.svg",
  },

  // ───────────────────────── Track C — Alpha (public · publisher) ──────────
  {
    id: "alpha-c1",
    slug: "inside-the-pipeline-research",
    title:
      "Inside the Pipeline: How Ekantik Surfaces Ideas Before the Market Does",
    subtitle: "A live walk through the research pipeline — signal to thesis.",
    description:
      "Everyone has opinions. We have a process. Hiren Desai opens the actual pipeline behind Ekantik's research — how a raw signal becomes a tracked thesis, what gets filtered out and why, and what disciplined, repeatable research looks like when nothing is left to instinct. _[Educational research, not personalized advice; any model portfolio is hypothetical; figures are historical/backtested and labeled.]_",
    whatYoullLearn: [
      "The pipeline end to end",
      "How ideas move from signal to thesis",
      "How to separate durable trends from noise",
      "How to read any research process critically",
    ],
    category: "alpha",
    complianceProfile: "publisher",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-16T18:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    zoomRegistrationUrl:
      "https://zoom.us/webinar/register/PLACEHOLDER-alpha-c1?ref=site",
    capacity: 750,
    registrationCount: 401,
    status: "upcoming",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/alpha-c1.svg",
  },
  {
    id: "alpha-c2",
    slug: "five-step-research-framework",
    title: "The 5-Step Research Framework: AOMG to Bias Formation",
    subtitle: "The methodology institutional investors use, made explicit.",
    description:
      "A working session on Ekantik's five-step framework — Areas of Maximum Growth, disruption tracking, Mag 7 monitoring, episodic pivots, and bias formation — and how they combine into one repeatable process. _[Educational; not advice; hypothetical/backtested figures labeled.]_",
    whatYoullLearn: [
      "What each step screens for",
      "How the steps compound into a thesis",
      "Where most research breaks down",
      "How to apply the framework to your own watchlist",
    ],
    category: "alpha",
    complianceProfile: "publisher",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-30T18:00:00.000Z",
    durationMin: 75,
    sessionType: "webinar",
    zoomRegistrationUrl:
      "https://zoom.us/webinar/register/PLACEHOLDER-alpha-c2?ref=site",
    capacity: 750,
    registrationCount: 122,
    status: "upcoming",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/alpha-c2.svg",
  },
  {
    id: "alpha-c3",
    slug: "research-not-tips-self-directed",
    title:
      "Research, Not Tips: Institutional-Grade Process for the Self-Directed Investor",
    subtitle:
      "For investors who'd rather understand the process than be handed a pick.",
    description:
      "The Guided lens: how a serious self-directed investor uses an institutional research process — methodology, the hypothetical model portfolio, and what disciplined idea-generation actually requires. _[Publisher/educational content; the model portfolio is hypothetical and not a recommendation; this is not personalized investment advice.]_",
    whatYoullLearn: [
      "How the Guided methodology works",
      "What a hypothetical model portfolio does and doesn't tell you",
      "How to build a repeatable research habit",
      "How to judge research quality",
    ],
    category: "alpha",
    complianceProfile: "publisher",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-05-28T18:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    replayUrl: "https://zoom.us/rec/PLACEHOLDER-alpha-c3",
    registrationCount: 540,
    status: "past",
    isGated: false,
    requiresAccreditation: false,
    thumbnailUrl: "/thumbnails/alpha-c3.svg",
  },

  // ───────────────────────── Track B — EPIG (gated · advisory) ─────────────
  {
    id: "epig-b1",
    slug: "an-invitation-inside-the-ekantik-500",
    title: "An Invitation: Inside the Ekantik 500",
    subtitle: "A private briefing for accredited investors.",
    description:
      "By invitation. The Ekantik 500 is a managed approach for a small number of accredited families who want their capital handled with institutional discipline and full fiduciary accountability. Hiren Desai walks through the methodology, the principles that govern it, and what a relationship actually involves — candidly, nothing oversold. _[Accredited investors only. Investing involves risk; any figures are historical and accompanied by full disclosures.]_",
    whatYoullLearn: [
      "The methodology behind the Ekantik 500",
      "What fiduciary, full-accountability management means in practice",
      "How the approach manages risk and capital",
      "Whether it fits your situation — said plainly",
    ],
    category: "epig",
    complianceProfile: "advisory",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-14T22:00:00.000Z",
    durationMin: 60,
    sessionType: "webinar",
    zoomRegistrationUrl:
      "https://zoom.us/webinar/register/PLACEHOLDER-epig-b1?ref=invite",
    capacity: 100,
    registrationCount: 31,
    status: "upcoming",
    isGated: true,
    requiresAccreditation: true,
    thumbnailUrl: "/thumbnails/epig-b1.svg",
  },
  {
    id: "epig-b2",
    slug: "ekantik-500-roundtable-cio",
    title: "Ekantik 500 Roundtable: A Candid Conversation with the CIO",
    subtitle: "An interactive session for accredited investors — limited seats.",
    description:
      "A small-group conversation, not a presentation. Bring your questions. Hiren Desai hosts an interactive roundtable — methodology, risk, fees, and fit, answered directly. Capped at [N] to keep it a real conversation. _[Accredited investors only; full disclosures apply.]_",
    whatYoullLearn: [
      "Direct answers on methodology and risk",
      "How fees and the relationship structure actually work",
      "Whether the approach fits your situation",
      "A candid read on what full fiduciary accountability means",
    ],
    category: "epig",
    complianceProfile: "advisory",
    speakerName: SPEAKER.name,
    speakerTitle: SPEAKER.title,
    speakerBio: SPEAKER.bio,
    datetimeStart: "2026-07-28T22:00:00.000Z",
    durationMin: 45,
    sessionType: "meeting",
    zoomRegistrationUrl:
      "https://zoom.us/meeting/register/PLACEHOLDER-epig-b2?ref=invite",
    capacity: 12,
    registrationCount: 7,
    status: "upcoming",
    isGated: true,
    requiresAccreditation: true,
    thumbnailUrl: "/thumbnails/epig-b2.svg",
  },
];
