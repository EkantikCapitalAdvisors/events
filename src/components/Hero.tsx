import type { TrackConfig } from "@/lib/tracks";
import type { EkantikEvent } from "@/lib/types";
import { dateParts, durationLabel } from "@/lib/format";
import { Countdown } from "./Countdown";
import { RegisterButton } from "./RegisterButton";
import { LocalTime } from "./LocalTime";
import { SessionTypeTag } from "./CategoryTag";

/**
 * Hero (§3 / §9) — a thesis, not "Upcoming Webinars". Opens with the track's
 * conviction line, then features the NEXT session inline with the signature
 * Navy/Gold date-countdown lockup (the one place we spend boldness). When
 * there's no upcoming session, the hero stands on the thesis alone.
 */
export function Hero({
  track,
  next,
  sourceRef,
}: {
  track: TrackConfig;
  next?: EkantikEvent;
  sourceRef?: string;
}) {
  const parts = next ? dateParts(next.datetimeStart, true) : null;

  return (
    <section className="bg-navy text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-xs uppercase tracking-label text-gold">
            {track.heroKicker}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {track.heroHeadline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
            {track.heroThesis}
          </p>
          {track.gated && (
            <p className="mt-4 font-mono text-xs uppercase tracking-label text-gold/70">
              By invitation · Accredited investors only
            </p>
          )}
        </div>

        {next && parts ? (
          <div className="flex flex-col justify-center">
            <div className="rounded-xl border border-gold/30 bg-navy-900/60 p-7 shadow-xl">
              <p className="font-mono text-[11px] uppercase tracking-label text-gold">
                Next session
              </p>

              <div className="mt-4 flex items-stretch gap-5">
                <div className="flex flex-col items-center justify-center rounded-lg border border-gold/30 bg-gold/10 px-4 py-3">
                  <span className="font-mono text-xs uppercase tracking-label text-gold">
                    {parts.month}
                  </span>
                  <span className="font-display text-4xl leading-none text-white">
                    {parts.day}
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="font-display text-2xl leading-snug text-white">
                    {next.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-ivory/70">
                    <LocalTime iso={next.datetimeStart} /> ·{" "}
                    {durationLabel(next.durationMin)}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <Countdown toIso={next.datetimeStart} />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <RegisterButton event={next} sourceRef={sourceRef} variant="hero" />
                <SessionTypeTag type={next.sessionType} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="max-w-xs text-center font-mono text-sm uppercase tracking-label text-ivory/50">
              No session scheduled right now — add your name below and we&apos;ll
              tell you first.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
