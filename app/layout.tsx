import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
// import Chatbot from '@/components/Chatbot'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '400', '600', '800'],
})

export const metadata: Metadata = {
  title: 'VersionLabs | Sovereign Digital Infrastructure',
  description: 'Premium enterprise-grade platforms for government and national learning missions by VersionLabs, featuring AI-powered citizen services and secure digital infrastructure.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} min-h-screen selection:bg-accent selection:text-white bg-white overflow-x-hidden`}>
        <div className="noise"></div>
        <Header />
        <main className="animate-in fade-in duration-1000">
          {children}
        </main>
        <Footer />
        {/* <Chatbot /> */}
      </body>
    </html>
  )
}

