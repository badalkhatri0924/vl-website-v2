import { NextRequest, NextResponse } from 'next/server'
import { getPendingBlogPost, removePendingBlogPost } from '@/lib/pendingBlogs'
import { createBlogPost } from '@/lib/sanity/writeClient'

/**
 * POST endpoint to approve a pending blog post and send it to Sanity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pendingId, publishStatus = 'draft' } = body

    if (!pendingId) {
      return NextResponse.json(
        { error: 'pendingId is required' },
        { status: 400 }
      )
    }

    // Get the pending post
    const pendingPost = await getPendingBlogPost(pendingId)
    if (!pendingPost) {
      return NextResponse.json(
        { error: 'Pending blog post not found' },
        { status: 404 }
      )
    }

    // Set published date based on publish status
    const publishedAt = publishStatus === 'published' 
      ? new Date().toISOString()
      : undefined

    // Create the post in Sanity
    const postId = await createBlogPost({
      title: pendingPost.title,
      slug: pendingPost.slug,
      authorId: pendingPost.authorId,
      category: pendingPost.category,
      excerpt: pendingPost.excerpt,
      readTime: pendingPost.readTime,
      body: pendingPost.bodyPortableText,
      tags: pendingPost.tags,
      publishedAt,
      mainImageAssetId: pendingPost.imageAssetId,
      publishStatus: publishStatus as 'draft' | 'published',
    })

    // Remove from pending
    await removePendingBlogPost(pendingId)

    return NextResponse.json({
      success: true,
      postId,
      slug: pendingPost.slug,
      title: pendingPost.title,
      status: publishStatus,
      message: `Blog post "${pendingPost.title}" approved and published to Sanity`,
    })
  } catch (error) {
    console.error('Error approving blog post:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to approve blog post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
