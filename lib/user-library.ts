export type LibraryTitle = {
  key: string;
  type: 'movie' | 'series';
  title: string;
  href: string;
  posterUrl: string;
  releaseYear: number;
};

export function getLibraryTitles(storageKey: string): LibraryTitle[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is LibraryTitle => Boolean(item && typeof item === 'object' && typeof item.key === 'string' && typeof item.title === 'string' && typeof item.href === 'string' && typeof item.posterUrl === 'string' && (item.type === 'movie' || item.type === 'series')));
  } catch { return []; }
}

export function isInWatchlist(key: string) {
  return getLibraryTitles('jawvid-watchlist').some((item) => item.key === key);
}

export function addToWatchlist(title: LibraryTitle) {
  try {
    const current = getLibraryTitles('jawvid-watchlist');
    localStorage.setItem('jawvid-watchlist', JSON.stringify([title, ...current.filter((item) => item.key !== title.key)]));
    window.dispatchEvent(new Event('jawvid-library-change'));
  } catch { /* Ignore storage quota/privacy errors. */ }
}

export function removeFromWatchlist(key: string) {
  try {
    localStorage.setItem('jawvid-watchlist', JSON.stringify(getLibraryTitles('jawvid-watchlist').filter((item) => item.key !== key)));
    window.dispatchEvent(new Event('jawvid-library-change'));
  } catch { /* Ignore storage quota/privacy errors. */ }
}
