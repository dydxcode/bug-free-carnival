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

export const siteConfig = {
  siteName: 'Bug Free Carnival',
  siteUrl,
  mainWebsiteUrl: parseHttpUrl(process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL)?.toString().replace(/\/$/, ''),
  googleAnalyticsId: /^G-[A-Z0-9]+$/.test(process.env.GA_MEASUREMENT_ID ?? '') &&
    process.env.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
    ? process.env.GA_MEASUREMENT_ID
    : undefined,
};

/** Ignore empty, malformed, and example.com placeholder destinations. */
export function getSafeExternalUrl(value: string | undefined): string | undefined {
  return parseHttpUrl(value)?.toString();
}
