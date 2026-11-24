import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ilovetools.org';
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1992103509447219';
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID || 'G-C56QDPLEKQ';
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_ID || 'ze16s3opjp';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'iLoveTools — Free Online File Converters & Utilities',
    template: '%s | iLoveTools',
  },
  description:
    'Free all-in-one web utilities: Convert, merge, and compress PDFs, images, and videos online with zero file uploads. 100% private, instant client-side tools.',
  keywords: [
    'pdf to excel',
    'pdf to powerpoint',
    'image compressor',
    'video compressor',
    'pdf compressor',
    'crop video pixels',
    'crop photo pixels',
    'free online tools',
  ],
  authors: [{ name: 'iLoveTools Team' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'iLoveTools',
    title: 'iLoveTools — Free Online File Converters & Utilities',
    description:
      'Free all-in-one web utilities: Convert, merge, and compress PDFs, images, and videos online with zero file uploads. 100% private, instant client-side tools.',
    images: [
      {
        url: '/producthunt_gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'iLoveTools — 100% Free & Private Online Utilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iLoveTools — Free Online File Converters & Utilities',
    description:
      'Free all-in-one web utilities: Convert, merge, and compress PDFs, images, and videos online with zero file uploads. 100% private, instant client-side tools.',
    images: ['/producthunt_gallery.jpg'],
  },
  other: {
    'google-adsense-account': 'ca-pub-1992103509447219',
  },
};

const structuredSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'iLoveTools',
      url: 'https://www.ilovetools.org',
      logo: 'https://www.ilovetools.org/logo.png',
      description: 'Free online file converters, compressors, and browser-based media utilities.',
      sameAs: [
        'https://peerlist.io/projects',
        'https://www.producthunt.com',
        'https://alternativeto.net/software/ilovetools/',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'iLoveTools',
      url: 'https://www.ilovetools.org',
      description: '100% Private, Free In-Browser Online File Converters and Utilities',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.ilovetools.org/?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <meta name="google-adsense-account" content={adsenseClientId} />
        {/* Third-party script error suppressor for QA / headless crash protection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && (
                  (e.message && (
                    e.message.indexOf('adsbygoogle') !== -1 ||
                    e.message.indexOf('availableWidth=0') !== -1 ||
                    e.message.indexOf('already have ads in them') !== -1
                  )) ||
                  (e.filename && e.filename.indexOf('adsbygoogle') !== -1)
                )) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return true;
                }
              }, true);
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-rose-600 selection:text-white dark:selection:bg-rose-500 dark:selection:text-white bg-neutral-50 dark:bg-[#0a0a0b] text-neutral-900 dark:text-neutral-100">
        {children}
        {/* Google Analytics - Non-blocking */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Google AdSense - Lazy loaded in background */}
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        {/* Microsoft Clarity - Bing Webmaster Analytics & Heatmaps */}
        <Script
          id="microsoft-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `,
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
