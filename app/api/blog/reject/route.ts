import { NextRequest, NextResponse } from 'next/server'
import { getPendingBlogPost, removePendingBlogPost } from '@/lib/pendingBlogs'

/**
 * POST endpoint to reject a pending blog post
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pendingId } = body

    if (!pendingId) {
      return NextResponse.json(
        { error: 'pendingId is required' },
        { status: 400 }
      )
    }

    // Check if the pending post exists
    const pendingPost = await getPendingBlogPost(pendingId)
    if (!pendingPost) {
      return NextResponse.json(
        { error: 'Pending blog post not found' },
        { status: 404 }
      )
    }

    // Remove from pending
    const removed = await removePendingBlogPost(pendingId)
    if (!removed) {
      return NextResponse.json(
        { error: 'Failed to remove pending blog post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Blog post "${pendingPost.title}" rejected and removed`,
    })
  } catch (error) {
    console.error('Error rejecting blog post:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to reject blog post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
