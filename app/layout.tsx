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
    default: 'VersionLabs',
    template: '%s | VersionLabs',
  },
  description: 'Premium enterprise-grade platforms for government and national learning missions by VersionLabs, featuring AI-powered citizen services and secure digital solutions.',
  keywords: [
    'VersionLabs',
    'government platforms',
    'national learning missions',
    'AI-powered citizen services',
    'digital infrastructure',
    'LMS',
    'learning management system',
    'government portal',
    'digital governance',
    'e-governance',
  ],
  authors: [{ name: 'VersionLabs' }],
  creator: 'VersionLabs',
  publisher: 'VersionLabs',
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
    siteName: 'VersionLabs',
    title: 'VersionLabs',
    description: 'Premium enterprise-grade platforms for government and national learning missions by VersionLabs, featuring AI-powered citizen services and secure digital solutions.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/happy-new-year.webp?alt=media',
        width: 1200,
        height: 630,
        alt: 'VersionLabs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VersionLabs',
    description: 'Premium enterprise-grade platforms for government and national learning missions by VersionLabs, featuring AI-powered citizen services and secure digital solutions.',
    images: ['https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/happy-new-year.webp?alt=media'],
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

