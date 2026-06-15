# Embed `/events` on the existing landing pages (Cloudflare)

Goal: serve the Vercel-hosted events app at **`cashflow.ekantikcapital.com/events`**
(and `alpha…`, `epig500…`) **without changing your live landing pages**. Only the
`/events` path (plus its assets and form endpoints) is routed to the events app;
everything else still hits your current site.

## Why a Worker (not a CNAME)

A CNAME repoints the **whole subdomain** — that would replace your landing page.
We need a **path split**, which Cloudflare does with a small Worker
(`events-router.js`). It also forwards the real hostname to the app so each
surface resolves its own track (the app reads `x-ekantik-host`).

## Steps

1. **Deploy the Worker**
   - Cloudflare dashboard → **Workers & Pages → Create → Worker**.
   - Paste `events-router.js`, **Deploy**.
   - Settings → **Variables** → add `APP_ORIGIN = https://events-green-iota.vercel.app`
     (or edit the constant at the top of the file).

2. **Add routes** (Worker → **Settings → Domains & Routes → Add route**).
   For **each** subdomain, add these four route patterns:

   ```
   <subdomain>/events*
   <subdomain>/api/notify
   <subdomain>/api/register
   <subdomain>/_next/*
   ```

   i.e. 12 routes total across:
   - `cashflow.ekantikcapital.com`
   - `alpha.ekantikcapital.com`
   - `epig500.ekantikcapital.com`

   Each subdomain's DNS record stays pointed at your landing origin and must
   remain **Proxied (orange cloud)** for routes to take effect.

3. **Verify**
   - `https://cashflow.ekantikcapital.com/` → your landing page (unchanged).
   - `https://cashflow.ekantikcapital.com/events` → events app, **ECFS** surface.
   - `https://alpha.ekantikcapital.com/events` → **Alpha** surface.
   - `https://epig500.ekantikcapital.com/events` → **EPIG** surface (noindex).

## One thing to confirm

If any landing page is **itself a Next.js app** serving from `/_next` on the same
subdomain, the `/_next/*` route would collide. Tell us and we'll switch the app to
a namespaced `assetPrefix` so there's no overlap. For static/Wix/other stacks,
there's no conflict.

## Rollback

Delete the Worker routes (or the Worker). The subdomains immediately revert to
serving only the landing pages — nothing about your sites was modified.
