import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimer about demo data and informational usage of this movie and series catalog.',
};

export default function DisclaimerPage() {
  return (
    <main className="container-shell py-10">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Disclaimer</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Disclaimer</h1>
        <div className="mt-8 space-y-6 text-muted leading-7">
          <p>
            This website is designed as a cinematic discovery landing page for demonstration and SEO testing. Metadata, titles, posters, and embedded previews may be placeholder content until verified for production use.
          </p>
          <p>
            We do not guarantee that every third-party page, trailer, or external watch URL is officially licensed or active. Visitors should verify the destination before using it.
          </p>
          <p>
            Any configuration requiring real analytics, live domain ownership, or production metadata should be reviewed and approved before public launch.
          </p>
        </div>
      </div>
    </main>
  );
}
