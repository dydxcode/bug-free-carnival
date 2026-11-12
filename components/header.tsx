import Link from 'next/link';
import { Film, Search, Clapperboard } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/80 backdrop-blur-sm">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Clapperboard size={18} /></div>
          <div><div className="text-base font-semibold tracking-wide text-white">Bug Free Carnival</div><div className="text-[10px] uppercase tracking-[0.22em] text-muted">Discovery</div></div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/movies" className="hover:text-white">Movies</Link>
          <Link href="/series" className="hover:text-white">Series</Link>
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-white hover:border-primary/60"><Search size={16} /> Search</Link>
          <Link href="/movies" className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[#9d6af5] sm:inline-flex"><Film size={16} /> Browse</Link>
        </div>
      </div>
    </header>
  );
}
