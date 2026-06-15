"use client";

import { useState, type FormEvent } from "react";
import type { TrackId } from "@/lib/tracks";

/**
 * Always-on "Notify me of future sessions" opt-in (§3, Feature #8) — captures
 * top-of-funnel leads not ready for a specific date. Posts to /api/notify,
 * which is responsible for routing the lead to the TRACK'S HubSpot stream
 * (never cross-contaminating audiences, §5).
 */
export function NotifyMe({
  track,
  publisherConsent,
}: {
  track: TrackId;
  publisherConsent?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, track, consent }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="notify" className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-navy">
          Not ready for a date?
        </h2>
        <p className="mt-3 text-slate">
          Add your name and we&apos;ll tell you the moment the next session is
          scheduled — no spam, just the calendar.
        </p>

        {state === "done" ? (
          <p
            role="status"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-gold/10 px-5 py-3 font-mono text-sm uppercase tracking-label text-gold-600"
          >
            You&apos;re on the list — talk soon.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-navy/15 bg-ivory px-4 py-2.5 text-sm text-navy placeholder:text-slate focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </label>
              <button
                type="submit"
                disabled={state === "loading" || !consent}
                className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-ivory transition hover:bg-navy-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === "loading" ? "Adding…" : "Notify me"}
              </button>
            </div>

            <label className="flex items-start gap-2 text-left text-xs text-slate">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-navy/30 text-gold focus:ring-gold"
              />
              <span>
                {publisherConsent
                  ? "I understand these sessions are educational research, not personalized investment advice, and I'd like to receive Ekantik research communications."
                  : "I'd like to receive Ekantik communications and acknowledge the risk disclosure."}
              </span>
            </label>

            {state === "error" && (
              <p role="alert" className="text-xs text-signal">
                Something went wrong — please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
