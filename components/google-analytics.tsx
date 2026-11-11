import Script from 'next/script';
import { siteConfig } from '@/lib/site-config';

export function GoogleAnalytics() {
  const id = siteConfig.googleAnalyticsId;
  if (!id) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(id)});`}
      </Script>
    </>
  );
}
