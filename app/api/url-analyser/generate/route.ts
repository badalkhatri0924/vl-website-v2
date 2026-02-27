import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const stripHtml = (s: string) =>
  (s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

const safe = (s: string, max = 3000) => (s || '').trim().replace(/\s+/g, ' ').slice(0, max)

function extractAll(html: string, tagRegex: RegExp, maxItems: number): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const re = new RegExp(tagRegex.source, tagRegex.flags)
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null && out.length < maxItems) {
    const text = stripHtml(m[1]).trim()
    if (text && text.length > 5 && !seen.has(text)) {
      seen.add(text)
      out.push(text)
    }
  }
  return out
}

/**
 * Deep extraction of full article/blog/product content from HTML.
 * Reads the entire body to capture long-form articles, not just meta snippets.
 */
function extractFullContent(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  let title = titleMatch ? stripHtml(titleMatch[1]).trim() : ''
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (ogTitle) title = ogTitle[1].trim() || title

  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
  const description = (ogDesc?.[1] || descMatch?.[1] || '').trim()

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const body = bodyMatch ? bodyMatch[1] : html

  // Remove noise: scripts, styles, nav, footer, header, sidebar, ads
  const clean = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')

  const h1s = extractAll(clean, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 3)
  const h2s = extractAll(clean, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 10)
  const h3s = extractAll(clean, /<h3[^>]*>([\s\S]*?)<\/h3>/gi, 10)
  const paragraphs = extractAll(clean, /<p[^>]*>([\s\S]*?)<\/p>/gi, 40)
  const listItems = extractAll(clean, /<li[^>]*>([\s\S]*?)<\/li>/gi, 30)
  const blockquotes = extractAll(clean, /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, 5)

  // Build a structured full-content string for AI analysis
  const sections: string[] = []
  if (title) sections.push(`TITLE: ${title}`)
  if (description) sections.push(`DESCRIPTION: ${description}`)
  if (h1s.length > 0) sections.push(`MAIN HEADING:\n${h1s.map(h => `- ${safe(h, 400)}`).join('\n')}`)
  if (h2s.length > 0) sections.push(`SECTION HEADINGS:\n${h2s.map(h => `- ${safe(h, 400)}`).join('\n')}`)
  if (h3s.length > 0) sections.push(`SUB-HEADINGS:\n${h3s.map(h => `- ${safe(h, 300)}`).join('\n')}`)
  if (paragraphs.filter(p => p.length > 30).length > 0) {
    const meaningful = paragraphs.filter(p => p.length > 30).slice(0, 30)
    sections.push(`ARTICLE CONTENT:\n${meaningful.map(p => safe(p, 600)).join('\n\n')}`)
  }
  if (listItems.length > 0) {
    sections.push(`KEY POINTS / LIST ITEMS:\n${listItems.map(li => `• ${safe(li, 300)}`).join('\n')}`)
  }
  if (blockquotes.length > 0) {
    sections.push(`NOTABLE QUOTES:\n${blockquotes.map(q => `"${safe(q, 300)}"`).join('\n')}`)
  }

  return sections.join('\n\n')
}

function buildUrlAnalyserPrompt(url: string, content: string): string {
  return `You are a LinkedIn content writer. Read the content below and write a short, sharp LinkedIn post in a natural human voice.

URL: ${url}

EXTRACTED CONTENT:
${content}

---

TASK: Write ONE concise LinkedIn post based on the full content above. Follow these rules exactly:

- 3 to 4 short paragraphs, each 1–2 sentences max
- No bullet points, no numbered lists, no em dashes
- No headers or bold text
- End with one short question or a single call-to-action sentence
- Add 3–5 relevant hashtags on the last line
- Total length: 60–100 words only
- Tone: direct, professional, conversational — like a real person sharing an insight

The first sentence is the hook — make it a bold, standalone statement that makes people stop scrolling.

Respond with ONLY a JSON object in this exact format:
{
  "hook": "The opening sentence only",
  "content": "The full post text (hook + body + question/CTA + hashtags)",
  "summary": "One sentence describing what the source content is about"
}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const url = typeof body.url === 'string' ? body.url.trim() : ''

    if (!url) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 })
    }

    let urlParsed: URL
    try {
      urlParsed = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(urlParsed.protocol)) {
      return NextResponse.json({ error: 'URL must start with http or https.' }, { status: 400 })
    }

    // Fetch the page
    let html = ''
    try {
      const res = await fetch(urlParsed.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VersionLabs-URLAnalyser/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) {
        return NextResponse.json(
          { error: `Could not fetch URL (HTTP ${res.status}). The page may be private, paywalled, or blocked.` },
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

    const extractedContent = extractFullContent(html)

    if (!extractedContent || extractedContent.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from this URL. The page may be JavaScript-rendered or blocked.' },
        { status: 400 }
      )
    }

    if (!process.env.API_KEY) {
      return NextResponse.json(
        { error: 'API_KEY is not configured.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
    const prompt = buildUrlAnalyserPrompt(urlParsed.toString(), safe(extractedContent, 12000))

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.75,
        topP: 0.9,
      },
    })

    const responseText = (response.text || '').trim()

    // Parse JSON response
    let parsed: { hook?: string; content?: string; summary?: string } = {}
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch {
        // fallback: treat entire response as content
        parsed = { content: responseText }
      }
    } else {
      parsed = { content: responseText }
    }

    if (!parsed.content) {
      return NextResponse.json(
        { error: 'Failed to generate LinkedIn post. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hook: parsed.hook || '',
      content: parsed.content,
      summary: parsed.summary || '',
      extractedChars: extractedContent.length,
    })
  } catch (err) {
    console.error('URL Analyser generate error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to analyse URL.' },
      { status: 500 }
    )
  }
}
