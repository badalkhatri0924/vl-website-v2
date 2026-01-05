import { client } from './client'
import { blogPostsQuery, blogPostBySlugQuery, blogPostSlugsQuery } from './queries'

export interface SanityBlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  author: {
    name: string
    title: string
    avatar: string
  }
  publishedAt: string
  category: string
  readTime: string
  imageUrl: string
  content: any[]
  tags?: string[]
}

export async function getBlogPosts(): Promise<SanityBlogPost[]> {
  return await client.fetch(blogPostsQuery)
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  return await client.fetch(blogPostBySlugQuery, { slug })
}

export async function getBlogPostSlugs(): Promise<{ slug: string }[]> {
  return await client.fetch(blogPostSlugsQuery)
}

// Helper function to format date
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

