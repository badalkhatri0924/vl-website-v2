import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductPostView from '@/components/ProductPostView'
import { PRODUCTS } from '@/data/products'

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.id,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = PRODUCTS.find((p) => p.id === slug)

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be found.',
    }
  }

  const title = `${product.name} – ${product.tagline}`
  const description = product.description
  const url = `/products/${product.id}`
  const imageUrl = product.imageUrl

  return {
    title,
    description,
    keywords: [
      product.name,
      product.tagline,
      product.category,
      'Version Labs',
      'product',
      'software',
      'SaaS',
      ...product.features,
      ...(product.id === 'docxpert'
        ? [
            'DocXpert OCR',
            'document OCR platform',
            'handwritten text recognition',
            'PDF OCR software',
            'multilingual OCR translation',
            'document processing platform',
            'legal document OCR',
            'scan to text',
            'AI document processing',
            'enterprise OCR solution',
          ]
        : []),
      ...(product.id === 'felloz'
        ? [
            'Felloz',
            'workplace community platform',
            'team collaboration software',
            'community-driven workflows',
            'async collaboration tool',
            'modern workspace platform',
            'remote team collaboration',
            'community-first work platform',
            'digital workspace',
            'team communication and context',
          ]
        : []),
      ...(product.id === 'uncloud'
        ? [
            'UnCloud',
            'online privacy tools',
            'client-side privacy tools',
            'browser based tools',
            'local PDF tools',
            'offline PDF editor',
            'image compression tool',
            'file conversion tools',
            'no upload PDF tools',
            'privacy first toolkit',
            'local-first productivity tools',
          ]
        : []),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.id === slug)
  
  if (!product) {
    notFound()
  }
  
  return <ProductPostView product={product} />
}

