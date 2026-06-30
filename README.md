# BDTV Live 📺

Watch **200+ Bangladeshi & popular live TV channels** online — free, HD, mobile friendly.
News, Entertainment, Sports, Movies, Music, Kids, Religious, Lifestyle and International — all
neatly categorized so you can find your channel in seconds.

Built with **Next.js (App Router)** + **hls.js**, deployed on **Vercel**.

## Features

- ⚡ **202 live channels**, each stream verified to return a valid live HLS manifest, with the
  lowest-latency (least buffering) source chosen when a channel had duplicates.
- 🗂️ **Categorized browsing** with sticky category nav + instant search.
- 🔌 **Built-in HLS/CORS proxy** (`/api/stream`) so streams that lack CORS headers (most BD IPTV
  CDNs) play in the browser, and insecure `http://` upstreams are served securely over `https`.
- 📱 **Mobile-first, light theme**, fully responsive.
- 🔎 **100% SEO**: per-channel metadata, canonical URLs, `sitemap.xml`, `robots.txt`, JSON-LD
  (WebSite, ItemList, BroadcastEvent, BreadcrumbList), Open Graph + dynamic OG image, PWA manifest.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## How streaming works

The player points hls.js at `/api/stream?url=<upstream m3u8>`. The proxy fetches the manifest,
rewrites every segment / sub-playlist / key URI back through itself, and adds permissive CORS
headers — making otherwise-unplayable public streams work inside any browser.

## Updating channels

Channel data lives in [`lib/channels.ts`](lib/channels.ts). Streams were tested on 2026-06-30.
Live IPTV endpoints change often; re-test periodically and prune dead links.

## Disclaimer

BDTV Live does **not** host, store or broadcast any content. It only links to publicly available
live streams. All rights belong to their respective broadcasters.
