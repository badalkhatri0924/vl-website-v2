import { NextRequest, NextResponse } from 'next/server'
import { addTwitterPostBatch, type TwitterPostItem } from '@/lib/twitterPosts'
import { generateImageForShortContent } from '@/lib/content/imageHandler'
import { uploadTwitterPostImage } from '@/lib/firebase/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const productName = typeof body.productName === 'string' ? body.productName.trim() : ''
    const productUrl = typeof body.productUrl === 'string' ? body.productUrl.trim() : ''
    const posts: TwitterPostItem[] = Array.isArray(body.posts)
      ? body.posts
          .map((p: { content?: string; hook?: string }) => ({
            content: typeof p?.content === 'string' ? p.content : '',
            hook: typeof p?.hook === 'string' ? p.hook : undefined,
          }))
          .filter((p: TwitterPostItem) => p.content.length > 0)
      : []

    if (!productName || !productUrl || posts.length === 0) {
      return NextResponse.json(
        { error: 'productName, productUrl, and at least one post are required.' },
        { status: 400 }
      )
    }

    // Generate one image per tweet based on its own content using Gemini (data URLs only, fallback to Unsplash/placeholder).
    const postsWithImages: TwitterPostItem[] = await Promise.all(
      posts.map(async (post: TwitterPostItem) => {
        let imageUrl: string | null = null
        try {
          const baseText = post.hook || (post.content ? String(post.content).slice(0, 120) : undefined)
          if (baseText) {
            const generatedUrl = await generateImageForShortContent(baseText, {
              contextLabel: 'Twitter product post',
            })
            if (generatedUrl && generatedUrl.startsWith('data:')) {
              // Extract mime type and base64 data from data URL
              const [meta, base64Data] = generatedUrl.split(',')
              const mimeMatch = meta.match(/data:(.+);base64/)
              const mimeType = mimeMatch?.[1] || 'image/png'
              const buffer = Buffer.from(base64Data, 'base64')

              // Upload to Firebase Storage and use the resulting download URL
              imageUrl = await uploadTwitterPostImage(buffer, mimeType)
            } else {
              imageUrl = generatedUrl
            }
          }
        } catch (imageError) {
          console.warn('Failed to generate image for Twitter post:', imageError)
        }

        // Build a plain Firestore-safe object: no undefined fields
        const safePost: TwitterPostItem = {
          content: post.content,
        }
        if (post.hook && post.hook.trim()) {
          safePost.hook = post.hook.trim()
        }
        if (imageUrl && imageUrl.trim()) {
          safePost.imageUrl = imageUrl.trim()
        }

        return safePost
      })
    )

    const batch = await addTwitterPostBatch({ productName, productUrl, posts: postsWithImages })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving Twitter posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
