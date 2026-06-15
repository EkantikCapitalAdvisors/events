import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveTrack } from "@/lib/resolveTrack";
import { getTrack } from "@/lib/tracks";
import { eventForSlug } from "@/lib/events";
import { durationLabel } from "@/lib/format";
import { complianceFor } from "@/lib/compliance";
import { LocalTime } from "@/components/LocalTime";
import { CategoryTag, SessionTypeTag } from "@/components/CategoryTag";
import { Scarcity } from "@/components/Scarcity";
import { RegisterButton } from "@/components/RegisterButton";
import { RegistrationForm } from "@/components/RegistrationForm";
import { ComplianceFooter } from "@/components/ComplianceFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trackId = await resolveTrack();
  const track = getTrack(trackId);
  const event = eventForSlug(trackId, slug);
  if (!event) return { title: "Session not found · Ekantik" };
  return {
    title: `${event.title} · Ekantik`,
    description: event.subtitle,
    robots: track.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

/** Minimal inline emphasis renderer for the `_italic_` markdown in copy. */
function renderEmphasis(text: string) {
  return text.split(/(_[^_]+_)/g).map((chunk, i) =>
    chunk.startsWith("_") && chunk.endsWith("_") ? (
      <em key={i} className="text-slate">
        {chunk.slice(1, -1)}
      </em>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  );
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { slug } = await params;
  const { ref: sourceRef } = await searchParams;
  const trackId = await resolveTrack();
  const track = getTrack(trackId);
  // Scoped lookup: a gated session is simply not found on a public surface.
  const event = eventForSlug(trackId, slug);
  if (!event) notFound();
  const short = complianceFor(event.complianceProfile).short;

  return (
    <main>
      <div className="bg-navy text-ivory">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/events"
            className="font-mono text-xs uppercase tracking-label text-gold hover:text-gold-600"
          >
            ← All sessions
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <CategoryTag category={event.category} />
            <SessionTypeTag type={event.sessionType} />
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-3 text-lg italic text-ivory/80">{event.subtitle}</p>
          <p className="mt-6 font-mono text-sm text-ivory/70">
            <LocalTime iso={event.datetimeStart} /> ·{" "}
            {durationLabel(event.durationMin)}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-12 px-6 py-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-base leading-relaxed text-navy/90">
            {renderEmphasis(event.description)}
          </p>

          <h2 className="mt-10 font-display text-2xl text-navy">
            What you&apos;ll learn
          </h2>
          <ul className="mt-4 space-y-2">
            {event.whatYoullLearn.map((point) => (
              <li key={point} className="flex gap-3 text-navy/90">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl text-navy">Speaker</h2>
          <div className="mt-4">
            <p className="font-medium text-navy">{event.speakerName}</p>
            <p className="font-mono text-xs uppercase tracking-label text-slate">
              {event.speakerTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              {event.speakerBio}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-navy/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <Scarcity event={event} />
              {event.requiresAccreditation && (
                <span className="font-mono text-[11px] uppercase tracking-label text-gold-600">
                  Accredited only
                </span>
              )}
            </div>

            <div className="mt-5">
              {event.status === "past" ? (
                <RegisterButton event={event} sourceRef={sourceRef} variant="hero" />
              ) : (
                // Phase 2 native form (degrades to Zoom link-out until creds).
                <RegistrationForm event={event} sourceRef={sourceRef} />
              )}
            </div>

            <p className="mt-6 border-t border-navy/10 pt-6 text-xs leading-relaxed text-slate">
              {short}
            </p>
          </div>
        </aside>
      </div>

      <ComplianceFooter profile={track.complianceProfile} />
    </main>
  );
}
