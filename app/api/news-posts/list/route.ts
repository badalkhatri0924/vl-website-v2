import { NextResponse } from 'next/server'
import { getNewPostBatches } from '@/lib/newPosts'

export async function GET() {
  try {
    const batches = await getNewPostBatches()
    return NextResponse.json({ success: true, batches })
  } catch (err) {
    console.error('Error listing news posts:', err)
    return NextResponse.json(
      { error: 'Failed to load news posts', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
