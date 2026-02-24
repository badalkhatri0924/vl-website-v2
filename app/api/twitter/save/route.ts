import { NextRequest, NextResponse } from 'next/server'
import { addTwitterPostBatch } from '@/lib/twitterPosts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const productName = typeof body.productName === 'string' ? body.productName.trim() : ''
    const productUrl = typeof body.productUrl === 'string' ? body.productUrl.trim() : ''
    const posts = Array.isArray(body.posts)
      ? body.posts
          .map((p: { content?: string; hook?: string }) => ({
            content: typeof p?.content === 'string' ? p.content : '',
            hook: typeof p?.hook === 'string' ? p.hook : undefined,
          }))
          .filter((p: { content: string; hook?: string }) => p.content.length > 0)
      : []

    if (!productName || !productUrl || posts.length === 0) {
      return NextResponse.json(
        { error: 'productName, productUrl, and at least one post are required.' },
        { status: 400 }
      )
    }

    const batch = await addTwitterPostBatch({ productName, productUrl, posts })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving Twitter posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
