import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock3, Star, Tv } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getSeriesBySlug } from '@/lib/data';
import { getTmdbSeriesById, getTmdbSeriesByLegacySlug, tmdbIdFromSlug } from '@/lib/tmdb';

export const metadata: Metadata = { title: 'Series details' };

type SeriesPageProps = { params: Promise<{ slug: string }> };

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const localSeries = getSeriesBySlug(slug);

  if (localSeries) {
    return (
      <main className="container-shell py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Series', href: '/series' }, { label: localSeries.title }]} />
        <article className="mt-8 grid gap-8 rounded-[28px] border border-border bg-card p-4 md:grid-cols-[320px_1fr] md:p-8">
          <img src={localSeries.posterUrl} alt={localSeries.title} className="w-full rounded-2xl border border-border object-cover" />
          <div><p className="text-xs uppercase tracking-[0.18em] text-primary">Series</p><h1 className="mt-3 text-4xl font-semibold text-white">{localSeries.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted"><span><Star size={14} className="inline text-primary" /> {localSeries.rating}</span><span><Tv size={14} className="inline text-primary" /> {localSeries.releaseYear}</span><span><Clock3 size={14} className="inline text-primary" /> {localSeries.seasons} seasons</span></div>
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-muted">{localSeries.synopsis}</p><Link href="/series" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium text-white hover:border-primary/60"><ArrowLeft size={16} /> Back to series</Link>
          </div>
        </article>
      </main>
    );
  }

  const tmdbId = tmdbIdFromSlug(slug);
  const series = await (tmdbId ? getTmdbSeriesById(tmdbId) : getTmdbSeriesByLegacySlug(slug)).catch((error) => {
    console.error('Unable to load TMDB series detail:', error);
    return null;
  });

  if (!series) {
    return <main className="container-shell py-16"><div className="card-surface mx-auto max-w-2xl p-8 text-center"><h1 className="text-3xl font-semibold text-white">Series details are unavailable</h1><p className="mt-3 text-muted">This title could not be loaded from TMDB. Please try searching for it again.</p><Link href="/search" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-white hover:bg-[#9d6af5]">Back to search</Link></div></main>;
  }

  return (
    <main className="container-shell py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Series', href: '/series' }, { label: series.title }]} />
      <article className="mt-8 grid gap-8 rounded-[28px] border border-border bg-card p-4 md:grid-cols-[320px_1fr] md:p-8">
        <img src={series.posterUrl} alt={series.title} className="w-full rounded-2xl border border-border object-cover" />
        <div><p className="text-xs uppercase tracking-[0.18em] text-primary">Series · TMDB</p><h1 className="mt-3 text-4xl font-semibold text-white">{series.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted"><span><Star size={14} className="inline text-primary" /> {series.rating}</span><span><Tv size={14} className="inline text-primary" /> {series.releaseYear}</span><span><Clock3 size={14} className="inline text-primary" /> {series.seasons ?? 1} seasons</span></div>
          {series.genres.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{series.genres.map((genre) => <span key={genre} className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-text">{genre.replace(/-/g, ' ')}</span>)}</div>}
          <p className="mt-6 whitespace-pre-line text-base leading-7 text-muted">{series.overview}</p><Link href="/series" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium text-white hover:border-primary/60"><ArrowLeft size={16} /> Back to series</Link>
          <p className="mt-6 text-xs text-muted">TV data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </article>
    </main>
  );
}
