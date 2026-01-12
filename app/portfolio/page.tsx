import PortfolioView from '@/components/PortfolioView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | Government Digital Transformation Projects',
  description: 'Explore Version Labs portfolio of enterprise digital infrastructure projects. National LMS platforms, government portals, and AI-powered citizen services transforming nations.',
  openGraph: {
    title: 'Portfolio | Government Digital Transformation Projects',
    description: 'Explore Version Labs portfolio of enterprise digital infrastructure projects. National LMS platforms, government portals, and AI-powered citizen services.',
    url: 'https://versionlabs.co/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioView />
}

