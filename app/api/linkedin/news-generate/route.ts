import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import {
  buildLinkedInNewsPrompt,
  type NewsCategoryLabel,
} from '@/lib/linkedinPrompt'

export interface LinkedInPostOption {
  content: string
  hook?: string
  /** 0-based index into the news articles array – which article this post is based on */
  sourceArticleIndex?: number
}

type NewsCategory = 'ai-news' | 'tech-india' | 'tech-global' | 'trend-worldwide'

interface NewsArticle {
  title: string
  link: string
  publishedAt: string
  source?: string
  snippet?: string
}

const CATEGORY_LABELS: Record<NewsCategory, NewsCategoryLabel> = {
  'ai-news': 'AI News',
  'tech-india': 'Tech Industry – India',
  'tech-global': 'Tech Industry – Global',
  'trend-worldwide': 'Latest Trend News – Worldwide',
}

function buildNewsContext(articles: NewsArticle[]): string {
  return articles
    .slice(0, 12)
    .map(
      (a, i) =>
        `${i + 1}. ${a.title}${a.snippet ? ` — ${a.snippet}` : ''}${a.publishedAt ? ` (${a.publishedAt})` : ''}`
    )
    .join('\n\n')
}

/**
 * POST /api/linkedin/news-generate
 * Body: { category: "ai-news" | "tech-india" | "tech-global" | "trend-worldwide" }
 * Returns: { success: true, news: NewsArticle[], posts: LinkedInPostOption[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const category = (typeof body.category === 'string' ? body.category.trim() : '') as NewsCategory
    const valid: NewsCategory[] = ['ai-news', 'tech-india', 'tech-global', 'trend-worldwide']
    if (!valid.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Use: ai-news, tech-india, tech-global, trend-worldwide' },
        { status: 400 }
      )
    }

    const baseUrl = request.nextUrl.origin
    const feedRes = await fetch(`${baseUrl}/api/news/feed?category=${encodeURIComponent(category)}`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!feedRes.ok) {
      const err = await feedRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: err?.error || 'Failed to fetch news feed.' },
        { status: 502 }
      )
    }
    const feedData = await feedRes.json()
    const articles: NewsArticle[] = Array.isArray(feedData.articles) ? feedData.articles : []
    const newsContext = buildNewsContext(articles)

    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY is not configured. Cannot generate content.' },
        { status: 500 }
      )
    }

    const label = CATEGORY_LABELS[category]
    const prompt = buildLinkedInNewsPrompt({ category: label, newsContext })

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.8,
        topP: 0.9,
      },
    })

    const responseText = (response.text || '').trim()
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    const rawPosts = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    const maxArticleIndex = Math.max(0, articles.length - 1)

    const posts: LinkedInPostOption[] = Array.isArray(rawPosts)
      ? rawPosts
          .slice(0, 4)
          .map((p: { content?: string; hook?: string; sourceIndex?: number }) => {
            const content = typeof p?.content === 'string' ? p.content : String(p?.content || '')
            const hook = typeof p?.hook === 'string' ? p.hook : undefined
            const rawSource = p?.sourceIndex != null ? Number(p.sourceIndex) : NaN
            const sourceArticleIndex =
              Number.isFinite(rawSource) && rawSource >= 1
                ? Math.min(Math.floor(rawSource) - 1, maxArticleIndex)
                : undefined
            return { content, hook, sourceArticleIndex }
          })
          .filter((p: LinkedInPostOption) => p.content.length > 0)
      : []

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate any post variations. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      category,
      categoryLabel: label,
      news: articles,
      posts,
    })
  } catch (err) {
    console.error('LinkedIn news generate error:', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Failed to generate LinkedIn content from news.',
      },
      { status: 500 }
    )
  }
}
