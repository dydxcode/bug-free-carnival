# Import catalog data from TMDB

This project uses a local sync command to fetch TMDB movie/TV metadata and write a static JSON snapshot. The website itself does not call TMDB for every visitor request.

## Setup

1. Apply for API access in your TMDB account and review TMDB's current API terms and attribution requirements for your use case (especially if monetized/commercial).
2. Copy `.env.example` to `.env.local` and set `TMDB_API_KEY` to your TMDB v3 API key. You may instead use `TMDB_ACCESS_TOKEN` (API Read Access Token). Keep either secret server/local-side; never use a `NEXT_PUBLIC_` prefix or commit the secret.
3. Run `npm install`, then `npm run sync:tmdb` locally.
4. Review the updated `data/movies.json`, `data/series.json`, `data/genres.json`, and `data/cast.json`, then commit and push them. Vercel will redeploy the static snapshot.

By default, the script imports up to 20 popular movies and 20 popular TV series in `en-US`. Optional environment variables: `TMDB_IMPORT_LIMIT` (1–100 per category) and `TMDB_LANGUAGE` (for example `id-ID`). The script only replaces the generated catalog files; manually authored reviews and video embeds are preserved. If the API request fails or returns no usable titles, it exits without overwriting existing catalog data.

Imported entries are marked `published` so they appear in the existing catalog. Review the result before pushing. They include TMDB synopsis, release year, genres, poster paths, cast, and vote average. The vote average is not an age/content rating. Add only external watch links you control or are authorized to use; TMDB does not provide rights to redistribute movies or episodes.

## Attribution

The site footer links to TMDB and displays: “This product uses the TMDB API but is not endorsed or certified by TMDB.” Follow TMDB's current official attribution instructions and include required official logo assets before public launch. Confirm commercial use requirements with TMDB.
