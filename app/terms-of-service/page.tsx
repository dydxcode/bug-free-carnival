import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for content discovery and user access on Bug Free Carnival.',
};

export default function TermsPage() {
  return (
    <main className="container-shell py-10">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Terms</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-muted leading-7">
          <p>
            The content presented on this site is intended for informational browsing and discovery purposes. All titles and metadata are organized for discovery and should be verified against official listings when needed.
          </p>
          <p>
            We may include links to third-party websites and official content sources. We do not host or redistribute protected media without permission, and users should comply with the relevant terms of those services.
          </p>
          <p>
            This project may be updated over time. Visitors are responsible for understanding that some data is placeholder content before final production publication.
          </p>
        </div>
      </div>
    </main>
  );
}
