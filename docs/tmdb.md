# Import real movie and TV metadata from TMDB

This repository keeps the website's catalog as static JSON. The sync script fetches metadata from TMDB and writes reviewed-candidate snapshots to `data/*.json`; the running site does not call TMDB on each page request.

## One-time setup

1. Create a TMDB account and request API access through the official developer settings.
2. Review TMDB's current API terms and attribution requirements for your intended use (especially if the site is commercial/monetized).
3. Set the API Read Access Token locally as `TMDB_ACCESS_TOKEN`. Do not commit it or put it in `NEXT_PUBLIC_*` variables.
4. Install project dependencies, then run `npm run sync:tmdb`.

The script imports up to 20 popular movies and 20 popular TV series by default. Change the count with `TMDB_IMPORT_LIMIT` (maximum 100 per category) and the language with `TMDB_LANGUAGE` (default `en-US`). It updates movies, series, genres, cast, reviews, and video embeds JSON files. Review generated diffs before committing.

All imported titles start as `draft` and are excluded from public catalog pages. Verify the metadata, image usage, and intended destination, then change only approved entries to `published`. TMDB does not provide legal full-video watch destinations; add only links you control or are authorized to use. Preview embeds stay empty unless you add an authorized official embed yourself.

TMDB provides metadata and image paths, not rights to redistribute movies or TV episodes. Do not treat imported entries, ratings, or images as proof of distribution rights.

## Attribution

The site footer displays the TMDB attribution statement and link. Follow the current official TMDB attribution instructions and include the official logo/required attribution assets before public launch.
