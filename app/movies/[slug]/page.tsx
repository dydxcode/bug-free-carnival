import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock3, Play, Star, Tv, Film, ExternalLink } from 'lucide-react';
import { getMovieBySlug, getRelatedMovies, getReviewsForTarget, getVideoForTarget, getAllGenres, getCastEntries } from '@/lib/data';
import { VideoPreview } from '@/components/video-preview';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Movie details',
};

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movie = getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const related = getRelatedMovies(movie.slug, 3);
  const reviews = getReviewsForTarget(movie.id);
  const video = getVideoForTarget(movie.id, 'movie');
  const castEntries = getCastEntries(movie.cast);
  const genreNames = getAllGenres().filter((genre) => movie.genres.includes(genre.slug));

  return (
    <main className="container-shell py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Movies', href: '/movies' }, { label: movie.title }]} />
      <article className="mt-8 rounded-[28px] border border-border bg-card p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div>
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-2xl border border-border object-cover" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Movie</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><Star size={14} className="text-primary" /> {movie.rating}</span>
              <span className="inline-flex items-center gap-2"><Film size={14} className="text-primary" /> {movie.releaseYear}</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={14} className="text-primary" /> {movie.duration}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {genreNames.map((genre) => (
                <Link key={genre.slug} href={`/genre/${genre.slug}`} className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-text">
                  {genre.name}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-base leading-7 text-muted">{movie.synopsis}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={movie.watchUrl || 'https://example.com/watch'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-white hover:bg-[#9d6af5]"
              >
                <Play size={16} />
                Watch full video
              </a>
              <Link href="/movies" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium text-white hover:border-primary/60">
                <ArrowLeft size={16} /> Back to movies
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            {video ? (
              <div>
                <h2 className="text-2xl font-semibold text-white">Preview</h2>
                <div className="mt-4">
                  <VideoPreview video={video} />
                </div>
              </div>
            ) : (
              <div className="card-surface p-5 text-muted">Preview video not available for this title yet.</div>
            )}

            {reviews.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white">Notes & guide</h2>
                <div className="mt-4 space-y-4">
                  {reviews.map((review) => (
                    <article key={review.id} className="card-surface p-5">
                      <h3 className="text-lg font-semibold text-white">{review.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{review.content}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <div className="card-surface p-5">
              <h2 className="text-xl font-semibold text-white">Cast</h2>
              <div className="mt-4 space-y-3">
                {castEntries.map((person) => (
                  <div key={person.id} className="flex items-center gap-3">
                    <img src={person.photoUrl} alt={person.name} className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-white">{person.name}</p>
                      <p className="text-sm text-muted">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-5">
              <h2 className="text-xl font-semibold text-white">Watch on main site</h2>
              <a href="https://example.com/watch" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
                Open main website <ExternalLink size={16} />
              </a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-white">Related movies</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((relatedMovie) => (
              <Link key={relatedMovie.id} href={`/movies/${relatedMovie.slug}`} className="card-surface overflow-hidden p-3">
                <img src={relatedMovie.posterUrl} alt={relatedMovie.title} className="h-56 w-full rounded-xl object-cover" />
                <div className="mt-4 px-1 pb-1">
                  <p className="text-lg font-medium text-white">{relatedMovie.title}</p>
                  <p className="mt-2 text-sm text-muted">{relatedMovie.releaseYear}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
