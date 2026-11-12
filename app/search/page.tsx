import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { searchTmdb, hasTmdbToken } from '@/lib/tmdb';

export const metadata: Metadata = {
  title: 'Search movies and series',
  description: 'Search live movie and television title information from TMDB.',
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = '' } = await searchParams;
  let results = await searchTmdb(q, 20).catch(() => []);
  const configured = hasTmdbToken();

  return (
    <main className="container-shell min-h-[70vh] py-10 md:py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">Live TMDB search</p>
      <h1 className="mt-2 text-4xl font-semibold text-white">Find a movie or series</h1>
      <p className="mt-3 max-w-2xl text-muted">Search the TMDB catalog. Search results and title information are fetched when requested; they are not added to local JSON files.</p>

      <form method="GET" action="/search" className="card-surface mt-8 flex flex-col gap-3 p-4 sm:flex-row">
        <label className="sr-only" htmlFor="tmdb-query">Movie or series title</label>
        <input id="tmdb-query" name="q" type="search" defaultValue={q} placeholder="Search titles…" className="min-w-0 flex-1 rounded-full border border-border bg-panel px-5 py-3 text-white outline-none placeholder:text-muted focus:border-primary" />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-[#9d6af5]"><Search size={16} /> Search</button>
      </form>

      {!configured ? (
        <div className="card-surface mt-8 p-6 text-muted">Live search is not configured yet. Add <code className="text-white">TMDB_ACCESS_TOKEN</code> to the Vercel project environment variables, then redeploy.</div>
      ) : q.trim() ? (
        <section className="mt-10" aria-live="polite">
          <h2 className="text-2xl font-semibold text-white">Results for “{q}”</h2>
          {results.length ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {results.map((item) => (
                <Link key={`${item.type}-${item.id}`} href={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.slug}`} className="group overflow-hidden rounded-[24px] border border-border bg-card p-3 transition hover:-translate-y-1 hover:border-primary/60">
                  <div className="overflow-hidden rounded-2xl bg-panel"><img src={item.posterUrl} alt={item.title} className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" /></div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div><p className="text-lg font-semibold text-white">{item.title}</p><p className="mt-2 text-sm text-muted">{item.releaseYear} · {item.type === 'movie' ? 'Movie' : 'Series'}</p></div>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs text-primary">{item.rating}</span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-muted">{item.overview}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="card-surface mt-6 p-6 text-muted">No titles found. Try another search or a different language.</p>
          )}
        </section>
      ) : (
        <p className="mt-8 text-muted">Enter a title to search movies and series.</p>
      )}
      <p className="mt-10 text-xs text-muted">Movie and TV data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </main>
  );
}
