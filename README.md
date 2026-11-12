# Bug Free Carnival

A dark, cinematic Movie & Series Discovery landing page built with Next.js 16, TypeScript, Tailwind CSS, and static JSON data.

## Important

The default data in this repository is demo-only and should be replaced with production-ready content before publishing live.

## Configurable “GRATIS MENONTON” links

Add these environment variables in the Vercel project settings. Values must be complete `https://` or `http://` URLs.

- `FREE_WATCH_MOVIE_URL`: global fallback URL for movie detail pages.
- `FREE_WATCH_SERIES_URL`: global fallback URL for series detail pages.
- `FREE_WATCH_URL`: shared fallback for both types when the type-specific value is not set.
- `FREE_WATCH_MOVIE_URLS`: optional JSON map for per-title overrides, e.g. `{"avatar-2009-19995":"https://example.com/watch/avatar"}`.
- `FREE_WATCH_SERIES_URLS`: optional JSON map for per-title overrides, e.g. `{"breaking-bad-2008-tmdb-1396":"https://example.com/watch/breaking-bad"}`.

Priority is:
1. Per-title override map for that specific slug
2. Type-specific global fallback (`FREE_WATCH_MOVIE_URL` or `FREE_WATCH_SERIES_URL`)
3. Shared fallback (`FREE_WATCH_URL`)

If a value is empty, the button is hidden. Redeploy after changing environment variables so the server-rendered pages pick up the new values.
