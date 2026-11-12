import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock3, Film, Star } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getMovieBySlug } from '@/lib/data';
import { getTmdbMovieById, getTmdbMovieByLegacySlug, tmdbIdFromSlug } from '@/lib/tmdb';

export const metadata: Metadata = { title: 'Movie details' };

type MoviePageProps = { params: Promise<{ slug: string }> };

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { slug } = await params;
  const localMovie = getMovieBySlug(slug);

  if (localMovie) {
    return (
      <main className="container-shell py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Movies', href: '/movies' }, { label: localMovie.title }]} />
        <article className="mt-8 grid gap-8 rounded-[28px] border border-border bg-card p-4 md:grid-cols-[320px_1fr] md:p-8">
          <img src={localMovie.posterUrl} alt={localMovie.title} className="w-full rounded-2xl border border-border object-cover" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Movie</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{localMovie.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted"><span><Star size={14} className="inline text-primary" /> {localMovie.rating}</span><span><Film size={14} className="inline text-primary" /> {localMovie.releaseYear}</span><span><Clock3 size={14} className="inline text-primary" /> {localMovie.duration}</span></div>
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-muted">{localMovie.synopsis}</p>
            <Link href="/movies" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium text-white hover:border-primary/60"><ArrowLeft size={16} /> Back to movies</Link>
          </div>
        </article>
      </main>
    );
  }

  const tmdbId = tmdbIdFromSlug(slug);
  const movie = await (tmdbId ? getTmdbMovieById(tmdbId) : getTmdbMovieByLegacySlug(slug)).catch((error) => {
    console.error('Unable to load TMDB movie detail:', error);
    return null;
  });

  if (!movie) {
    return <main className="container-shell py-16"><div className="card-surface mx-auto max-w-2xl p-8 text-center"><h1 className="text-3xl font-semibold text-white">Movie details are unavailable</h1><p className="mt-3 text-muted">This title could not be loaded from TMDB. Please try searching for it again.</p><Link href="/search" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 font-medium text-white hover:bg-[#9d6af5]">Back to search</Link></div></main>;
  }

  return (
    <main className="container-shell py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Movies', href: '/movies' }, { label: movie.title }]} />
      <article className="mt-8 grid gap-8 rounded-[28px] border border-border bg-card p-4 md:grid-cols-[320px_1fr] md:p-8">
        <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-2xl border border-border object-cover" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Movie · TMDB</p><h1 className="mt-3 text-4xl font-semibold text-white">{movie.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted"><span><Star size={14} className="inline text-primary" /> {movie.rating}</span><span><Film size={14} className="inline text-primary" /> {movie.releaseYear}</span><span><Clock3 size={14} className="inline text-primary" /> {movie.duration ?? 'Runtime unavailable'}</span></div>
          {movie.genres.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{movie.genres.map((genre) => <span key={genre} className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-text">{genre.replace(/-/g, ' ')}</span>)}</div>}
          <p className="mt-6 whitespace-pre-line text-base leading-7 text-muted">{movie.overview}</p>
          <Link href="/movies" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium text-white hover:border-primary/60"><ArrowLeft size={16} /> Back to movies</Link>
          <p className="mt-6 text-xs text-muted">Movie data provided by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </article>
    </main>
  );
}
