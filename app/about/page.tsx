import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Bug Free Carnival and the discovery-first mission behind the catalog.',
};

export default function AboutPage() {
  return (
    <main className="container-shell py-10">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">About</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">About Bug Free Carnival</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Bug Free Carnival is a discovery website designed to help audiences browse movie and series picks through a clean, search-friendly interface. The goal is not to recreate a streaming platform, but to guide visitors toward an informed discovery journey with strong categories, fast navigation, and clear direction to the official viewing destination.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card-surface p-5">
            <p className="text-lg font-semibold text-white">Discovery</p>
            <p className="mt-3 text-muted">We surface titles with clear genre grouping, trust signals, and useful context for browsing.</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-lg font-semibold text-white">Clarity</p>
            <p className="mt-3 text-muted">Structured landing pages make it easier for visitors to explore without clutter or distraction.</p>
          </div>
          <div className="card-surface p-5">
            <p className="text-lg font-semibold text-white">Trust</p>
            <p className="mt-3 text-muted">We keep external links transparent and point users to the appropriate official destination.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
