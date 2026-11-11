import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Bug Free Carnival',
    template: '%s | Bug Free Carnival',
  },
  description:
    'Discover cinematic recommendations, curated movie picks, and series browsing with dark modern design and SEO-friendly pages.',
  openGraph: {
    title: 'Bug Free Carnival',
    description: 'Search-friendly movie and series discovery landing page.',
    type: 'website',
    url: siteConfig.siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-text antialiased">
        <div className="min-h-screen bg-bg text-text">
          <Header />
          {children}
          <Footer />
        </div>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
