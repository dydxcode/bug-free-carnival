import { z } from 'zod';

export const GenreSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
});

export const CastSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  role: z.string().min(1),
  photoUrl: z.string().url(),
});

export const MovieSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  synopsis: z.string().min(20),
  posterUrl: z.string().url(),
  releaseYear: z.number().int().min(1900),
  duration: z.string().min(1),
  rating: z.string().min(1),
  genres: z.array(z.string().min(1)),
  cast: z.array(z.string().min(1)),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  watchUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export const SeriesSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  synopsis: z.string().min(20),
  posterUrl: z.string().url(),
  releaseYear: z.number().int().min(1900),
  genres: z.array(z.string().min(1)),
  cast: z.array(z.string().min(1)),
  seasons: z.number().int().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  rating: z.string().min(1),
  watchUrl: z.string().url().optional(),
  featured: z.boolean().default(false),
});

export const VideoEmbedSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  targetType: z.enum(['movie', 'series']),
  provider: z.string().min(1),
  embedUrl: z.string().url(),
  previewUrl: z.string().url().optional(),
  externalWatchUrl: z.string().url(),
});

export const ReviewSchema = z.object({
  id: z.string(),
  targetId: z.string(),
  title: z.string().min(1),
  content: z.string().min(20),
  createdAt: z.string().datetime(),
});

export const SettingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteUrl: z.string().url(),
  mainWebsiteUrl: z.string().url(),
  supportEmail: z.string().email().optional(),
  googleAnalyticsId: z.string().optional(),
});

export type Genre = z.infer<typeof GenreSchema>;
export type Cast = z.infer<typeof CastSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type VideoEmbed = z.infer<typeof VideoEmbedSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
