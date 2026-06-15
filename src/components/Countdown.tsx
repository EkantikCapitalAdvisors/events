"use client";

import { useEffect, useState } from "react";

/**
 * Truthful urgency countdown (Feature #6) for the hero "next session" lockup.
 * Counts down to the session start; respects reduced-motion by simply not
 * animating (it's a 1s tick of text, no transitions). Renders nothing until
 * mounted to avoid an SSR/client mismatch on the live delta.
 */
function diff(toIso: string) {
  const ms = Date.parse(toIso) - Date.now();
  const clamped = Math.max(0, ms);
  return {
    done: ms <= 0,
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1000),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ toIso }: { toIso: string }) {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(toIso));
    const id = setInterval(() => setT(diff(toIso)), 1000);
    return () => clearInterval(id);
  }, [toIso]);

  if (!t) {
    return <div className="h-12" aria-hidden />;
  }

  if (t.done) {
    return (
      <span className="font-mono text-sm uppercase tracking-label text-gold">
        Starting now
      </span>
    );
  }

  const units: [string, number][] = [
    ["days", t.days],
    ["hrs", t.hours],
    ["min", t.minutes],
    ["sec", t.seconds],
  ];

  return (
    <div className="flex items-end gap-4 font-mono" role="timer" aria-live="off">
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl font-medium tabular-nums text-white sm:text-4xl">
            {pad(value)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-label text-gold/80">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
