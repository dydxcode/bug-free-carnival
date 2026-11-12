# Bug Free Carnival

A dark, cinematic Movie & Series Discovery landing page built with Next.js 16, TypeScript, Tailwind CSS, and static JSON data.

## Important

The default data in this repository is demo-only and should be replaced with production-ready content before publishing live.

## Configurable “GRATIS MENONTON” links

Add these environment variables in the Vercel project settings. Values must be complete `https://` or `http://` URLs.

- `FREE_WATCH_MOVIE_URL`: destination for the button on movie detail pages.
- `FREE_WATCH_SERIES_URL`: destination for the button on series detail pages.
- `FREE_WATCH_URL`: optional shared destination used for either button when its type-specific variable is not set.

The type-specific values take precedence over `FREE_WATCH_URL`. Leave a variable empty to hide that button. Redeploy after changing environment variables so the new values are available to the server-rendered pages. These are server-only variables; do not prefix them with `NEXT_PUBLIC_`.
