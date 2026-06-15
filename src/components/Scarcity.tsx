import type { EkantikEvent } from "@/lib/types";
import { seatsRemaining } from "@/lib/events";

/**
 * Scarcity line (Feature #7) — must reflect a REAL cap, never invented.
 * Signal Red is reserved exclusively for genuine "closing soon" urgency (§9):
 * we only escalate to red when ≤10% of a real capacity remains.
 */
export function Scarcity({ event }: { event: EkantikEvent }) {
  if (event.status === "past") {
    return (
      <span className="font-mono text-xs uppercase tracking-label text-slate">
        {event.replayUrl ? "Replay available" : "Session ended"}
      </span>
    );
  }

  const seats = seatsRemaining(event);
  if (seats == null) {
    return (
      <span className="font-mono text-xs uppercase tracking-label text-slate">
        Open registration
      </span>
    );
  }

  const closingSoon =
    event.capacity != null && seats <= Math.ceil(event.capacity * 0.1);

  if (seats === 0) {
    return (
      <span className="font-mono text-xs uppercase tracking-label text-signal">
        Fully booked
      </span>
    );
  }

  return (
    <span
      className={
        "font-mono text-xs uppercase tracking-label " +
        (closingSoon ? "text-signal" : "text-slate")
      }
    >
      {seats} {seats === 1 ? "seat" : "seats"} remaining
    </span>
  );
}
