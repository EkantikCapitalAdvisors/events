/**
 * Empty state (§3) — "an empty screen is an invitation to act, not dead space."
 * Pushes to the always-on notify-me capture and the on-demand library.
 */
export function EmptyState({
  tab,
  hasQuery,
}: {
  tab: "upcoming" | "past";
  hasQuery: boolean;
}) {
  if (hasQuery) {
    return (
      <div className="rounded-lg border border-dashed border-navy/20 bg-white/50 px-6 py-16 text-center">
        <p className="font-display text-2xl text-navy">No sessions match that.</p>
        <p className="mt-2 text-sm text-slate">
          Try a broader term, or clear the search to see everything.
        </p>
      </div>
    );
  }

  if (tab === "past") {
    return (
      <div className="rounded-lg border border-dashed border-navy/20 bg-white/50 px-6 py-16 text-center">
        <p className="font-display text-2xl text-navy">
          The replay library is filling in.
        </p>
        <p className="mt-2 text-sm text-slate">
          Past sessions land here on demand. Add your name below to be told when
          the next one is recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-gold/40 bg-gold/5 px-6 py-16 text-center">
      <p className="font-display text-2xl text-navy">
        No date on the calendar right now.
      </p>
      <p className="mt-2 text-sm text-slate">
        The next session is being scheduled. Add your name below and you&apos;ll
        be the first to know — or browse the on-demand sessions.
      </p>
      <a
        href="#notify"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-6 py-2.5 text-sm font-medium text-navy transition hover:bg-gold-600"
      >
        Notify me of future sessions
      </a>
    </div>
  );
}
