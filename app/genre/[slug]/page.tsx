import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllGenres, getMoviesByGenre, getSeriesByGenre } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Genre',
};

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const genre = getAllGenres().find((item) => item.slug === slug);

  if (!genre) {
    notFound();
  }

  const movies = getMoviesByGenre(slug);
  const series = getSeriesByGenre(slug);

  return (
    <main className="container-shell py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Genre</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">{genre.name}</h1>
        <p className="mt-3 max-w-2xl text-muted">{genre.description}</p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-white">Movies</h2>
        {movies.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.slug}`} className="card-surface overflow-hidden p-3">
                <img src={movie.posterUrl} alt={movie.title} className="h-64 w-full rounded-xl object-cover" />
                <div className="mt-4 px-1 pb-1">
                  <p className="text-lg font-medium text-white">{movie.title}</p>
                  <p className="mt-2 text-sm text-muted">{movie.releaseYear}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted">No movie matches this genre yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">Series</h2>
        {series.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {series.map((seriesItem) => (
              <Link key={seriesItem.id} href={`/series/${seriesItem.slug}`} className="card-surface overflow-hidden p-3">
                <img src={seriesItem.posterUrl} alt={seriesItem.title} className="h-64 w-full rounded-xl object-cover" />
                <div className="mt-4 px-1 pb-1">
                  <p className="text-lg font-medium text-white">{seriesItem.title}</p>
                  <p className="mt-2 text-sm text-muted">{seriesItem.releaseYear}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted">No series matches this genre yet.</p>
        )}
      </section>
    </main>
  );
}
