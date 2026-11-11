#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const token = process.env.TMDB_ACCESS_TOKEN;
const limit = Math.min(Math.max(Number.parseInt(process.env.TMDB_IMPORT_LIMIT ?? '20', 10) || 20, 1), 100);
const language = process.env.TMDB_LANGUAGE || 'en-US';

if (!token) {
  console.error('Missing TMDB_ACCESS_TOKEN. Add your TMDB API Read Access Token to the local environment or Vercel, then run this script locally. Never commit the token.');
  process.exit(1);
}

async function tmdb(endpoint) {
  const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`TMDB request failed (${response.status}) for ${endpoint}`);
  return response.json();
}

function slugify(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function posterUrl(posterPath) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : undefined;
}

function yearOf(date) {
  const year = Number.parseInt((date || '').slice(0, 4), 10);
  return Number.isInteger(year) && year >= 1900 ? year : undefined;
}

async function mapWithLimit(items, concurrency, fn) {
  const result = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      result[index] = await fn(items[index]);
    }
  }));
  return result;
}

const [movieGenreResponse, tvGenreResponse, popularMovies, popularSeries] = await Promise.all([
  tmdb(`/genre/movie/list?language=${encodeURIComponent(language)}`),
  tmdb(`/genre/tv/list?language=${encodeURIComponent(language)}`),
  tmdb(`/movie/popular?language=${encodeURIComponent(language)}&page=1`),
  tmdb(`/tv/popular?language=${encodeURIComponent(language)}&page=1`),
]);

const tmdbGenres = [...(movieGenreResponse.genres ?? []), ...(tvGenreResponse.genres ?? [])];
const genreById = new Map();
for (const genre of tmdbGenres) {
  const slug = slugify(genre.name);
  if (slug) genreById.set(genre.id, { id: `tmdb-genre-${genre.id}`, name: genre.name, slug, description: `Explore ${genre.name} movies and series.` });
}

const castById = new Map();
const movieCandidates = (popularMovies.results ?? []).slice(0, limit);
const seriesCandidates = (popularSeries.results ?? []).slice(0, limit);

const movies = (await mapWithLimit(movieCandidates, 4, async (item) => {
  const details = await tmdb(`/movie/${item.id}?language=${encodeURIComponent(language)}&append_to_response=credits`);
  const releaseYear = yearOf(details.release_date);
  const image = posterUrl(details.poster_path);
  const synopsis = (details.overview || '').trim();
  if (!releaseYear || !image || synopsis.length < 20) return null;

  const cast = (details.credits?.cast ?? []).slice(0, 8).map((person) => {
    const id = `tmdb-person-${person.id}`;
    if (!castById.has(id)) castById.set(id, {
      id,
      name: person.name,
      slug: `person-${person.id}`,
      role: 'Cast member',
      photoUrl: posterUrl(person.profile_path) ?? 'https://placehold.co/300x300/191D27/F5F6FA?text=Cast',
    });
    return `person-${person.id}`;
  });

  const baseSlug = slugify(details.title || item.title) || `movie-${item.id}`;
  return {
    id: `tmdb-movie-${item.id}`,
    tmdbId: item.id,
    title: details.title || item.title,
    slug: `${baseSlug}-${releaseYear}`,
    synopsis,
    posterUrl: image,
    releaseYear,
    duration: details.runtime ? `${Math.floor(details.runtime / 60)}h ${String(details.runtime % 60).padStart(2, '0')}m` : 'Runtime unavailable',
    rating: details.vote_average ? `${details.vote_average.toFixed(1)}/10 (TMDB)` : 'Not rated',
    genres: (details.genres ?? []).map((genre) => genreById.get(genre.id)?.slug).filter(Boolean),
    cast,
    seoTitle: `${details.title || item.title} (${releaseYear}) — movie details`,
    seoDescription: synopsis.slice(0, 155),
    status: 'draft',
    featured: false,
  };
})).filter(Boolean);

const series = (await mapWithLimit(seriesCandidates, 4, async (item) => {
  const details = await tmdb(`/tv/${item.id}?language=${encodeURIComponent(language)}&append_to_response=credits`);
  const releaseYear = yearOf(details.first_air_date);
  const image = posterUrl(details.poster_path);
  const synopsis = (details.overview || '').trim();
  if (!releaseYear || !image || synopsis.length < 20) return null;

  const cast = (details.credits?.cast ?? []).slice(0, 8).map((person) => {
    const id = `tmdb-person-${person.id}`;
    if (!castById.has(id)) castById.set(id, {
      id,
      name: person.name,
      slug: `person-${person.id}`,
      role: 'Cast member',
      photoUrl: posterUrl(person.profile_path) ?? 'https://placehold.co/300x300/191D27/F5F6FA?text=Cast',
    });
    return `person-${person.id}`;
  });

  const baseSlug = slugify(details.name || item.name) || `series-${item.id}`;
  return {
    id: `tmdb-series-${item.id}`,
    tmdbId: item.id,
    title: details.name || item.name,
    slug: `${baseSlug}-${releaseYear}`,
    synopsis,
    posterUrl: image,
    releaseYear,
    genres: (details.genres ?? []).map((genre) => genreById.get(genre.id)?.slug).filter(Boolean),
    cast,
    seasons: details.number_of_seasons ?? 0,
    seoTitle: `${details.name || item.name} (${releaseYear}) — series details`,
    seoDescription: synopsis.slice(0, 155),
    status: 'draft',
    rating: details.vote_average ? `${details.vote_average.toFixed(1)}/10 (TMDB)` : 'Not rated',
    featured: false,
  };
})).filter(Boolean);

const previousGenres = JSON.parse(await readFile(path.join(root, 'data/genres.json'), 'utf8'));
const descriptions = new Map(previousGenres.map((genre) => [genre.slug, genre.description]));
const genres = [...genreById.values()].map((genre) => ({
  ...genre,
  description: descriptions.get(genre.slug) ?? genre.description,
}));

async function save(relativePath, data) {
  await writeFile(path.join(root, relativePath), `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Wrote ${data.length} records to ${relativePath}`);
}

await Promise.all([
  save('data/movies.json', movies),
  save('data/series.json', series),
  save('data/genres.json', genres),
  save('data/cast.json', [...castById.values()]),
  save('data/reviews.json', []),
  save('data/video-embeds.json', []),
]);
console.log('Imported TMDB content is marked draft. Verify it and explicitly change status to published before making it public.');
