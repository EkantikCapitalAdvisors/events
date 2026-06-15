import type { TrackConfig } from "@/lib/tracks";
import { FIRM_LEAD, FIRM_NAME } from "@/lib/tracks";

/**
 * "The Ekantik Approach" context band (rendered thrice). Sits under the hero,
 * before the control bar, and frames the firm + THIS surface's program — why
 * the sessions exist and who they're for. Speaks only this lane (§6): no
 * sibling product's name, claims, or figures.
 *
 * ⚠️ Attorney-gated draft template copy (lives in lib/tracks intro).
 */
export function Introduction({ track }: { track: TrackConfig }) {
  return (
    <section aria-labelledby="intro-heading" className="bg-ivory">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="h-px w-16 bg-gold" aria-hidden />
        <p className="mt-6 font-mono text-[11px] uppercase tracking-label text-slate">
          About {FIRM_NAME}
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h2
              id="intro-heading"
              className="font-display text-3xl leading-snug text-navy sm:text-4xl"
            >
              {FIRM_LEAD}
            </h2>
            <p className="mt-6 font-mono text-xs uppercase tracking-label text-gold-600">
              {track.intro.heading}
            </p>
          </div>

          <div className="lg:pt-2">
            <p className="text-base leading-relaxed text-navy/90">
              {track.intro.body}
            </p>
            <p className="mt-6 border-l-2 border-gold/50 pl-4 text-sm italic leading-relaxed text-slate">
              {track.intro.forWhom}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
