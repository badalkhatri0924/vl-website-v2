import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import BlogPostView from '@/components/BlogPostView'
import { getBlogPostBySlug, getBlogPostSlugs } from '@/lib/sanity/utils'
import { urlFor } from '@/lib/sanity/image'

// Enable ISR: revalidate every 10 seconds
export const revalidate = 10

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://versionlabs.co'
  const postUrl = `${siteUrl}/blog/${slug}`
  
  // Build optimized Open Graph image URL (1200x630 is the recommended size)
  let ogImage: string
  
  // Try to use Sanity image URL builder for optimization if mainImage is available
  if (post.mainImage) {
    try {
      // Use Sanity image URL builder to optimize for Open Graph
      ogImage = urlFor(post.mainImage)
        .width(1200)
        .height(630)
        .fit('fill')
        .format('jpg')
        .url()
      
      // Ensure the URL is absolute (Sanity URLs might be protocol-relative)
      if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
        if (ogImage.startsWith('//')) {
          ogImage = `https:${ogImage}`
        } else {
          ogImage = `https://${ogImage}`
        }
      }
      
      // Double-check: if the URL doesn't have our optimization params, add them manually
      if (ogImage.includes('cdn.sanity.io') && !ogImage.includes('w=1200')) {
        try {
          const url = new URL(ogImage)
          // Remove existing params that might conflict
          url.searchParams.delete('rect')
          url.searchParams.set('w', '1200')
          url.searchParams.set('h', '630')
          url.searchParams.set('fit', 'fill')
          url.searchParams.set('fm', 'jpg')
          ogImage = url.toString()
        } catch (e) {
          // If URL parsing fails, keep the original
          console.warn('Failed to add optimization params:', e)
        }
      }
    } catch (error) {
      console.error('Error building image URL with urlFor:', error)
      // Fallback to direct URL
      ogImage = post.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media'
    }
  } else if (post.imageUrl) {
    // Use direct imageUrl from Sanity and optimize it
    ogImage = post.imageUrl
    
    // If it's a Sanity CDN URL, add optimization parameters
    if (ogImage.includes('cdn.sanity.io')) {
      // Extract the base URL and add transformation parameters
      try {
        const url = new URL(ogImage)
        url.searchParams.set('w', '1200')
        url.searchParams.set('h', '630')
        url.searchParams.set('fit', 'fill')
        url.searchParams.set('fm', 'jpg')
        ogImage = url.toString()
      } catch (e) {
        // If URL parsing fails, use original URL
        console.warn('Failed to parse image URL for optimization:', e)
      }
    }
    
    // Ensure the URL is absolute
    if (ogImage && !ogImage.startsWith('http://') && !ogImage.startsWith('https://')) {
      if (ogImage.startsWith('//')) {
        ogImage = `https:${ogImage}`
      } else {
        ogImage = `https://${ogImage}`
      }
    }
  } else {
    // Final fallback to default image
    ogImage = 'https://firebasestorage.googleapis.com/v0/b/versionlabs-official.firebasestorage.app/o/versionlabs-meta-image.webp?alt=media'
  }
  
  // Ensure ogImage is an absolute URL
  const absoluteOgImage = ogImage.startsWith('http://') || ogImage.startsWith('https://')
    ? ogImage
    : ogImage.startsWith('//')
    ? `https:${ogImage}`
    : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`
  
  // Debug logging (remove in production if needed)
  if (process.env.NODE_ENV === 'development') {
    console.log('Blog Post OG Image Debug:', {
      slug,
      hasMainImage: !!post.mainImage,
      imageUrl: post.imageUrl,
      finalOgImage: absoluteOgImage,
    })
  }
  
  return {
    metadataBase: new URL(siteUrl),
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'VersionLabs',
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [absoluteOgImage],
      creator: '@versionlabs',
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  
  if (!post) {
    notFound()
  }
  
  return <BlogPostView post={post} />
}

