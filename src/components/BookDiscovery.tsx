import type { TrackId } from "@/lib/tracks";

/**
 * "Book a discovery meeting" CTA — the path when a session time doesn't work.
 * Only rendered where the track carries a `discoveryUrl` (advisory + futures
 * lanes); the publisher lane never shows it. `href` is pre-built with
 * attribution by the caller (lib/discovery).
 */
export function BookDiscovery({
  href,
  track,
  tone = "card",
}: {
  href: string;
  track: TrackId;
  tone?: "card" | "muted";
}) {
  // Lane-appropriate copy — advisory leans private/relationship, futures leans
  // a straightforward conversation about the methodology.
  const label =
    track === "epig"
      ? "Book a private 30-minute conversation"
      : "Book a 30-minute discovery call";

  if (tone === "muted") {
    return (
      <p className="text-sm text-slate">
        Prefer to talk first, or this time doesn&apos;t work?{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gold-600 underline underline-offset-2 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {label} →
        </a>
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-navy/15 bg-white p-5">
      <p className="font-mono text-[11px] uppercase tracking-label text-slate">
        Time slot not working?
      </p>
      <p className="mt-2 text-sm text-navy/90">
        Skip the calendar and speak with Hiren Desai directly.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy transition hover:border-gold hover:text-gold-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {label}
      </a>
    </div>
  );
}
