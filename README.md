# Ekantik Events

The events module from the [Master Build Spec](#) — **one module, rendered thrice** across three regulatory lanes that must never cross-contaminate:

| Track | Subdomain (host) | Compliance lane | Posture |
|---|---|---|---|
| **ECFS** | `cashflow.ekantikcapital.com` | `futures` | public, indexed |
| **Alpha Engine** | `alpha.ekantikcapital.com` | `publisher` | public, indexed |
| **EPIG Managed** | `epig500.ekantikcapital.com` | `advisory` | **gated, `noindex`** |

Stack: **Next.js 16 (App Router) · React 19 · Tailwind · TypeScript**. Data is a typed config seed today (Phase 1 "MVP shortcut"); a matching Supabase schema is committed for the Phase 2 swap.

> ⚠️ **ATTORNEY GATE.** All event copy and every performance figure in `src/data/events.ts` is a **draft template**. Nothing ships until securities-counsel review. Performance numbers are bracketed placeholders.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (redirects to /events)
npm run build && npm run start
```

### Previewing each surface locally

In production the track is resolved from the **request host**. On localhost, append `?track=`:

- ECFS → http://localhost:3000/events?track=ecfs
- Alpha → http://localhost:3000/events?track=alpha
- EPIG (gated) → http://localhost:3000/events?track=epig

Or send a `Host:` header (`curl -H 'Host: alpha.ekantikcapital.com' …`).

### Screenshots (optional)

`scripts/shoot.cjs` renders each surface to `/tmp/shots/*.png` for quick visual
review. It uses `playwright-core` (no bundled browser) and a Chrome you supply:

```bash
npm run start &                              # server on :3000
CHROME_PATH=/path/to/chrome npm run shots    # e.g. a Chrome-for-Testing build
```

## How "build once, render thrice" works

```
request host ──▶ src/proxy.ts ──▶ x-ekantik-track header
                                         │
                            src/lib/resolveTrack.ts
                                         │
                 src/lib/tracks.ts  (per-track config: categories,
                 compliance_profile, gated, indexable, hubspot stream)
                                         │
                 src/lib/events.ts  (track-SCOPED query — the single
                 choke point enforcing the §6 isolation guardrail)
```

The cross-contamination guardrail is enforced in **three** places, defence in depth:
1. `eventsForTrack()` allow-lists by category **and** drops gated events on public surfaces.
2. Detail routes use the scoped lookup, so an EPIG slug **404s** on a public host.
3. `robots.ts` + per-page `robots` metadata set `noindex` / `Disallow: /` on the gated surface, and `EventSchema` JSON-LD is emitted on public tracks only.

## Project layout

```
src/
  proxy.ts                  host → track resolution (Next 16 "proxy" convention)
  lib/
    types.ts                domain types (mirror the Supabase tables)
    tracks.ts               per-track config — the heart of render-thrice
    resolveTrack.ts         reads the track for a server render
    events.ts               track-scoped data access (swap to Supabase in P2)
    compliance.ts           per-lane standing disclaimers (futures/publisher/advisory)
    format.ts               localized time, ICS + Google Calendar
  data/events.ts            Phase 1 typed seed (§7 attorney-gated copy)
  components/               Hero, EventsBrowser (search/filter/toggle), EventCard,
                            Countdown, LocalTime, NotifyMe, AddToCalendar, …
  app/
    events/page.tsx         the module: hero + browser + notify-me + footer
    events/[slug]/page.tsx  event detail
    api/notify/route.ts     notify-me capture → track's HubSpot stream
    api/register/route.ts   Phase 2 native registration (documented stub)
    robots.ts               track-aware robots policy
supabase/migrations/0001_events.sql   the Phase 2 schema (§2)
.env.example                Supabase / Zoom S2S / HubSpot config
```

## Feature checklist (§10) — Phase 1 status

| # | Feature | Status |
|---|---|---|
| 1 | Keyword search (title/topic/speaker) | ✅ |
| 2 | Category sub-filter | ✅ (shown only when a surface spans >1 category) |
| 3 | Upcoming / On-Demand toggle | ✅ |
| 4 | Timezone auto-detect + localized times | ✅ (`LocalTime`) |
| 5 | Add-to-calendar (ICS + Google) | ✅ |
| 6 | Countdown (next session) | ✅ |
| 7 | Seats-remaining / real cap | ✅ (Signal Red only at ≤10% of a real cap) |
| 8 | Notify-me opt-in | ✅ → `/api/notify` (routes to track stream) |
| 9 | Native registration form | 🔜 Phase 2 — `/api/register` stub + flow documented |
| 10 | Confirmation + unique join link + calendar | 🔜 Phase 2 |
| 11 | Replay / on-demand library | ✅ (past sessions surface replays) |
| 12 | Gating + per-lane disclaimers | ✅ |
| 13 | Accreditation attestation / self-ID | ✅ gate enforced server-side; form fields in §8 |
| 14 | SEO / Event schema (public only) | ✅ |
| 15 | Source attribution (`?ref=`) | ✅ threaded into link-out + capture |
| 16 | Compliance footer (per profile) | ✅ |
| 17 | Speaker authority | ✅ (track-neutral bio — no cross-lane brand) |
| 18 | Mobile-first + a11y floor | ✅ focus-visible, reduced-motion, semantic markup |
| 19 | Analytics | 🔜 Phase 3 |

## Phase 2 / 3 (not in this build)

- **Phase 2** — swap the typed seed for Supabase; native registration via Zoom Server-to-Server OAuth → unique `join_url` → HubSpot upsert into the track's stream → branded confirmation/ICS. The full flow is encoded as a contract in `src/app/api/register/route.ts`; the swap is mechanical once `.env` is filled.
- **Phase 3** — replay library, dashboard wiring, evergreen/simulive, Guided `alpha → epig` re-home (a config change in `tracks.ts`).
