"use client";

import { useEffect, useState } from "react";
import { formatLocal, formatUtc } from "@/lib/format";

/**
 * Timezone auto-detect + localized times (Feature #4, non-negotiable for
 * webinars). Renders the UTC fallback on the server / first paint, then swaps
 * to the viewer's local timezone after hydration — no layout shift, no
 * flash of wrong time being treated as authoritative.
 */
export function LocalTime({ iso, className }: { iso: string; className?: string }) {
  const [label, setLabel] = useState(() => formatUtc(iso));

  useEffect(() => {
    setLabel(formatLocal(iso));
  }, [iso]);

  return (
    <time dateTime={iso} className={className}>
      {label}
    </time>
  );
}
