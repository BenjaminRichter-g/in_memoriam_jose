import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'In Memoriam - Jose',
  description: 'A memorial website celebrating the life and memories of Jose',
  keywords: ['memorial', 'remembrance', 'tribute'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen memorial-gradient">
          {children}
        </div>
      </body>
    </html>
  )
} 