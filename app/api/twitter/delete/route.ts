import { NextRequest, NextResponse } from 'next/server'
import { deleteTwitterPost } from '@/lib/twitterPosts'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const batchId = typeof body.batchId === 'string' ? body.batchId.trim() : ''
    const postIndex = typeof body.postIndex === 'number' ? body.postIndex : -1

    if (!batchId || postIndex < 0) {
      return NextResponse.json({ error: 'batchId and postIndex are required.' }, { status: 400 })
    }

    await deleteTwitterPost(batchId, postIndex)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting Twitter post:', err)
    return NextResponse.json(
      { error: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
