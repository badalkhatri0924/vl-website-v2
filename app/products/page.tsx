import type { Metadata } from 'next'
import ProductsView from '@/components/ProductsView'

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Explore Version Labs products including DocXpert, Felloz, and UnCloud—built to power modern digital workflows, collaboration, and privacy-first tooling.',
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

