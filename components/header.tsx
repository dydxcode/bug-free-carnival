import Link from 'next/link';
import { Clapperboard, Film, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/about', label: 'About' },
];

export function Header() {
  return <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-xl"><div className="container-shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
    <Link href="/" aria-label="Jawvid home" className="flex shrink-0 items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/15 text-primary"><Clapperboard size={19}/></span><span><span className="block text-sm font-bold tracking-wide text-white sm:text-base">Bug Free Carnival</span><span className="block text-[10px] uppercase tracking-[0.22em] text-muted">Movie discovery</span></span></Link>
    <div className="order-2 flex items-center gap-2 md:order-3"><ThemeToggle/><Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-white transition hover:border-primary/60 sm:px-4" aria-label="Search movies and series"><Search size={16}/><span className="hidden sm:inline">Search</span></Link><Link href="/movies" className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#9d6af5] sm:px-4"><Film size={16}/><span className="hidden sm:inline">Browse</span></Link></div>
    <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-border/70 pt-2 text-sm md:order-2 md:ml-auto md:w-auto md:overflow-visible md:border-0 md:pt-0">{navigation.map((item) => <Link key={item.href} href={item.href} className="shrink-0 rounded-full px-3 py-2 text-muted transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{item.label}</Link>)}</nav>
  </div></header>;
}
