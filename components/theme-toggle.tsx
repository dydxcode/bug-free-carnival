'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('jawvid-theme');
    const useLight = saved === 'light';
    document.documentElement.dataset.theme = useLight ? 'light' : 'dark';
    setLight(useLight);
  }, []);
  function toggle() {
    const next = !light;
    document.documentElement.dataset.theme = next ? 'light' : 'dark';
    localStorage.setItem('jawvid-theme', next ? 'light' : 'dark');
    setLight(next);
  }
  return <button type="button" onClick={toggle} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-white transition hover:border-primary/60">{light ? <Moon size={17}/> : <Sun size={17}/>}</button>;
}
