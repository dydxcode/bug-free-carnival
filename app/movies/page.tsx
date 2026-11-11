import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGenres, getMoviesByGenre, getSeriesByGenre, getAllMovies, getAllSeries } from '@/lib/data';
import { MovieCard } from '@/components/movie-card';
import { SeriesCard } from '@/components/series-card';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Browse a cinematic library of movie recs, filters, and SEO-friendly title listings.',
};

export default function MoviesPage({ searchParams }: { searchParams?: Promise<{ genre?: string; sort?: string }> }) {
  const params = (searchParams ? searchParams : Promise.resolve({})) as Promise<{ genre?: string; sort?: string }>;
  void params;
  const genreFilter = (searchParams ? undefined : undefined) as string | undefined;
  const sort = 'featured';

  const allMovies = getAllMovies();
  const genres = getAllGenres();

  let visibleMovies = [...allMovies];
  const genre = genreFilter;

  if (genre) {
    visibleMovies = getMoviesByGenre(genre);
  }

  if (sort === 'newest') {
    visibleMovies = [...visibleMovies].sort((a, b) => b.releaseYear - a.releaseYear);
  }

  if (sort === 'alphabetical') {
    visibleMovies = [...visibleMovies].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <main className="container-shell py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Movies</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/movies" className="rounded-full border border-border px-4 py-2 text-sm text-white hover:border-primary/60">
            All titles
          </Link>
          {genres.map((genreItem) => (
            <Link key={genreItem.slug} href={`/genre/${genreItem.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-white hover:border-primary/60">
              {genreItem.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="card-surface mb-8 p-4">
        <form method="GET" action="/movies" className="flex flex-col gap-3 md:flex-row">
          <select name="genre" defaultValue={genre ?? ''} className="w-full rounded-full border border-border bg-panel px-4 py-3 text-white md:max-w-xs">
            <option value="">All genres</option>
            {genres.map((genreItem) => (
              <option key={genreItem.slug} value={genreItem.slug}>
                {genreItem.name}
              </option>
            ))}
          </select>
          <select name="sort" defaultValue={sort} className="w-full rounded-full border border-border bg-panel px-4 py-3 text-white md:max-w-xs">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <button type="submit" className="rounded-full bg-primary px-5 py-3 font-medium text-white hover:bg-[#9d6af5]">
            Apply filters
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {visibleMovies.length > 0 ? (
          visibleMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <div className="col-span-full card-surface p-8 text-center text-muted">No movie matches the current filter yet.</div>
        )}
      </div>
    </main>
  );
}
