import type { Metadata } from "next";
import { resolveTrack } from "@/lib/resolveTrack";
import { getTrack } from "@/lib/tracks";
import { eventsForTrack, nextSession } from "@/lib/events";
import { Hero } from "@/components/Hero";
import { EventsBrowser } from "@/components/EventsBrowser";
import { NotifyMe } from "@/components/NotifyMe";
import { ComplianceFooter } from "@/components/ComplianceFooter";
import { EventSchema } from "@/components/EventSchema";

export const dynamic = "force-dynamic"; // track resolves per-request (host header)

/**
 * Robots posture is driven by the track (§6): gated EPIG is `noindex`, public
 * tracks are indexable. This is the metadata side of "never list EPIG on an
 * indexed surface."
 */
export async function generateMetadata(): Promise<Metadata> {
  const track = getTrack(await resolveTrack());
  return {
    title: `Events · ${track.label} · Ekantik Capital Advisors`,
    robots: track.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref: sourceRef } = await searchParams;
  const trackId = await resolveTrack();
  const track = getTrack(trackId);
  const events = eventsForTrack(trackId);
  const next = nextSession(events);

  return (
    <main>
      {/* Structured data only on public, indexable surfaces. */}
      {track.indexable && <EventSchema events={events} />}

      <Hero track={track} next={next} sourceRef={sourceRef} />

      <EventsBrowser events={events} sourceRef={sourceRef} />

      <NotifyMe
        track={trackId}
        publisherConsent={track.complianceProfile === "publisher"}
      />

      <ComplianceFooter profile={track.complianceProfile} />
    </main>
  );
}
