import './globals.css'
import { Suspense } from 'react'
import Loading from './loading'
import { Darker_Grotesque } from 'next/font/google'

const darkerGrotesque = Darker_Grotesque({subsets: ['latin']})

export const metadata = {
  title: 'Amedeo Majer - Software Engineer',
  description: 'My personal portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Suspense fallback={<Loading />}>
        <body className={darkerGrotesque.className}>{children}</body>
      </Suspense>
    </html>
  )
}
