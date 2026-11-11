import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';
  const date = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: date },
    { url: `${baseUrl}/movies`, lastModified: date },
    { url: `${baseUrl}/series`, lastModified: date },
    { url: `${baseUrl}/about`, lastModified: date },
    { url: `${baseUrl}/contact`, lastModified: date },
    { url: `${baseUrl}/privacy-policy`, lastModified: date },
    { url: `${baseUrl}/terms-of-service`, lastModified: date },
    { url: `${baseUrl}/disclaimer`, lastModified: date },
  ];
}
