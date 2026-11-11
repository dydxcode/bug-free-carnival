import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t border-border bg-panel/60">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-white">Bug Free Carnival</p>
          <p className="mt-3 text-sm text-muted">Curated discovery pages for movies and series.</p>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/movies">Movies</Link></li>
            <li><Link href="/series">Series</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted">Links & attribution</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/contact">Contact</Link></li>
            {siteConfig.mainWebsiteUrl && <li><a href={siteConfig.mainWebsiteUrl} target="_blank" rel="noopener noreferrer">Main site</a></li>}
            <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">The Movie Database (TMDB)</a></li>
          </ul>
          <p className="mt-3 text-xs leading-5 text-muted">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
