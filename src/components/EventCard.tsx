import Link from "next/link";
import type { EkantikEvent } from "@/lib/types";
import { durationLabel } from "@/lib/format";
import { LocalTime } from "./LocalTime";
import { CategoryTag, SessionTypeTag } from "./CategoryTag";
import { Scarcity } from "./Scarcity";
import { RegisterButton } from "./RegisterButton";

/**
 * Event card (§3) — title, localized date/time (mono), duration, speaker,
 * category tag, scarcity line, Register. Kept deliberately quiet so the hero's
 * featured session stays the one bold moment (§9 signature element).
 */
export function EventCard({
  event,
  sourceRef,
}: {
  event: EkantikEvent;
  sourceRef?: string;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-navy/10 bg-white p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryTag category={event.category} />
        <SessionTypeTag type={event.sessionType} />
      </div>

      <Link
        href={`/events/${event.slug}`}
        className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <h3 className="font-display text-2xl leading-snug text-navy group-hover:text-gold-600">
          {event.title}
        </h3>
      </Link>
      <p className="mt-1.5 text-sm italic text-slate">{event.subtitle}</p>

      <dl className="mt-4 space-y-1.5 font-mono text-xs text-navy/80">
        <div className="flex gap-2">
          <dt className="sr-only">When</dt>
          <dd>
            <LocalTime iso={event.datetimeStart} />
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="sr-only">Duration</dt>
          <dd className="text-slate">{durationLabel(event.durationMin)}</dd>
        </div>
      </dl>

      <div className="mt-4 text-sm text-navy">
        <span className="text-slate">with </span>
        {event.speakerName}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <Scarcity event={event} />
        <RegisterButton event={event} sourceRef={sourceRef} />
      </div>
    </article>
  );
}
