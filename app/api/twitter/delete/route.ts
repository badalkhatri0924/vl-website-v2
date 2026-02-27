import { NextRequest, NextResponse } from 'next/server'
import { deleteTwitterPost, deleteUnclaimedTwitterPosts } from '@/lib/twitterPosts'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const batchId = typeof body.batchId === 'string' ? body.batchId.trim() : ''
    const postIndex = typeof body.postIndex === 'number' ? body.postIndex : undefined

    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required.' }, { status: 400 })
    }

    if (postIndex === undefined) {
      // Batch delete: removes unclaimed posts, keeps claimed ones
      await deleteUnclaimedTwitterPosts(batchId)
    } else {
      await deleteTwitterPost(batchId, postIndex)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting Twitter post:', err)
    return NextResponse.json(
      { error: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
