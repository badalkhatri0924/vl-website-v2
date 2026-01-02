import { notFound } from 'next/navigation'
import ProductPostView from '@/components/ProductPostView'
import { PRODUCTS } from '@/data/products'

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.id,
  }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = PRODUCTS.find(p => p.id === slug)
  
  if (!product) {
    notFound()
  }
  
  return <ProductPostView product={product} />
}

