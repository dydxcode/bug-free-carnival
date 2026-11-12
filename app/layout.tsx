import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GoogleAnalytics } from '@/components/google-analytics';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: 'Bug Free Carnival', template: '%s | Bug Free Carnival' },
  description: 'Discover movies and series with live TMDB-powered search, trending picks, and a personal watchlist.',
  openGraph: { title: 'Bug Free Carnival', description: 'Discover movies and series powered by TMDB.', type: 'website', url: siteConfig.siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className="bg-bg text-text antialiased"><div className="min-h-screen bg-bg text-text"><Header/>{children}<Footer/></div><GoogleAnalytics/></body></html>;
}
