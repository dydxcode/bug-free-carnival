import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy and data handling information for Bug Free Carnival.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container-shell py-10">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Privacy</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-muted">
          <p>
            This site may use analytics tools such as Google Analytics or Search Console data to understand user behavior and improve discovery quality. Any analytics configuration should be reviewed and configured with approved IDs only.
          </p>
          <p>
            We do not sell personal data. We may collect limited information such as anonymous traffic metrics, search behavior trends, and platform analytics to improve page performance and UX.
          </p>
          <p>
            External links may redirect visitors to official third-party destinations. We recommend reviewing those providers’ privacy policies before interacting with their services.
          </p>
        </div>
      </div>
    </main>
  );
}
