'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLibraryTitles, type LibraryTitle } from '@/lib/user-library';

function TitleRows({ title, items, empty }: { title: string; items: LibraryTitle[]; empty: string }) {
  return <section className="mt-10"><div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-semibold text-white">{title}</h2><span className="text-sm text-muted">{items.length}</span></div>{items.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <Link key={item.key} href={item.href} className="flex gap-4 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/50"><img src={item.posterUrl} alt="" className="h-28 w-[76px] shrink-0 rounded-xl object-cover"/><div className="flex min-w-0 flex-col justify-center"><span className="text-xs text-primary">{item.releaseYear} · {item.type === 'movie' ? 'Movie' : 'Series'}</span><span className="mt-1 line-clamp-2 font-semibold text-white">{item.title}</span><span className="mt-2 text-xs text-muted">Open details</span></div></Link>)}</div> : <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted">{empty}</p>}</section>;
}

export function UserLibraryPreview() {
  const [recent, setRecent] = useState<LibraryTitle[]>([]);
  const [saved, setSaved] = useState<LibraryTitle[]>([]);
  useEffect(() => {
    const refresh = () => { setRecent(getLibraryTitles('jawvid-recently-watched')); setSaved(getLibraryTitles('jawvid-watchlist')); };
    refresh();
    window.addEventListener('jawvid-library-change', refresh);
    return () => window.removeEventListener('jawvid-library-change', refresh);
  }, []);
  if (!recent.length && !saved.length) return null;
  return <section className="container-shell pb-8"><TitleRows title="Lanjut menonton" items={recent.slice(0, 3)} empty="Belum ada judul ditonton."/><TitleRows title="Watchlist Anda" items={saved.slice(0, 3)} empty="Belum ada judul tersimpan."/></section>;
}

export function UserLibraryPage() {
  const [recent, setRecent] = useState<LibraryTitle[]>([]);
  const [saved, setSaved] = useState<LibraryTitle[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const refresh = () => { setRecent(getLibraryTitles('jawvid-recently-watched')); setSaved(getLibraryTitles('jawvid-watchlist')); setLoaded(true); };
    refresh();
    window.addEventListener('jawvid-library-change', refresh);
    return () => window.removeEventListener('jawvid-library-change', refresh);
  }, []);
  return <main className="container-shell min-h-[65vh] py-10 md:py-14"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your collection</p><h1 className="mt-2 text-4xl font-semibold text-white">Watchlist</h1><p className="mt-3 max-w-2xl text-muted">Daftar ini disimpan di browser perangkat ini dan tidak memerlukan akun.</p>{loaded ? <><TitleRows title="Disimpan" items={saved} empty="Watchlist masih kosong. Simpan judul dari halaman detail."/><TitleRows title="Terakhir ditonton" items={recent} empty="Belum ada tautan menonton yang dibuka dari halaman detail."/></> : <p className="mt-8 animate-pulse rounded-xl bg-card p-5 text-muted">Memuat koleksi...</p>}</main>;
}
