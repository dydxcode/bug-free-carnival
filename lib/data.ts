import { z } from 'zod';
import rawMovies from '@/data/movies.json';
import rawSeries from '@/data/series.json';
import rawGenres from '@/data/genres.json';
import rawCast from '@/data/cast.json';
import rawReviews from '@/data/reviews.json';
import rawEmbeds from '@/data/video-embeds.json';
import rawSettings from '@/data/settings.json';
import { MovieSchema, SeriesSchema, GenreSchema, CastSchema, ReviewSchema, VideoEmbedSchema, SettingsSchema } from '@/lib/schemas';

const parseData = <T>(value: unknown, schema: z.ZodType<T>, fileName: string): T => {
  const result = schema.safeParse(value);
  if (!result.success) {
    const msg = result.error.issues.map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`).join('; ');
    throw new Error(`Invalid data in ${fileName}: ${msg}`);
  }
  return result.data;
};

const genres = parseData(rawGenres, z.array(GenreSchema), 'data/genres.json');
const castMembers = parseData(rawCast, z.array(CastSchema), 'data/cast.json');
const allMovies = parseData(rawMovies, z.array(MovieSchema), 'data/movies.json');
const allSeries = parseData(rawSeries, z.array(SeriesSchema), 'data/series.json');
const allReviews = parseData(rawReviews, z.array(ReviewSchema), 'data/reviews.json');
const videoEmbeds = parseData(rawEmbeds, z.array(VideoEmbedSchema), 'data/video-embeds.json');
const settings = parseData(rawSettings, SettingsSchema, 'data/settings.json');

// Draft and archived catalog items are deliberately excluded from public pages.
const movies = allMovies.filter((movie) => movie.status === 'published');
const series = allSeries.filter((item) => item.status === 'published');
const reviews = allReviews.filter((review) => movies.some((movie) => movie.id === review.targetId) || series.some((item) => item.id === review.targetId));

export function getAllGenres() { return genres; }
export function getAllMovies() { return movies; }
export function getMovieBySlug(slug: string) { return movies.find((movie) => movie.slug === slug); }
export function getFeaturedMovies() { return movies.filter((movie) => movie.featured).slice(0, 4); }
export function getPopularMovies() { return [...movies].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 4); }
export function getMoviesByGenre(genreSlug: string) { return movies.filter((movie) => movie.genres.includes(genreSlug)); }
export function getAllSeries() { return series; }
export function getSeriesBySlug(slug: string) { return series.find((item) => item.slug === slug); }
export function getSeriesByGenre(genreSlug: string) { return series.filter((item) => item.genres.includes(genreSlug)); }

export function getRelatedMovies(slug: string, limit = 3) {
  const source = movies.find((movie) => movie.slug === slug);
  if (!source) return [];
  return movies.filter((movie) => movie.slug !== slug && movie.genres.some((genre) => source.genres.includes(genre))).slice(0, limit);
}

export function getRelatedSeries(slug: string, limit = 3) {
  const source = series.find((item) => item.slug === slug);
  if (!source) return [];
  return series.filter((item) => item.slug !== slug && item.genres.some((genre) => source.genres.includes(genre))).slice(0, limit);
}

export function getCastEntries(ids: string[]) { return castMembers.filter((member) => ids.includes(member.slug)); }
export function getReviewsForTarget(targetId: string) { return reviews.filter((review) => review.targetId === targetId); }
export function getVideoForTarget(targetId: string, targetType: 'movie' | 'series') { return videoEmbeds.find((embed) => embed.targetId === targetId && embed.targetType === targetType); }
export function getSettings() { return settings; }

export type Movie = (typeof movies)[number];
export type Series = (typeof series)[number];
export type Genre = (typeof genres)[number];
export type Cast = (typeof castMembers)[number];
export type Review = (typeof reviews)[number];
export type VideoEmbed = (typeof videoEmbeds)[number];
