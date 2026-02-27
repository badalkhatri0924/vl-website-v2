import { NextRequest, NextResponse } from 'next/server'
import { deleteLinkedInPost, deleteLinkedInPostBatch } from '@/lib/linkedinPosts'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const batchId = typeof body.batchId === 'string' ? body.batchId.trim() : ''
    const postIndex = typeof body.postIndex === 'number' ? body.postIndex : undefined

    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required.' }, { status: 400 })
    }

    if (postIndex === undefined) {
      await deleteLinkedInPostBatch(batchId)
    } else {
      await deleteLinkedInPost(batchId, postIndex)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting LinkedIn post:', err)
    return NextResponse.json(
      { error: 'Failed to delete', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
