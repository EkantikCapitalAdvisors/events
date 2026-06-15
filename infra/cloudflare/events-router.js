/**
 * Ekantik Events — Cloudflare edge router.
 *
 * Embeds the Vercel-hosted events app at `/events` on each EXISTING landing
 * page WITHOUT touching the rest of the site. Your landing pages keep serving
 * normally; only the paths below are proxied to the events app.
 *
 * It forwards the real hostname in `x-ekantik-host` so the app resolves the
 * correct track per surface (cashflow → ECFS, alpha → Alpha, epig500 → EPIG).
 *
 * ── Deploy (Cloudflare dashboard) ─────────────────────────────────────────
 * 1. Workers & Pages → Create → Worker → paste this file → Deploy.
 * 2. Set the APP_ORIGIN variable below to your Vercel URL (or a Worker var
 *    named APP_ORIGIN under Settings → Variables).
 * 3. Add these Routes (Worker → Settings → Domains & Routes → Add route),
 *    for EACH of the three subdomains:
 *       cashflow.ekantikcapital.com/events*
 *       cashflow.ekantikcapital.com/api/notify
 *       cashflow.ekantikcapital.com/api/register
 *       cashflow.ekantikcapital.com/_next/*
 *    …repeat for alpha.ekantikcapital.com and epig500.ekantikcapital.com.
 *    (The subdomains' DNS records stay pointed at your landing origin and
 *    must remain PROXIED / orange-cloud for routes to apply.)
 *
 * Nothing outside these paths reaches this Worker, so the landing pages are
 * untouched. One caveat: if a landing page is ITSELF a Next.js app serving
 * from /_next on the same subdomain, tell us — we'll namespace the events
 * assets instead.
 */

const APP_ORIGIN = "https://events-green-iota.vercel.app";

export default {
  async fetch(request, env) {
    const origin = (env && env.APP_ORIGIN) || APP_ORIGIN;
    const url = new URL(request.url);

    // Proxy to the events app, carrying the real host for track resolution.
    const target = origin + url.pathname + url.search;
    const headers = new Headers(request.headers);
    headers.set("x-ekantik-host", url.hostname);
    // Strip hop-by-hop / origin-rewriting headers that confuse the upstream.
    headers.delete("host");

    const proxied = new Request(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      redirect: "manual",
    });

    return fetch(proxied);
  },
};
