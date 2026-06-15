import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-ivory px-6">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-label text-gold-600">
          Not found
        </p>
        <h1 className="mt-3 font-display text-4xl text-navy">
          That session isn&apos;t here.
        </h1>
        <p className="mt-3 text-slate">
          It may have ended, moved, or never been on this surface.
        </p>
        <Link
          href="/events"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-navy px-6 py-2.5 text-sm font-medium text-ivory transition hover:bg-navy-500"
        >
          Browse all sessions
        </Link>
      </div>
    </main>
  );
}
