import Link from 'next/link';
import type { Series } from '@/lib/data';
import { ArrowUpRight, Star } from 'lucide-react';

export function SeriesCard({ series }: { series: Series }) {
  return (
    <Link href={`/series/${series.slug}`} className="group block overflow-hidden rounded-[24px] border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <div className="relative aspect-[4/5] overflow-hidden bg-panel">
        <img src={series.posterUrl} alt={series.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">{series.releaseYear}</span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"><Star size={12} className="fill-primary text-primary" /> {series.rating}</span>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white opacity-0 transition group-hover:opacity-100"><ArrowUpRight size={17} /></span>
      </div>
      <div className="p-4">
        <h2 className="line-clamp-1 text-base font-semibold text-white">{series.title}</h2>
        <p className="mt-1 text-xs text-muted">{series.seasons} seasons</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{series.synopsis}</p>
      </div>
    </Link>
  );
}
