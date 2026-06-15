import type { MetadataRoute } from "next";
import { resolveTrack } from "@/lib/resolveTrack";
import { getTrack } from "@/lib/tracks";

export const dynamic = "force-dynamic";

/**
 * Track-aware robots policy. The gated EPIG surface disallows all crawling at
 * the robots level — belt-and-suspenders alongside the per-page noindex (§6).
 * Public tracks allow indexing so Google can surface sessions (Feature #14).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const track = getTrack(await resolveTrack());
  if (!track.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
