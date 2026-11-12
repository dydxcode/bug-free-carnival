import Link from 'next/link';
import { Search } from 'lucide-react';
import { getTmdbTrending } from '@/lib/tmdb';

export default async function HomePage() {
  const { movies, series } = await getTmdbTrending(6);

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
              Browse live TMDB movies and series, search the newest titles, and discover trending stories without manual JSON updates.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-medium text-white transition hover:bg-[#9d6af5]">
                <Search size={16} /> Search TMDB
              </Link>
              <Link href="/movies" className="rounded-full border border-border bg-card px-5 py-3 font-medium text-text transition hover:border-primary/60">
                Browse catalog
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-4 shadow-glow">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={movies[0]?.posterUrl ?? 'https://placehold.co/800x1200/191D27/F5F6FA?text=Trending'}
                alt={movies[0]?.title ?? 'Featured movie'}
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Trending</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{movies[0]?.title ?? 'Live TMDB feed'}</h2>
              </div>
              <Link href="/search" className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                View all
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Live feed</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Latest movies</h2>
          </div>
          <Link href="/search" className="text-sm text-primary hover:underline">Search more</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.slug}`} className="group block overflow-hidden rounded-[24px] border border-border bg-card p-3 transition hover:-translate-y-1 hover:border-primary/60">
              <div className="overflow-hidden rounded-2xl">
                <img src={movie.posterUrl} alt={movie.title} className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{movie.title}</p>
                  <p className="mt-2 text-sm text-muted">{movie.releaseYear} • {movie.runtimeLabel ?? 'Runtime unavailable'}</p>
                </div>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{movie.rating}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{movie.overview}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Live feed</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Latest series</h2>
          </div>
          <Link href="/search" className="text-sm text-primary hover:underline">Search more</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {series.map((item) => (
            <Link key={item.id} href={`/series/${item.slug}`} className="group block overflow-hidden rounded-[24px] border border-border bg-card p-3 transition hover:-translate-y-1 hover:border-primary/60">
              <div className="overflow-hidden rounded-2xl">
                <img src={item.posterUrl} alt={item.title} className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.releaseYear} • {item.seasons ?? 1} seasons</p>
                </div>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{item.rating}</span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{item.overview}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
