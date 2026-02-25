import { NextRequest, NextResponse } from 'next/server'
import { getPendingBlogPost, updatePendingBlogPost } from '@/lib/pendingBlogs'

/**
 * POST /api/blog/linkedin-copy
 * Body: { postId: string, copiedBy: string }
 * Records that the user copied the LinkedIn content. First copy wins (like linkedin product flow).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const postId = typeof body.postId === 'string' ? body.postId.trim() : ''
    const copiedBy = typeof body.copiedBy === 'string' ? body.copiedBy.trim() : ''

    if (!postId || !copiedBy) {
      return NextResponse.json(
        { error: 'postId and copiedBy are required.' },
        { status: 400 }
      )
    }

    const post = await getPendingBlogPost(postId)
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (!post.linkedInContent) {
      return NextResponse.json(
        { error: 'No LinkedIn content to copy' },
        { status: 400 }
      )
    }

    // First copy wins - if already copied by someone, return 409
    if (post.copiedBy?.trim()) {
      return NextResponse.json(
        { error: 'already_claimed', message: 'This content was already copied by another team member.' },
        { status: 409 }
      )
    }

    const copiedAt = new Date().toISOString()
    const updated = await updatePendingBlogPost(postId, { copiedBy, copiedAt })

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to save copy record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Blog LinkedIn copy error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save copy.' },
      { status: 500 }
    )
  }
}
