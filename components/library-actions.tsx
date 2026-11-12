'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { addToWatchlist, isInWatchlist, removeFromWatchlist, type LibraryTitle } from '@/lib/user-library';

export function FavoriteButton({ title, className = '' }: { title: LibraryTitle; className?: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isInWatchlist(title.key));
    const update = () => setSaved(isInWatchlist(title.key));
    window.addEventListener('jawvid-library-change', update);
    return () => window.removeEventListener('jawvid-library-change', update);
  }, [title.key]);

  function toggle() {
    if (saved) removeFromWatchlist(title.key);
    else addToWatchlist(title);
    setSaved(!saved);
  }

  return <button type="button" onClick={toggle} aria-pressed={saved} aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'} className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-panel px-4 py-2.5 text-sm font-medium text-white transition hover:border-primary/60 ${className}`}>
    {saved ? <BookmarkCheck size={16} className="text-primary"/> : <Bookmark size={16}/>}<span>{saved ? 'Tersimpan' : 'Simpan'}</span>
  </button>;
}

export function TrackWatchLink({ title, href, children, className }: { title: LibraryTitle; href: string; children: React.ReactNode; className: string }) {
  function track() {
    try {
      const key = 'jawvid-recently-watched';
      const current = JSON.parse(localStorage.getItem(key) ?? '[]') as LibraryTitle[];
      localStorage.setItem(key, JSON.stringify([title, ...current.filter((item) => item.key !== title.key)].slice(0, 20)));
      window.dispatchEvent(new Event('jawvid-library-change'));
    } catch { /* Storage may be disabled; outbound navigation must still work. */ }
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" onClick={track} className={className}>{children}</a>;
}
