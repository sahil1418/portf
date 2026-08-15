import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sahil Kumar | ML Researcher & Full Stack Developer',
  description:
    'Portfolio of Sahil Kumar — B.Tech ECE student at IIIT Allahabad, published ML researcher (IEEE MIGARS 2026), and full-stack developer. Passionate about machine learning, remote sensing, and building impactful products.',
  keywords: [
    'ML researcher',
    'GeoAI',
    'software engineer',
    'portfolio',
    'machine learning',
    'full stack developer',
  ],
  authors: [{ name: 'Sahil Kumar' }],
  openGraph: {
    title: 'Sahil Kumar | ML Researcher & Full Stack Developer',
    description:
      'Portfolio of Sahil Kumar — B.Tech ECE student at IIIT Allahabad, published ML researcher (IEEE MIGARS 2026), and full-stack developer. Passionate about machine learning, remote sensing, and building impactful products.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sahil Kumar | ML Researcher & Full Stack Developer',
    description:
      'Portfolio of Sahil Kumar — B.Tech ECE student at IIIT Allahabad, published ML researcher (IEEE MIGARS 2026), and full-stack developer. Passionate about machine learning, remote sensing, and building impactful products.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
