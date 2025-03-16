import './globals.css';
import { Suspense } from 'react';
import Loading from './loading';
import { Darker_Grotesque } from 'next/font/google';
import { cn } from '@/lib/utils';

const darkerGrotesque = Darker_Grotesque({ subsets: ['latin'] });

export const metadata = {
  title: 'Amedeo Majer',
  description: 'My personal portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
