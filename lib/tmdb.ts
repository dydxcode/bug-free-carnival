const token = process.env.TMDB_ACCESS_TOKEN;
const defaultLanguage = process.env.TMDB_LANGUAGE ?? 'en-US';

export type TmdbCatalogItem = {
  id: number;
  type: 'movie' | 'series';
  title: string;
  slug: string;
  overview: string;
  posterUrl: string;
  releaseYear: number;
  rating: string;
  genres: string[];
  seasons?: number;
  runtimeLabel?: string;
  duration?: string;
};

type TmdbResult = {
  id: number;
  media_type?: 'movie' | 'tv';
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  number_of_seasons?: number;
  runtime?: number;
};

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function yearOf(date?: string) {
  const parsed = Number.parseInt((date ?? '').slice(0, 4), 10);
  return Number.isInteger(parsed) && parsed >= 1900 ? parsed : undefined;
}

function imageUrl(path?: string | null, size = 'w500') {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://placehold.co/800x1200/191D27/F5F6FA?text=No+Image';
}

function formatRuntime(runtime?: number) {
  if (!runtime) return 'Runtime unavailable';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`;
}

function buildSlug(title: string, year?: number) {
  const base = slugify(title) || `title-${Date.now()}`;
  return year ? `${base}-${year}` : base;
}

function mapGenres(items?: Array<{ id: number; name: string }> | number[]) {
  if (!items || typeof items[0] !== 'object') return [];
  return (items as Array<{ id: number; name: string }>)
    .map((genre) => slugify(genre.name))
    .filter(Boolean)
    .slice(0, 4);
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number | boolean> = {}) {
  if (!token) {
    throw new Error('TMDB_ACCESS_TOKEN is not configured.');
  }

  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));

  const response = await fetch(url, {
    headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}) for ${path}`);
  }
  return (await response.json()) as T;
}

function mapMovie(item: TmdbResult): TmdbCatalogItem | null {
  const title = item.title ?? 'Untitled movie';
  const year = yearOf(item.release_date);
  const overview = (item.overview ?? '').trim();
  if (!year || overview.length < 10) return null;

  const runtimeLabel = formatRuntime(item.runtime);
  return {
    id: item.id,
    type: 'movie',
    title,
    slug: buildSlug(title, year),
    overview,
    posterUrl: imageUrl(item.poster_path),
    releaseYear: year,
    rating: item.vote_average ? `TMDB ${item.vote_average.toFixed(1)}/10` : 'Not rated',
    genres: mapGenres(item.genres ?? item.genre_ids),
    runtimeLabel,
    duration: runtimeLabel,
  };
}

function mapSeries(item: TmdbResult): TmdbCatalogItem | null {
  const title = item.name ?? 'Untitled series';
  const year = yearOf(item.first_air_date);
  const overview = (item.overview ?? '').trim();
  if (!year || overview.length < 10) return null;

  return {
    id: item.id,
    type: 'series',
    title,
    slug: buildSlug(title, year),
    overview,
    posterUrl: imageUrl(item.poster_path),
    releaseYear: year,
    rating: item.vote_average ? `TMDB ${item.vote_average.toFixed(1)}/10` : 'Not rated',
    genres: mapGenres(item.genres ?? item.genre_ids),
    seasons: item.number_of_seasons ?? 1,
  };
}

export function hasTmdbToken() {
  return Boolean(token);
}

export async function getTmdbTrending(limit = 8) {
  if (!token) return { movies: [], series: [] };

  const [movieResponse, seriesResponse] = await Promise.all([
    tmdbFetch<{ results?: TmdbResult[] }>('/movie/now_playing', { language: defaultLanguage, page: 1 }),
    tmdbFetch<{ results?: TmdbResult[] }>('/tv/on_the_air', { language: defaultLanguage, page: 1 }),
  ]);

  const movies = (movieResponse.results ?? []).slice(0, limit).map(mapMovie).filter(Boolean) as TmdbCatalogItem[];
  const series = (seriesResponse.results ?? []).slice(0, limit).map(mapSeries).filter(Boolean) as TmdbCatalogItem[];
  return { movies, series };
}

export async function searchTmdb(query: string, limit = 12) {
  if (!token || !query.trim()) return [] as TmdbCatalogItem[];

  const response = await tmdbFetch<{ results?: TmdbResult[] }>('/search/multi', {
    query: query.trim(),
    include_adult: false,
    language: defaultLanguage,
    page: 1,
  });

  return (response.results ?? [])
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, limit)
    .map((item) => item.media_type === 'movie' ? mapMovie(item) : mapSeries(item))
    .filter(Boolean) as TmdbCatalogItem[];
}

export async function getTmdbMovieById(id: string) {
  if (!/^\d+$/.test(id)) return null;
  const movie = await tmdbFetch<TmdbResult>(`/movie/${id}`, { language: defaultLanguage });
  return mapMovie(movie);
}

export async function getTmdbSeriesById(id: string) {
  if (!/^\d+$/.test(id)) return null;
  const series = await tmdbFetch<TmdbResult>(`/tv/${id}`, { language: defaultLanguage });
  return mapSeries(series);
}
