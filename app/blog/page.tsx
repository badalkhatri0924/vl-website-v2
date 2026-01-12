import BlogView from '@/components/BlogView'
import { getBlogPosts } from '@/lib/sanity/utils'
import type { Metadata } from 'next'

// Enable ISR: revalidate every minute (60 seconds)
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog | Digital Infrastructure & E-Governance Insights',
  description: 'Expert insights on national LMS architecture, AI-powered citizen services, government portal development, and enterprise digital transformation strategies.',
  openGraph: {
    title: 'Blog | Digital Infrastructure & E-Governance Insights',
    description: 'Expert insights on national LMS architecture, AI-powered citizen services, government portal development, and enterprise digital transformation.',
    url: 'https://versionlabs.co/blog',
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogView posts={posts} />
}

