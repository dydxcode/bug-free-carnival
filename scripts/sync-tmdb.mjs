#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiKey = process.env.TMDB_API_KEY;
const accessToken = process.env.TMDB_ACCESS_TOKEN;
const limit = Math.min(Math.max(Number.parseInt(process.env.TMDB_IMPORT_LIMIT ?? '20', 10) || 20, 1), 100);
const language = process.env.TMDB_LANGUAGE || 'en-US';

if (!apiKey && !accessToken) {
  console.error('Set TMDB_API_KEY or TMDB_ACCESS_TOKEN in your local environment. Never commit the secret or expose it in a NEXT_PUBLIC_ variable.');
  process.exit(1);
}

async function tmdb(endpoint) {
  const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
  const headers = { accept: 'application/json' };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  else url.searchParams.set('api_key', apiKey);

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`TMDB request failed (${response.status}) for ${url.pathname}: ${detail.slice(0, 300)}`);
  }
  return response.json();
}

function slugify(value) {
  return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function imageUrl(imagePath, size = 'w500') {
  return imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : undefined;
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

const genreById = new Map();
for (const genre of [...(movieGenreResponse.genres ?? []), ...(tvGenreResponse.genres ?? [])]) {
  const slug = slugify(genre.name);
  if (slug) genreById.set(genre.id, { id: `tmdb-genre-${genre.id}`, name: genre.name, slug, description: `Explore ${genre.name} movies and series.` });
}

const castById = new Map();
function mapCast(credits) {
  return (credits?.cast ?? []).slice(0, 8).map((person) => {
    const slug = `person-${person.id}`;
    if (!castById.has(slug)) {
      castById.set(slug, {
        id: `tmdb-person-${person.id}`,
        name: person.name,
        slug,
        role: person.character || 'Cast member',
        photoUrl: imageUrl(person.profile_path, 'w300') ?? 'https://placehold.co/300x300/191D27/F5F6FA?text=Cast',
      });
    }
    return slug;
  });
}

const movieCandidates = (popularMovies.results ?? []).slice(0, limit);
const seriesCandidates = (popularSeries.results ?? []).slice(0, limit);

const movies = (await mapWithLimit(movieCandidates, 4, async (item) => {
  const details = await tmdb(`/movie/${item.id}?language=${encodeURIComponent(language)}&append_to_response=credits`);
  const releaseYear = yearOf(details.release_date);
  const poster = imageUrl(details.poster_path);
  const synopsis = (details.overview || '').trim();
  if (!releaseYear || !poster || synopsis.length < 20) return null;

  const title = details.title || item.title;
  return {
    id: `tmdb-movie-${item.id}`,
    tmdbId: item.id,
    title,
    slug: `${slugify(title) || `movie-${item.id}`}-${releaseYear}`,
    synopsis,
    posterUrl: poster,
    releaseYear,
    duration: details.runtime ? `${Math.floor(details.runtime / 60)}h ${String(details.runtime % 60).padStart(2, '0')}m` : 'Runtime unavailable',
    rating: details.vote_average ? `TMDB ${details.vote_average.toFixed(1)}/10` : 'Not rated',
    genres: (details.genres ?? []).map((genre) => genreById.get(genre.id)?.slug).filter(Boolean),
    cast: mapCast(details.credits),
    seoTitle: `${title} (${releaseYear}) — movie details`,
    seoDescription: synopsis.slice(0, 155),
    status: 'published',
    featured: false,
  };
})).then((items) => items.filter(Boolean));

const series = (await mapWithLimit(seriesCandidates, 4, async (item) => {
  const details = await tmdb(`/tv/${item.id}?language=${encodeURIComponent(language)}&append_to_response=credits`);
  const releaseYear = yearOf(details.first_air_date);
  const poster = imageUrl(details.poster_path);
  const synopsis = (details.overview || '').trim();
  if (!releaseYear || !poster || synopsis.length < 20) return null;

  const title = details.name || item.name;
  return {
    id: `tmdb-series-${item.id}`,
    tmdbId: item.id,
    title,
    slug: `${slugify(title) || `series-${item.id}`}-${releaseYear}`,
    synopsis,
    posterUrl: poster,
    releaseYear,
    genres: (details.genres ?? []).map((genre) => genreById.get(genre.id)?.slug).filter(Boolean),
    cast: mapCast(details.credits),
    seasons: Math.max(1, details.number_of_seasons ?? 1),
    seoTitle: `${title} (${releaseYear}) — series details`,
    seoDescription: synopsis.slice(0, 155),
    status: 'published',
    rating: details.vote_average ? `TMDB ${details.vote_average.toFixed(1)}/10` : 'Not rated',
    featured: false,
  };
})).then((items) => items.filter(Boolean));

if (movies.length === 0 && series.length === 0) {
  throw new Error(`TMDB returned no usable titles for language ${language}; existing catalog files were left unchanged.`);
}

async function readJson(relativePath) {
  try { return JSON.parse(await readFile(path.join(root, relativePath), 'utf8')); }
  catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

const previousGenres = await readJson('data/genres.json');
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
]);
console.log(`Imported ${movies.length} movies and ${series.length} series (${language}); TMDB records are published in the generated snapshot.`);
console.log('Review the generated JSON and verify current TMDB terms/attribution before deploying.');
