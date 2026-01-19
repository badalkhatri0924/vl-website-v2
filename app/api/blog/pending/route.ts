import { NextResponse } from 'next/server'
import { getPendingBlogPosts } from '@/lib/pendingBlogs'

/**
 * GET endpoint to retrieve all pending blog posts
 */
export async function GET() {
  try {
    const pendingPosts = await getPendingBlogPosts()
    return NextResponse.json({
      success: true,
      posts: pendingPosts,
    })
  } catch (error) {
    console.error('Error fetching pending blog posts:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch pending blog posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
