import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the Bug Free Carnival team for support, partnerships, and content guidance.',
};

export default function ContactPage() {
  return (
    <main className="container-shell py-10">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Get in touch</h1>
        <p className="mt-6 text-lg text-muted">
          For inquiries, partnership opportunities, or general questions about this catalog, contact us through the official support channel listed below.
        </p>
        <div className="mt-8 card-surface p-6">
          <p className="text-white">Email: hello@example.com</p>
          <p className="mt-3 text-white">Main website: https://example.com</p>
          <p className="mt-3 text-muted">This contact information is a placeholder and should be replaced with verified live details before public deployment.</p>
        </div>
      </div>
    </main>
  );
}
