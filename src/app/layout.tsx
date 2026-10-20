import type { Metadata, Viewport } from 'next';
import './globals.css';

// LinkedIn and other link previews need absolute image URLs. Set NEXT_PUBLIC_SITE_URL
// to the custom domain; on Vercel the production URL is picked up automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const title = 'Sahil Kumar | ML Researcher & Full Stack Developer';
const description =
  '2× IEEE-published ML researcher (ICDM 2026, MIGARS 2026), Top 50 in the Amazon ML Challenge and a Top 5 team in the Hero Campus ML Challenge. Full-stack developer at IIIT Allahabad.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    'Sahil Kumar',
    'ML researcher',
    'IEEE ICDM 2026',
    'conformal prediction',
    'GeoAI',
    'remote sensing',
    'software engineer',
    'full stack developer',
    'IIIT Allahabad',
    'portfolio',
  ],
  authors: [{ name: 'Sahil Kumar', url: siteUrl }],
  creator: 'Sahil Kumar',
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Sahil Kumar',
    type: 'profile',
    firstName: 'Sahil',
    lastName: 'Kumar',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#030014',
  colorScheme: 'dark',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sahil Kumar',
  url: siteUrl,
  jobTitle: 'ML Researcher & Full Stack Developer',
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Information Technology, Allahabad' },
  knowsAbout: ['Machine Learning', 'Conformal Prediction', 'Remote Sensing', 'Full Stack Development'],
  sameAs: ['https://github.com/sahil1418', 'https://www.linkedin.com/in/sahil-kumar-0a272028b/'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
