import type { Metadata } from 'next'
import ProductsView from '@/components/ProductsView'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Explore Version Labs products including DocXpert, Felloz, and UnCloud—built to power modern digital workflows, collaboration, and privacy-first tooling.',
  keywords: [
    'Version Labs products',
    'DocXpert',
    'Felloz',
    'UnCloud',
    'Version Labs DocXpert',
    'Version Labs Felloz',
    'Version Labs UnCloud',
    'document processing platform',
    'OCR platform',
    'multilingual OCR',
    'enterprise OCR software',
    'AI document processing',
    'PDF OCR tool',
    'workplace community platform',
    'team collaboration',
    'community-driven workflows',
    'remote team collaboration',
    'async collaboration platform',
    'online privacy tools',
    'client-side tools',
    'browser-based tools',
    'no upload PDF tools',
    'local-first tools',
    'privacy-first productivity tools',
    'global SaaS products',
    'worldwide document processing tools',
    'global collaboration platform',
    'worldwide online privacy tools',
    'product portfolio',
    'digital infrastructure products',
  ],
  openGraph: {
    title: 'Products | Version Labs',
    description:
      'Discover Version Labs products: DocXpert for document processing, Felloz for community-first workspaces, and UnCloud for privacy-first browser tools.',
    url: '/products',
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media',
        width: 1200,
        height: 630,
        alt: 'Version Labs Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Version Labs',
    description:
      'Discover Version Labs products: DocXpert for document processing, Felloz for community-first workspaces, and UnCloud for privacy-first browser tools.',
    images: [
      'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media',
    ],
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsPage() {
  return <ProductsView />
}

