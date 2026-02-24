import { NextRequest, NextResponse } from 'next/server'
import { addNewPostBatch, type SourceArticle } from '@/lib/newPosts'
import { generateImageForShortContent } from '@/lib/content/imageHandler'
import { uploadNewsPostImage } from '@/lib/firebase/storage'

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

    // Generate one image per news-based LinkedIn post, based on its own content, and upload to Storage.
    const postsWithImages = await Promise.all(
      posts.map(async (post: { content: string; hook?: string; sourceArticleIndex?: number }) => {
        let imageUrl: string | null = null
        try {
          const baseText = post.hook || (post.content ? String(post.content).slice(0, 120) : undefined)
          if (baseText) {
            const generatedUrl = await generateImageForShortContent(baseText, {
              contextLabel: 'News LinkedIn post',
            })

            if (generatedUrl && generatedUrl.startsWith('data:')) {
              const [meta, base64Data] = generatedUrl.split(',')
              const mimeMatch = meta.match(/data:(.+);base64/)
              const mimeType = mimeMatch?.[1] || 'image/png'
              const buffer = Buffer.from(base64Data, 'base64')

              imageUrl = await uploadNewsPostImage(buffer, mimeType)
            } else {
              imageUrl = generatedUrl
            }
          }
        } catch (imageError) {
          console.warn('Failed to generate image for news post:', imageError)
        }

        const safePost: {
          content: string
          hook?: string
          sourceArticleIndex?: number
          imageUrl?: string
        } = {
          content: post.content,
        }

        if (post.hook && post.hook.trim()) {
          safePost.hook = post.hook.trim()
        }
        if (typeof post.sourceArticleIndex === 'number' && Number.isFinite(post.sourceArticleIndex)) {
          safePost.sourceArticleIndex = Math.floor(post.sourceArticleIndex)
        }
        if (imageUrl && imageUrl.trim()) {
          safePost.imageUrl = imageUrl.trim()
        }

        return safePost
      })
    )

    const batch = await addNewPostBatch({ newsCategory, newsUrl, sourceArticles, posts: postsWithImages })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving news posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
