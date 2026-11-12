const isExampleHost = (hostname: string) => hostname === 'example.com' || hostname.endsWith('.example.com');

function parseHttpUrl(value: string | undefined): URL | undefined {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (isExampleHost(url.hostname)) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

function parseHost(value: string | undefined): URL | undefined {
  if (!value?.trim()) return undefined;
  return parseHttpUrl(value.includes('://') ? value : `https://${value}`);
}

const siteUrl =
  parseHttpUrl(process.env.NEXT_PUBLIC_SITE_URL)?.origin ??
  parseHost(process.env.VERCEL_PROJECT_PRODUCTION_URL)?.origin ??
  parseHost(process.env.VERCEL_URL)?.origin ??
  'http://localhost:3000';

function parseMapping(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};

  try {
    const value = JSON.parse(raw);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(
        Object.entries(value).reduce<Array<[string, string]>>((entries, [key, val]) => {
          if (typeof key === 'string' && typeof val === 'string') {
            const url = parseHttpUrl(val)?.toString();
            if (url) entries.push([key.trim(), url]);
          }
          return entries;
        }, []),
      );
    }
  } catch {
    // Ignore invalid JSON and fall through.
  }

  return {};
}

const freeWatchMovieMap = parseMapping(process.env.FREE_WATCH_MOVIE_URLS);
const freeWatchSeriesMap = parseMapping(process.env.FREE_WATCH_SERIES_URLS);
const sharedFreeWatchUrl = parseHttpUrl(process.env.FREE_WATCH_URL)?.toString();

function resolveFreeWatchUrl(type: 'movie' | 'series', slug: string | undefined): string | undefined {
  const candidates = new Set<string>([
    slug ?? '',
    slug?.replace(/-tmdb-\d+$/, '') ?? '',
    slug?.replace(/-\d{5,}$/, '') ?? '',
  ]);

  const map = type === 'movie' ? freeWatchMovieMap : freeWatchSeriesMap;
  for (const candidate of candidates) {
    if (!candidate) continue;
    const exact = map[candidate];
    if (exact) return exact;
  }

  const direct = type === 'movie' ? parseHttpUrl(process.env.FREE_WATCH_MOVIE_URL)?.toString() : parseHttpUrl(process.env.FREE_WATCH_SERIES_URL)?.toString();
  if (direct) return direct;

  return sharedFreeWatchUrl;
}

export const siteConfig = {
  siteName: 'Bug Free Carnival',
  siteUrl,
  mainWebsiteUrl: parseHttpUrl(process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL)?.toString().replace(/\/$/, ''),
  freeWatchMovieUrl: resolveFreeWatchUrl('movie', undefined),
  freeWatchSeriesUrl: resolveFreeWatchUrl('series', undefined),
  googleAnalyticsId: /^G-[A-Z0-9]+$/.test(process.env.GA_MEASUREMENT_ID ?? '') &&
    process.env.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
    ? process.env.GA_MEASUREMENT_ID
    : undefined,
};

export function getFreeWatchUrlForSlug(type: 'movie' | 'series', slug: string | undefined): string | undefined {
  return resolveFreeWatchUrl(type, slug);
}

/** Ignore empty, malformed, and example.com placeholder destinations. */
export function getSafeExternalUrl(value: string | undefined): string | undefined {
  return parseHttpUrl(value)?.toString();
}
