import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import { Darker_Grotesque } from 'next/font/google';
import { cn } from '@/lib/utils';

const darkerGrotesque = Darker_Grotesque({ subsets: ['latin'] });

export const metadata = {
  title: 'Amedeo Majer - Full-Stack Web Developer',
  description: 'Full-stack web developer specializing in clean, maintainable code and clear communication. Experienced with React, Next.js, Ruby on Rails, and modern web technologies.',
  keywords: [
    'full-stack developer',
    'web developer',
    'React developer',
    'Next.js developer',
    'Ruby on Rails developer',
    'TypeScript developer',
    'frontend developer',
    'backend developer',
    'software engineer',
    'portfolio',
    'Amedeo Majer'
  ].join(', '),
  authors: [{ name: 'Amedeo Majer' }],
  creator: 'Amedeo Majer',
  publisher: 'Amedeo Majer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://amedeomajer.it'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Amedeo Majer - Full-Stack Web Developer',
    description: 'Full-stack web developer specializing in clean, maintainable code and clear communication. Experienced with React, Next.js, Ruby on Rails, and modern web technologies.',
    url: 'https://amedeomajer.it',
    siteName: 'Amedeo Majer Portfolio',
    images: [
      {
        url: '/images/amepng.png',
        width: 1200,
        height: 630,
        alt: 'Amedeo Majer - Full-Stack Web Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amedeo Majer - Full-Stack Web Developer',
    description: 'Full-stack web developer specializing in clean, maintainable code and clear communication.',
    images: ['/images/amedeo.png'],
    creator: '@amedeomajer',
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
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
      </head>
      <Suspense fallback={<Loading />}>
        <body
          className={cn(
            darkerGrotesque.className,
            'bg-dark-holographic bg-cover bg-center bg-no-repeat bg-fixed'
          )}
        >
          {children}
        </body>
      </Suspense>
    </html>
  );
}
