import type { Metadata } from 'next';
import { MovieCard } from '@/components/movie-card';
import { SeriesCard } from '@/components/series-card';
import { getFeaturedMovies, getAllSeries } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Landing page',
};

export default function LandingPreview() {
  const movies = getFeaturedMovies();
  const series = getAllSeries().slice(0, 2);

  return (
    <div className="container-shell py-10">
      <div className="grid gap-6 md:grid-cols-2">{movies.slice(0, 2).map((movie) => <MovieCard key={movie.id} movie={movie} />)}</div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">{series.map((item) => <SeriesCard key={item.id} series={item} />)}</div>
    </div>
  );
}
