import type { EkantikEvent } from "@/lib/types";
import { seatsRemaining } from "@/lib/events";

/**
 * Phase 1 = link-out (§4). `Register` sends the visitor to that event's Zoom
 * source-tracking link; Zoom captures and syncs to HubSpot. The `?ref=` is
 * appended so attribution survives the hop.
 *
 * Phase 2 swaps this href for the native form route (/events/[slug]/register)
 * — button verb stays `Register` for flow consistency (§9).
 */
export function RegisterButton({
  event,
  sourceRef,
  variant = "card",
}: {
  event: EkantikEvent;
  sourceRef?: string;
  variant?: "card" | "hero";
}) {
  const seats = seatsRemaining(event);
  const soldOut = seats === 0;

  if (event.status === "past") {
    if (!event.replayUrl) return null;
    return (
      <a
        href={event.replayUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btn(variant, "outline")}
      >
        Watch replay
      </a>
    );
  }

  const href = withRef(event.zoomRegistrationUrl, sourceRef);

  if (soldOut || !href) {
    return (
      <span className={btn(variant, "disabled")} aria-disabled="true">
        {soldOut ? "Waitlist" : "Registration opening"}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={btn(variant, "solid")}>
      Register
    </a>
  );
}

function withRef(url: string | undefined, ref: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!ref) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("ref", ref);
    return u.toString();
  } catch {
    return url;
  }
}

function btn(variant: "card" | "hero", kind: "solid" | "outline" | "disabled"): string {
  const base =
    "inline-flex items-center justify-center rounded-md font-body text-sm font-medium tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
  const size = variant === "hero" ? "px-7 py-3 text-base" : "px-5 py-2.5";
  const skin =
    kind === "solid"
      ? "bg-gold text-navy hover:bg-gold-600"
      : kind === "outline"
        ? "border border-navy/20 text-navy hover:border-gold hover:text-gold-600"
        : "cursor-not-allowed bg-navy/10 text-slate";
  return `${base} ${size} ${skin}`;
}
