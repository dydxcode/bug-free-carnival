# Bug Free Carnival

A responsive movie and series discovery site built with Next.js, TypeScript, Tailwind CSS, and TMDB.

## TMDB setup

Set `TMDB_ACCESS_TOKEN` in Vercel (server-only). Optionally set `TMDB_LANGUAGE` (default `en-US`). Redeploy after editing environment variables.

## “GRATIS MENONTON” destinations

Configure `FREE_WATCH_MOVIE_URL`, `FREE_WATCH_SERIES_URL`, and/or shared `FREE_WATCH_URL` as full HTTP(S) URLs. Per-title maps are also supported:

- `FREE_WATCH_MOVIE_URLS`: JSON object keyed by movie slug.
- `FREE_WATCH_SERIES_URLS`: JSON object keyed by series slug.

Precedence is per-title, type-specific global, then shared. The buttons are hidden when there is no valid configured URL.

## Discovery and personal features

The home page uses TMDB top-rated, weekly trending, now-playing, and on-the-air feeds for Top Picks, Trending Now, and Recently Added shelves. These feeds use Next.js revalidation and show a useful fallback if TMDB is unavailable.

Watchlist, recently opened watch links, and the light/dark preference are saved locally in the visitor's browser; no login or extra environment variables are required. The watchlist is per browser/device and is not synchronized across devices.
