# Import catalog data from TMDB

This project uses a local sync command to fetch TMDB movie/TV metadata and write a static JSON snapshot. The website itself does not call TMDB on every visitor request.

## Setup

1. Apply for API access in your TMDB account and review TMDB's current API terms and attribution requirements for your use case (especially if monetized/commercial).
2. Copy `.env.example` to `.env.local` and set `TMDB_ACCESS_TOKEN` to your TMDB API Read Access Token. Keep it local/server-side; never add a `NEXT_PUBLIC_` prefix or commit the secret. `.env.local` is ignored by Git.
3. Use Node.js 20.9.0 or newer (Next.js 16 requirement). Node.js 22 is recommended; `.nvmrc` selects it for nvm users. Install dependencies and run:

   ```bash
   npm install
   npm run sync:tmdb
   ```

   The script reads `.env.local` itself and does not require the Node `--env-file` flag. Shell/CI environment variables take precedence over `.env.local`.
4. Review the updated `data/movies.json`, `data/series.json`, `data/genres.json`, and `data/cast.json`, then commit and push them. Vercel will redeploy the static snapshot.

By default, the script imports up to 20 popular movies and 20 popular TV series in `en-US`. Optional environment variables: `TMDB_IMPORT_LIMIT` (1–100 per category) and `TMDB_LANGUAGE` (for example `id-ID`). The script only replaces catalog files after TMDB responses have succeeded and usable titles were found; manually authored reviews and video embeds are preserved.

Imported entries are marked `published` in the generated snapshot. Review the data before pushing. TMDB vote averages are not age/content ratings. Add only external watch links you control or are authorized to use; TMDB does not provide rights to redistribute movies or episodes.

## Attribution

The site footer links to TMDB and displays: “This product uses the TMDB API but is not endorsed or certified by TMDB.” Follow TMDB's current official attribution instructions and include required official logo assets before public launch. Confirm commercial-use requirements with TMDB.
