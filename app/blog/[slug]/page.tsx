import { notFound } from 'next/navigation'
import BlogPostView from '@/components/BlogPostView'
import { BLOG_POSTS } from '@/data/blogPosts'

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.id,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => p.id === slug)
  
  if (!post) {
    notFound()
  }
  
  return <BlogPostView post={post} />
}

