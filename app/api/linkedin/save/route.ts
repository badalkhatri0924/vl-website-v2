import { NextRequest, NextResponse } from 'next/server'
import { addLinkedInPostBatch, type LinkedInPostItem } from '@/lib/linkedinPosts'
import { generateImageForShortContent } from '@/lib/content/imageHandler'
import { uploadLinkedInPostImage } from '@/lib/firebase/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const productName = typeof body.productName === 'string' ? body.productName.trim() : ''
    const productUrl = typeof body.productUrl === 'string' ? body.productUrl.trim() : ''
    const posts: LinkedInPostItem[] = Array.isArray(body.posts)
      ? body.posts
          .map((p: { content?: string; hook?: string }) => ({
            content: typeof p?.content === 'string' ? p.content : '',
            hook: typeof p?.hook === 'string' ? p.hook : undefined,
          }))
          .filter((p: LinkedInPostItem) => p.content.length > 0)
      : []

    if (!productName || !productUrl || posts.length === 0) {
      return NextResponse.json(
        { error: 'productName, productUrl, and at least one post are required.' },
        { status: 400 }
      )
    }

    // Generate one image per LinkedIn post based on its own content, upload to Storage, and store only the URL.
    const postsWithImages: LinkedInPostItem[] = await Promise.all(
      posts.map(async (post: LinkedInPostItem) => {
        let imageUrl: string | null = null
        try {
          const baseText = post.hook || (post.content ? String(post.content).slice(0, 120) : undefined)
          if (baseText) {
            const generatedUrl = await generateImageForShortContent(baseText, {
              contextLabel: 'LinkedIn product post',
            })

            if (generatedUrl && generatedUrl.startsWith('data:')) {
              const [meta, base64Data] = generatedUrl.split(',')
              const mimeMatch = meta.match(/data:(.+);base64/)
              const mimeType = mimeMatch?.[1] || 'image/png'
              const buffer = Buffer.from(base64Data, 'base64')

              imageUrl = await uploadLinkedInPostImage(buffer, mimeType)
            } else {
              imageUrl = generatedUrl
            }
          }
        } catch (imageError) {
          console.warn('Failed to generate image for LinkedIn post:', imageError)
        }

        const safePost: LinkedInPostItem = {
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

    const batch = await addLinkedInPostBatch({ productName, productUrl, posts: postsWithImages })
    return NextResponse.json({ success: true, batch })
  } catch (err) {
    console.error('Error saving LinkedIn posts:', err)
    return NextResponse.json(
      { error: 'Failed to save', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
