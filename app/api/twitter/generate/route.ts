import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { buildTwitterPrompt } from '@/lib/twitterPrompt'

const stripHtml = (s: string) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const safe = (s: string, max = 2000) => (s || '').trim().replace(/\s+/g, ' ').slice(0, max)

function extractAll(html: string, tagRegex: RegExp, maxItems: number): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  let m: RegExpExecArray | null
  const re = new RegExp(tagRegex.source, tagRegex.flags)
  while ((m = re.exec(html)) !== null && out.length < maxItems) {
    const text = stripHtml(m[1]).trim()
    if (text && text.length > 2 && !seen.has(text)) {
      seen.add(text)
      out.push(text)
    }
  }
  return out
}

function extractContentFromHtml(html: string): {
  title: string
  description: string
  headline: string
  subheadline: string
  keyPoints: string[]
  paragraphs: string[]
  structuredContext: string
} {
  let title = ''
  let description = ''

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (titleMatch) title = stripHtml(titleMatch[1]).trim()
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (ogTitleMatch) title = ogTitleMatch[1].trim() || title

  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  if (descMatch) description = descMatch[1].trim()
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
  if (ogDescMatch) description = ogDescMatch[1].trim() || description

  let jsonLdName = ''
  let jsonLdDescription = ''
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
  if (jsonLdMatch) {
    try {
      const raw = jsonLdMatch[1].trim()
      const parsed = JSON.parse(raw.replace(/\/\*[\s\S]*?\*\//g, ''))
      const obj = Array.isArray(parsed) ? parsed[0] : parsed
      if (obj && typeof obj === 'object') {
        if (typeof obj.name === 'string') jsonLdName = obj.name.trim()
        if (typeof obj.description === 'string') jsonLdDescription = obj.description.trim()
      }
    } catch {
      // ignore
    }
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const body = bodyMatch ? bodyMatch[1] : html
  const noScript = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')

  const h1s = extractAll(noScript, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 1)
  const h2s = extractAll(noScript, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 5)
  const ps = extractAll(noScript, /<p[^>]*>([\s\S]*?)<\/p>/gi, 6)
  const lis = extractAll(noScript, /<li[^>]*>([\s\S]*?)<\/li>/gi, 12)

  const headline = safe(h1s[0] || jsonLdName || title, 300)
  const subheadline = safe(description || jsonLdDescription || ps[0], 500)
  const keyPoints = lis.length > 0 ? lis : h2s
  const paragraphs = ps.filter((p) => p.length > 20)

  const structuredContext = [
    headline && `Headline: ${headline}`,
    subheadline && `Value proposition / description: ${subheadline}`,
    keyPoints.length > 0 && `Key points or features:\n${keyPoints.map((k) => `- ${safe(k, 400)}`).join('\n')}`,
    paragraphs.length > 0 && paragraphs.slice(0, 3).map((p) => safe(p, 350)).join('\n\n'),
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    title: safe(title),
    description: safe(description),
    headline,
    subheadline,
    keyPoints,
    paragraphs,
    structuredContext,
  }
}

export interface TwitterPostOption {
  content: string
  hook?: string
}

/**
 * POST /api/twitter/generate
 * Body: { productName: string, productUrl: string }
 * Returns: { success: true, posts: TwitterPostOption[] } (6 variations)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const productName = typeof body.productName === 'string' ? body.productName.trim() : ''
    const productUrl = typeof body.productUrl === 'string' ? body.productUrl.trim() : ''

    if (!productName || !productUrl) {
      return NextResponse.json(
        { error: 'Both productName and productUrl are required.' },
        { status: 400 }
      )
    }

    let urlParsed: URL
    try {
      urlParsed = new URL(productUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid product URL.' },
        { status: 400 }
      )
    }

    if (!['http:', 'https:'].includes(urlParsed.protocol)) {
      return NextResponse.json(
        { error: 'URL must be http or https.' },
        { status: 400 }
      )
    }

    let html = ''
    try {
      const res = await fetch(urlParsed.toString(), {
        headers: { 'User-Agent': 'VersionLabs-ContentBot/1.0' },
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) {
        return NextResponse.json(
          { error: `Could not fetch URL (${res.status}). The page may be private or blocked.` },
          { status: 400 }
        )
      }
      html = await res.text()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return NextResponse.json(
        { error: `Failed to fetch URL: ${message}` },
        { status: 400 }
      )
    }

    const extracted = extractContentFromHtml(html)
    const context = extracted.structuredContext
      || [
          extracted.title && `Page title: ${extracted.title}`,
          extracted.description && `Value proposition: ${extracted.description}`,
        ]
          .filter(Boolean)
          .join('\n\n')

    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY is not configured. Cannot generate content.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const prompt = buildTwitterPrompt({ productName, productUrl, context })

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

    const posts: TwitterPostOption[] = Array.isArray(rawPosts)
      ? rawPosts
          .slice(0, 6)
          .map((p: { content?: string; hook?: string }) => ({
            content: typeof p?.content === 'string' ? p.content.slice(0, 280) : String(p?.content || '').slice(0, 280),
            hook: typeof p?.hook === 'string' ? p.hook : undefined,
          }))
          .filter((p: TwitterPostOption) => p.content.length > 0)
      : []

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Could not generate any tweet variations. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, posts })
  } catch (err) {
    console.error('Twitter generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate Twitter content.' },
      { status: 500 }
    )
  }
}
