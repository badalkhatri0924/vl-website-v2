import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
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
  title: {
    default: 'Digital Infrastructure for Government | Version Labs',
    template: '%s | Version Labs',
  },
  description: 'Building enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals. Transform at scale.',
  keywords: [
    'Version Labs',
    'digital infrastructure for government',
    'national learning management system',
    'AI-powered citizen services',
    'government portal development',
    'enterprise digital transformation',
    'e-governance solutions',
    'nation-scale digital platforms',
    'LMS',
    'learning management system',
    'government portal',
    'digital governance',
    'national LMS architecture',
    'AI integration services',
    'strategic government portals',
  ],
  authors: [{ name: 'Version Labs' }],
  creator: 'Version Labs',
  publisher: 'Version Labs',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://versionlabs.co',
    siteName: 'Version Labs',
    title: 'Digital Infrastructure for Government | Version Labs',
    description: 'Building enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals. Transform at scale.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media',
        width: 1200,
        height: 630,
        alt: 'VersionLabs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Infrastructure for Government | Version Labs',
    description: 'Building enterprise-grade digital infrastructure for modern nations. National LMS platforms, AI-powered citizen services, and secure government portals. Transform at scale.',
    images: ['https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media'],
    creator: '@versionlabs',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://versionlabs.co'),
  alternates: {
    canonical: '/',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${manrope.variable} min-h-screen selection:bg-accent selection:text-white bg-white overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="noise"></div>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        {/* <Chatbot /> */}
      </body>
    </html>
  )
}

