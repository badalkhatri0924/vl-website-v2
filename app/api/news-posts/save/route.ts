import { NextRequest, NextResponse } from 'next/server'
import { addNewPostBatch, type SourceArticle } from '@/lib/newPosts'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const newsCategory = typeof body.newsCategory === 'string' ? body.newsCategory.trim() : ''
    const newsUrl = typeof body.newsUrl === 'string' ? body.newsUrl.trim() : ''
    const posts = Array.isArray(body.posts)
      ? body.posts
          .map((p: { content?: string; hook?: string; sourceArticleIndex?: number }) => {
            const content = typeof p?.content === 'string' ? p.content : ''
            const hook = typeof p?.hook === 'string' ? p.hook : undefined
            const raw = p?.sourceArticleIndex
            const sourceArticleIndex =
              typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : undefined
            return { content, hook, sourceArticleIndex }
          })
          .filter((p: { content: string }) => p.content.length > 0)
      : []
    const sourceArticles: SourceArticle[] = Array.isArray(body.sourceArticles)
      ? body.sourceArticles
          .map((a: { title?: string; link?: string }) => ({
            title: typeof a?.title === 'string' ? a.title : '',
            link: typeof a?.link === 'string' ? a.link : '',
          }))
          .filter((a: SourceArticle) => a.title && a.link)
      : []

    if (!newsCategory || !newsUrl || posts.length === 0) {
      return NextResponse.json(
        { error: 'newsCategory, newsUrl, and at least one post are required.' },
        { status: 400 }
      )
    }

    const batch = await addNewPostBatch({ newsCategory, newsUrl, sourceArticles, posts })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving news posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
