import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.siteUrl;
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified },
    { url: `${baseUrl}/movies`, lastModified },
    { url: `${baseUrl}/series`, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
    { url: `${baseUrl}/privacy-policy`, lastModified },
    { url: `${baseUrl}/terms-of-service`, lastModified },
    { url: `${baseUrl}/disclaimer`, lastModified },
  ];
}
