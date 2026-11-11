import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGenres, getAllSeries, getSeriesByGenre } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Series',
  description: 'Explore a curated list of episodic series sorted by genre and discovery value.',
};

export default function SeriesPage({ searchParams }: { searchParams?: Promise<{ genre?: string; sort?: string }> }) {
  const params = (searchParams ? searchParams : Promise.resolve({})) as Promise<{ genre?: string; sort?: string }>;
  void params;
  const genreFilter = (searchParams ? undefined : undefined) as string | undefined;
  const sort = 'featured';

  const series = getAllSeries();
  const genres = getAllGenres();
  let visibleSeries = [...series];

  if (genreFilter) {
    visibleSeries = getSeriesByGenre(genreFilter);
  }

  if (sort === 'newest') {
    visibleSeries = [...visibleSeries].sort((a, b) => b.releaseYear - a.releaseYear);
  }

  if (sort === 'alphabetical') {
    visibleSeries = [...visibleSeries].sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <main className="container-shell py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Catalog</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Series</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/series" className="rounded-full border border-border px-4 py-2 text-sm text-white hover:border-primary/60">
            All series
          </Link>
          {genres.map((genre) => (
            <Link key={genre.slug} href={`/genre/${genre.slug}`} className="rounded-full border border-border px-4 py-2 text-sm text-white hover:border-primary/60">
              {genre.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="card-surface mb-8 p-4">
        <form method="GET" action="/series" className="flex flex-col gap-3 md:flex-row">
          <select name="genre" defaultValue={genreFilter ?? ''} className="w-full rounded-full border border-border bg-panel px-4 py-3 text-white md:max-w-xs">
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.slug} value={genre.slug}>
                {genre.name}
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
        {visibleSeries.length > 0 ? (
          visibleSeries.map((seriesItem) => <SeriesCard key={seriesItem.id} series={seriesItem} />)
        ) : (
          <div className="col-span-full card-surface p-8 text-center text-muted">No series match the current filter.</div>
        )}
      </div>
    </main>
  );
}
