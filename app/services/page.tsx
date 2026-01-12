import ServicesView from '@/components/ServicesView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Government Digital Solutions & National LMS | Version Labs',
  description: 'Expertly architected National LMS platforms, AI integration services, and strategic government portals. Built for 100k+ concurrent users with 99.99% uptime. Enterprise-grade security.',
  openGraph: {
    title: 'Government Digital Solutions & National LMS | Version Labs',
    description: 'Expertly architected National LMS platforms, AI integration services, and strategic government portals. Built for 100k+ concurrent users with 99.99% uptime. Enterprise-grade security.',
    url: 'https://versionlabs.co/services',
  },
  twitter: {
    title: 'Government Digital Solutions & National LMS | Version Labs',
    description: 'Expertly architected National LMS platforms, AI integration services, and strategic government portals. Built for 100k+ concurrent users with 99.99% uptime. Enterprise-grade security.',
  },
}

export default function ServicesPage() {
  return <ServicesView />
}

