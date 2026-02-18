import { NextRequest, NextResponse } from 'next/server'

export type NewsCategory = 'ai-news' | 'tech-india' | 'tech-global' | 'trend-worldwide' | 'news-12h-india' | 'news-24h-worldwide'

export interface NewsArticle {
  title: string
  link: string
  publishedAt: string
  source?: string
  snippet?: string
}

const RSS_URLS: Record<NewsCategory, string> = {
  'ai-news':
    'https://news.google.com/rss/search?q=AI+artificial+intelligence+machine+learning&hl=en-US&gl=US&ceid=US%3Aen',
  'tech-india':
    'https://news.google.com/rss/search?q=technology+India&hl=en-IN&gl=IN&ceid=IN%3Aen',
  'tech-global':
    'https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US%3Aen',
  'trend-worldwide':
    'https://news.google.com/rss/search?q=trending+news+worldwide+latest&hl=en-US&gl=US&ceid=US%3Aen',
  'news-12h-india':
    'https://news.google.com/rss/search?q=India+news&hl=en-IN&gl=IN&ceid=IN%3Aen',
  'news-24h-worldwide':
    'https://news.google.com/rss/search?q=world+news+international&hl=en-US&gl=US&ceid=US%3Aen',
}

function stripHtml(s: string): string {
  return (s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

function parseRssItems(xml: string): NewsArticle[] {
  const articles: NewsArticle[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null
  while ((m = itemRegex.exec(xml)) !== null && articles.length < 15) {
    const block = m[1]
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)
    const pubMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)
    const descMatch = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)
    const sourceMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)
    const title = stripHtml(titleMatch ? titleMatch[1] : '')
    const link = stripHtml(linkMatch ? linkMatch[1] : '')
    const publishedAt = stripHtml(pubMatch ? pubMatch[1] : '')
    const snippet = stripHtml(descMatch ? descMatch[1] : '').slice(0, 200)
    const source = stripHtml(sourceMatch ? sourceMatch[1] : '')
    if (title && link) {
      articles.push({
        title,
        link,
        publishedAt,
        source: source || undefined,
        snippet: snippet || undefined,
      })
    }
  }
  return articles
}

/**
 * GET /api/news/feed?category=ai-news|tech-india|tech-global|trend-worldwide|news-12h-india|news-24h-worldwide
 * Returns latest news articles for the category.
 */
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') as NewsCategory | null
    const valid: NewsCategory[] = ['ai-news', 'tech-india', 'tech-global', 'trend-worldwide', 'news-12h-india', 'news-24h-worldwide']
    if (!category || !valid.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Use: ai-news, tech-india, tech-global, trend-worldwide, news-12h-india, news-24h-worldwide' },
        { status: 400 }
      )
    }
    const url = RSS_URLS[category]
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VersionLabs-ContentBot/1.0' },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch news feed (${res.status})` },
        { status: 502 }
      )
    }
    const xml = await res.text()
    const articles = parseRssItems(xml)
    return NextResponse.json({ success: true, category, articles })
  } catch (err) {
    console.error('News feed error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch news.' },
      { status: 500 }
    )
  }
}
