import { Oswald } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import Loading from './loading'

const oswald = Oswald({ subsets: ['latin'] })

export const metadata = {
  title: 'Amedeo Majer - Software Engineer',
  description: 'Amedeo Majer personal portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Suspense fallback={<Loading />}>
        <body className={oswald.className}>{children}</body>
      </Suspense>
    </html>
  )
}
