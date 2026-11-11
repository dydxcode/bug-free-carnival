import { getAllGenres, getFeaturedMovies, getPopularMovies, getAllSeries } from '@/lib/data';
import { MovieCard } from '@/components/movie-card';
import { SeriesCard } from '@/components/series-card';
import { GenrePill } from '@/components/genre-pill';
import { SectionHeading } from '@/components/section-heading';
import Link from 'next/link';

export const metadata = {
  title: 'Discover Movies & Series',
  description: 'Browse cinematic picks, trending titles, and series recommendations curated for discovery.',
};

export default function HomePage() {
  const featuredMovies = getFeaturedMovies();
  const popularMovies = getPopularMovies();
  const allSeries = getAllSeries().slice(0, 3);
  const genres = getAllGenres();

  return (
    <main>
      <section className="container-shell py-10 md:py-16">
        <div className="grid gap-8 overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#191d27] via-[#12151d] to-[#0b0d12] p-6 md:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-primary">Cinematic discovery</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Find your next <span className="text-gradient">movie night</span> fix.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">
              Explore trending movies, binge-worthy series, and polished recommendations designed for search-friendly discovery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/movies" className="rounded-full bg-primary px-5 py-3 font-medium text-white transition hover:bg-[#9d6af5]">
                Browse movies
              </Link>
              <Link href="/series" className="rounded-full border border-border bg-card px-5 py-3 font-medium text-text transition hover:border-primary/60">
                Explore series
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-[28px] border border-border bg-card p-4 shadow-glow">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={featuredMovies[0]?.posterUrl}
                  alt={featuredMovies[0]?.title ?? 'Featured title'}
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">Featured</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{featuredMovies[0]?.title}</h2>
                </div>
                <Link href={`/movies/${featuredMovies[0]?.slug}`} className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-8">
        <SectionHeading eyebrow="Featured picks" title="Popular movies" description="Curated by mood, genre, and binge value." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-8">
        <SectionHeading eyebrow="Trending" title="Latest additions" description="Fresh picks for discovery and repeat browsing." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-8">
        <SectionHeading eyebrow="Binge-ready" title="Featured series" description="Dive into longer-form storytelling and cinematic worlds." />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {allSeries.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-8">
        <SectionHeading eyebrow="Browse by genre" title="Explore by mood" description="Find your match by style and atmosphere." />
        <div className="mt-8 flex flex-wrap gap-3">
          {genres.map((genre) => (
            <GenrePill key={genre.slug} genre={genre} />
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <SectionHeading eyebrow="Recommended" title="Movie watchlist" description="Useful picks for users who want to discover more with a clear call to action." />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredMovies.slice(0, 3).map((movie) => (
            <div key={movie.id} className="card-surface p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Recommended</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{movie.title}</h3>
              <p className="mt-3 text-sm text-muted">{movie.synopsis}</p>
              <Link href={`/movies/${movie.slug}`} className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-white hover:border-primary/60">
                See details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
