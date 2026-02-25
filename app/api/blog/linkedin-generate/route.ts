import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { getPendingBlogPost, updatePendingBlogPost } from '@/lib/pendingBlogs'
import { buildLinkedInBlogPrompt } from '@/lib/linkedinPrompt'

function getBodySummary(post: Awaited<ReturnType<typeof getPendingBlogPost>>): string {
  if (!post) return ''
  // Use excerpt as primary; add truncated body for more context
  const parts: string[] = [post.excerpt || '']
  if (post.body && typeof post.body === 'string') {
    const raw = post.body.trim()
    if (raw && !raw.startsWith('{')) {
      parts.push(raw.slice(0, 800))
    }
  }
  return parts.filter(Boolean).join('\n\n')
}

/**
 * POST /api/blog/linkedin-generate
 * Body: { postId: string }
 * Returns: { success: true, content: string }
 * Requires the blog to be published (has publishedUrl).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const postId = typeof body.postId === 'string' ? body.postId.trim() : ''

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }

    const post = await getPendingBlogPost(postId)
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (post.publishStatus !== 'published' || !post.publishedUrl) {
      return NextResponse.json(
        { error: 'Blog must be published before generating LinkedIn content' },
        { status: 400 }
      )
    }

    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY is not configured. Cannot generate content.' },
        { status: 500 }
      )
    }

    const bodySummary = getBodySummary(post)
    const prompt = buildLinkedInBlogPrompt({
      title: post.title,
      excerpt: post.excerpt || '',
      bodySummary,
      blogUrl: post.publishedUrl,
      tags: post.tags,
    })

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    })

    const responseText = (response.text || '').trim()
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    const content = typeof parsed?.content === 'string' ? parsed.content : ''

    if (!content) {
      return NextResponse.json(
        { error: 'Could not generate LinkedIn content. Please try again.' },
        { status: 500 }
      )
    }

    // Persist to Firestore so it shows on refresh
    await updatePendingBlogPost(postId, { linkedInContent: content })

    return NextResponse.json({ success: true, content })
  } catch (err) {
    console.error('Blog LinkedIn generate error:', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Failed to generate LinkedIn content.',
      },
      { status: 500 }
    )
  }
}
