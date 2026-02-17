import { NextResponse } from 'next/server'
import { getLinkedInPostBatches } from '@/lib/linkedinPosts'

export async function GET() {
  try {
    const batches = await getLinkedInPostBatches()
    return NextResponse.json({ success: true, batches })
  } catch (err) {
    console.error('Error listing LinkedIn posts:', err)
    return NextResponse.json(
      { error: 'Failed to load LinkedIn posts', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
