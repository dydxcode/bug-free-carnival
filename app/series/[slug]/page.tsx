import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock3, Star, Tv } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getSeriesBySlug } from '@/lib/data';
import { getTmdbSeriesById, getTmdbSeriesByLegacySlug, tmdbIdFromSlug } from '@/lib/tmdb';
import { getFreeWatchUrlForSlug } from '@/lib/site-config';
import { FavoriteButton, TrackWatchLink } from '@/components/library-actions';

export const metadata: Metadata = { title: 'Series details' };
type SeriesPageProps = { params: Promise<{ slug: string }> };

function SeriesDetail({ series, href, freeWatchUrl, isTmdb = false }: { series: { id: number | string; title: string; posterUrl: string; releaseYear: number; rating: string; seasons?: number; synopsis?: string; overview?: string; genres?: string[] }; href: string; freeWatchUrl?: string; isTmdb?: boolean }) {
  const titleData = { key: `series-${series.id}`, type: 'series' as const, title: series.title, href, posterUrl: series.posterUrl, releaseYear: series.releaseYear };
  const summary = series.overview ?? series.synopsis ?? '';
  return <main className="container-shell py-8 md:py-12"><Breadcrumbs items={[{label:'Home',href:'/'},{label:'Series',href:'/series'},{label:series.title}]}/>
    <article className="relative isolate mt-6 overflow-hidden rounded-[30px] border border-border bg-card"><img src={series.posterUrl} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20 blur-2xl"/><div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg via-bg/95 to-bg/75"/>
      <div className="grid gap-7 p-5 md:grid-cols-[280px_1fr] md:gap-10 md:p-10"><img src={series.posterUrl} alt={series.title} className="mx-auto aspect-[2/3] w-full max-w-[280px] rounded-2xl border border-white/10 object-cover shadow-2xl"/>
        <div className="flex flex-col justify-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{isTmdb ? 'Series · TMDB' : 'Series'}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">{series.title}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted"><span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-3 py-2"><Star size={15} className="text-primary"/>{series.rating}</span><span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-3 py-2"><Tv size={15} className="text-primary"/>{series.releaseYear}</span><span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-3 py-2"><Clock3 size={15} className="text-primary"/>{series.seasons ?? 1} seasons</span></div>
          {series.genres?.length ? <div className="mt-4 flex flex-wrap gap-2">{series.genres.map((genre) => <span key={genre} className="rounded-full border border-border bg-panel/80 px-3 py-1.5 text-xs text-muted">{genre.replace(/-/g,' ')}</span>)}</div> : null}
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted md:text-lg">{summary || 'Synopsis is not available for this title.'}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">{freeWatchUrl ? <TrackWatchLink title={titleData} href={freeWatchUrl} className="inline-flex items-center justify-center rounded-lg border-2 border-[#8b5cf6] bg-[#6d28d9] px-5 py-3 font-bold tracking-wide text-white transition hover:bg-[#7c3aed]">▶ GRATIS MENONTON</TrackWatchLink> : null}<FavoriteButton title={titleData}/><Link href="/series" className="inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-5 py-3 font-medium text-white hover:border-primary/60"><ArrowLeft size={16}/> Kembali ke series</Link></div>
          {isTmdb && <p className="mt-6 text-xs text-muted">Data TV disediakan oleh TMDB. Produk ini menggunakan API TMDB dan tidak didukung atau disertifikasi oleh TMDB.</p>}
        </div>
      </div>
    </article>
  </main>;
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const localSeries = getSeriesBySlug(slug);
  if (localSeries) return <SeriesDetail series={localSeries} href={`/series/${slug}`} freeWatchUrl={getFreeWatchUrlForSlug('series', slug)}/>;
  const id = tmdbIdFromSlug(slug);
  const series = await (id ? getTmdbSeriesById(id) : getTmdbSeriesByLegacySlug(slug)).catch((error) => { console.error('Unable to load TMDB series detail:', error); return null; });
  if (!series) return <main className="container-shell py-16"><div className="card-surface mx-auto max-w-2xl p-8 text-center"><h1 className="text-3xl font-semibold text-white">Series details are unavailable</h1><p className="mt-3 text-muted">We could not load this title right now. Please try searching again.</p><Link href="/search" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-white">Back to search</Link></div></main>;
  return <SeriesDetail series={series} href={`/series/${slug}`} freeWatchUrl={getFreeWatchUrlForSlug('series', slug)} isTmdb/>;
}
