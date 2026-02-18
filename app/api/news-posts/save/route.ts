import { NextRequest, NextResponse } from 'next/server'
import { addNewPostBatch } from '@/lib/newPosts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const newsCategory = typeof body.newsCategory === 'string' ? body.newsCategory.trim() : ''
    const newsUrl = typeof body.newsUrl === 'string' ? body.newsUrl.trim() : ''
    const posts = Array.isArray(body.posts)
      ? body.posts
          .map((p: { content?: string; hook?: string }) => ({
            content: typeof p?.content === 'string' ? p.content : '',
            hook: typeof p?.hook === 'string' ? p.hook : undefined,
          }))
          .filter((p: { content: string; hook?: string }) => p.content.length > 0)
      : []

    if (!newsCategory || !newsUrl || posts.length === 0) {
      return NextResponse.json(
        { error: 'newsCategory, newsUrl, and at least one post are required.' },
        { status: 400 }
      )
    }

    const batch = await addNewPostBatch({ newsCategory, newsUrl, posts })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving news posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
