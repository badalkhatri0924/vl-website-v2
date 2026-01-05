import BlogView from '@/components/BlogView'
import { getBlogPosts } from '@/lib/sanity/utils'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogView posts={posts} />
}

