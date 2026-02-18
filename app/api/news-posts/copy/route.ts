import { NextRequest, NextResponse } from 'next/server'
import { claimNewPostCopy } from '@/lib/newPosts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const batchId = typeof body.batchId === 'string' ? body.batchId.trim() : ''
    const postIndex = typeof body.postIndex === 'number' ? body.postIndex : NaN
    const copiedBy = typeof body.copiedBy === 'string' ? body.copiedBy.trim() : ''

    if (!batchId || Number.isNaN(postIndex) || postIndex < 0 || !copiedBy) {
      return NextResponse.json(
        { error: 'batchId, postIndex (number), and copiedBy are required.' },
        { status: 400 }
      )
    }

    const claimed = await claimNewPostCopy(batchId, postIndex, copiedBy)
    if (!claimed) {
      return NextResponse.json(
        { error: 'already_claimed', message: 'This content was already copied by another team member.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error claiming news post copy:', err)
    return NextResponse.json(
      { error: 'Failed to save copy.', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
