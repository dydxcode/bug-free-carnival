import Link from 'next/link';
import type { Series } from '@/lib/data';

export function SeriesCard({ series }: { series: Series }) {
  return (
    <Link href={`/series/${series.slug}`} className="group block overflow-hidden rounded-[24px] border border-border bg-card p-3 transition hover:-translate-y-1 hover:border-primary/60">
      <div className="overflow-hidden rounded-2xl">
        <img src={series.posterUrl} alt={series.title} className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-white">{series.title}</p>
          <p className="mt-2 text-sm text-muted">{series.releaseYear} • {series.seasons} seasons</p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{series.rating}</span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-muted">{series.synopsis}</p>
    </Link>
  );
}
