import Link from 'next/link';
import { ArrowRight, Clapperboard, Search, Sparkles } from 'lucide-react';
import { getTmdbDiscovery, hasTmdbToken, type TmdbCatalogItem } from '@/lib/tmdb';
import { UserLibraryPreview } from '@/components/user-library';

function Shelf({ title, eyebrow, items }: { title: string; eyebrow: string; items: TmdbCatalogItem[] }) {
  return (
    <section className="container-shell pb-14 md:pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p><h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h2></div>
        <Link href="/search" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-white">Explore all <ArrowRight size={15} /></Link>
      </div>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const href = `/${item.type === 'movie' ? 'movies' : 'series'}/${item.slug}`;
            return <Link key={`${item.type}-${item.id}`} href={href} className="group flex gap-4 rounded-2xl border border-border bg-card p-3 transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <img src={item.posterUrl} alt={item.title} loading="lazy" className="h-28 w-[76px] shrink-0 rounded-xl object-cover sm:h-32 sm:w-[86px]" />
              <div className="flex min-w-0 flex-col justify-center"><span className="text-xs font-medium text-primary">{item.releaseYear} · {item.type === 'movie' ? 'Movie' : 'Series'}</span><h3 className="mt-1 line-clamp-2 font-semibold text-white">{item.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{item.overview}</p><span className="mt-2 text-xs text-muted">{item.rating}</span></div>
            </Link>;
          })}
        </div>
      ) : <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center"><p className="font-medium text-white">{hasTmdbToken() ? 'This feed is temporarily unavailable.' : 'Live catalog is not configured yet.'}</p><p className="mt-2 text-sm text-muted">Search the catalog or try again later.</p><Link href="/search" className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-white">Search titles <ArrowRight size={15} className="ml-1" /></Link></div>}
    </section>
  );
}

export default async function HomePage() {
  const { topPicks, trending, recentlyAdded } = await getTmdbDiscovery(6);
  const featured = trending.find((item) => item.type === 'movie') ?? topPicks[0];

  return <main>
    <section className="container-shell pb-14 pt-8 md:pb-20 md:pt-14">
      <div className="relative isolate overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl shadow-black/20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.22),transparent_48%)]" />
        <div className="grid lg:min-h-[500px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center p-6 md:p-12 lg:p-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><Sparkles size={14} /> Your next watch starts here</div>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl">Find a story worth <span className="text-gradient">staying in for.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted md:text-lg">Explore TMDB movies and series, discover trending stories, and save titles for later.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-[#9d6af5]"><Search size={17} /> Search titles</Link><Link href="/movies" className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-6 py-3 font-semibold text-white transition hover:border-primary/60">Browse movies <ArrowRight size={16} /></Link></div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-border/80 pt-6 text-sm text-muted"><Link href="/movies" className="transition hover:text-white">Movies</Link><Link href="/series" className="transition hover:text-white">Series</Link><Link href="/watchlist" className="transition hover:text-white">My watchlist</Link><span>Powered by TMDB</span></div>
          </div>
          <div className="relative min-h-[300px] p-4 pt-0 sm:p-6 lg:min-h-0 lg:p-6"><div className="relative h-full min-h-[340px] overflow-hidden rounded-[24px] border border-white/10 bg-panel sm:min-h-[420px]">
            {featured ? <><img src={featured.posterUrl} alt={featured.title} className="absolute inset-0 h-full w-full object-cover object-top opacity-75 transition duration-700 hover:scale-[1.03]"/><div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/25 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 md:p-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Spotlight · {featured.releaseYear}</p><h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{featured.title}</h2><p className="mt-2 line-clamp-2 max-w-lg text-sm leading-6 text-white/75">{featured.overview}</p><Link href={`/${featured.type === 'movie' ? 'movies' : 'series'}/${featured.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:border-primary hover:bg-primary">Explore title <ArrowRight size={15}/></Link></div></> : <div className="flex h-full min-h-[340px] flex-col items-center justify-center p-8 text-center sm:min-h-[420px]"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary"><Clapperboard size={25}/></div><h2 className="mt-5 text-2xl font-semibold text-white">Your next favorite is waiting</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted">Add TMDB_ACCESS_TOKEN in Vercel to enable live catalog discovery.</p><Link href="/search" className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9d6af5]">Open search</Link></div>}
          </div></div>
        </div>
      </div>
    </section>
    <UserLibraryPreview />
    <Shelf title="Top picks" eyebrow="Highest rated on TMDB" items={topPicks}/>
    <Shelf title="Trending now" eyebrow="Popular this week" items={trending}/>
    <Shelf title="Recently added" eyebrow="Now playing & on the air" items={recentlyAdded}/>
  </main>;
}
