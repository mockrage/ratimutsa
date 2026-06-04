import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ratimutsafarm.com'),
  title: {
    default: 'Ratimutsa Farm — Premium Agricultural Marketplace',
    template: '%s | Ratimutsa Farm',
  },
  description: 'Experience the finest farm-fresh produce from Ratimutsa Farm. Premium broilers, eggs, vegetables, beef, pork, fish, and more — delivered with care from our fields to your table.',
  keywords: [
    'farm',
    'organic',
    'fresh produce',
    'broilers',
    'eggs',
    'vegetables',
    'premium',
    'marketplace',
    'Zimbabwe farm',
    'farm fresh',
    'B2B agriculture',
    'B2C produce',
    'chicken',
    'beef',
    'pork',
    'fish',
    'tomatoes',
    'peppers',
    'cucumbers',
    'Ratimutsa',
  ],
  authors: [{ name: 'Ratimutsa Farm' }],
  creator: 'Ratimutsa Farm',
  publisher: 'Ratimutsa Farm',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Ratimutsa Farm',
    title: 'Ratimutsa Farm — Premium Agricultural Marketplace',
    description: 'Experience the finest farm-fresh produce from Ratimutsa Farm. Premium broilers, eggs, vegetables, and more — delivered with care from our fields to your table.',
    images: [
      {
        url: '/images/hero-farm.png',
        width: 1200,
        height: 630,
        alt: 'Ratimutsa Farm - Premium Agricultural Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ratimutsa Farm — Premium Agricultural Marketplace',
    description: 'Experience the finest farm-fresh produce from Ratimutsa Farm. Premium broilers, eggs, vegetables, and more.',
    images: ['/images/hero-farm.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://ratimutsafarm.com'} />
      </head>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
