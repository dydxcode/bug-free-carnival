import Link from 'next/link';
import type { Genre } from '@/lib/data';

export function GenrePill({ genre }: { genre: Genre }) {
  return (
    <Link href={`/genre/${genre.slug}`} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-white transition hover:border-primary/60 hover:text-primary">
      {genre.name}
    </Link>
  );
}
