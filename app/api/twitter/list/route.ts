import { NextResponse } from 'next/server'
import { getTwitterPostBatches } from '@/lib/twitterPosts'

export async function GET() {
  try {
    const batches = await getTwitterPostBatches()
    return NextResponse.json({ success: true, batches })
  } catch (err) {
    console.error('Error listing Twitter posts:', err)
    return NextResponse.json(
      { error: 'Failed to load Twitter posts', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
