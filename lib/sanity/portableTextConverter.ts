/**
 * Converts markdown or plain text to Sanity's PortableText format
 */

export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: string
  markDefs: any[]
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
}

export interface PortableTextImage {
  _type: 'image'
  _key: string
  asset: {
    _type: 'reference'
    _ref: string
  }
  alt?: string
}

export type PortableTextContent = Array<PortableTextBlock | PortableTextImage>

/**
 * Converts markdown text to PortableText format
 */
export function markdownToPortableText(markdown: string): PortableTextContent {
  const blocks: PortableTextContent = []
  const lines = markdown.split('\n')
  let currentParagraph: string[] = []
  let blockKeyCounter = 0

  function generateKey(): string {
    return `block-${Date.now()}-${blockKeyCounter++}`
  }

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim()
      if (text) {
        blocks.push(createTextBlock(text, 'normal'))
        currentParagraph = []
      }
    }
  }

  function createTextBlock(text: string, style: string = 'normal'): PortableTextBlock {
    // Parse inline formatting (bold, italic, links)
    const parts = parseInlineFormatting(text)
    
    return {
      _type: 'block',
      _key: generateKey(),
      style,
      markDefs: parts.links,
      children: parts.children,
    }
  }

  function parseInlineFormatting(text: string): {
    children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }>,
    links: any[]
  } {
    const children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }> = []
    const links: any[] = []
    let linkKeyCounter = 0

    // Regex patterns for markdown formatting
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
    const boldPattern = /\*\*([^*]+)\*\*/g
    const italicPattern = /\*([^*]+)\*/g
    const codePattern = /`([^`]+)`/g

    // Extract all matches with positions
    const matches: Array<{ type: string; start: number; end: number; content: string; url?: string }> = []

    // Find links
    let match
    while ((match = linkPattern.exec(text)) !== null) {
      matches.push({
        type: 'link',
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        url: match[2],
      })
    }

    // Find bold
    boldPattern.lastIndex = 0
    while ((match = boldPattern.exec(text)) !== null) {
      matches.push({
        type: 'strong',
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
      })
    }

    // Find italic
    italicPattern.lastIndex = 0
    while ((match = italicPattern.exec(text)) !== null) {
      matches.push({
        type: 'em',
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
      })
    }

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start)

    // Build spans
    let lastIndex = 0
    let spanKeyCounter = 0

    matches.forEach((match) => {
      // Add text before match
      if (match.start > lastIndex) {
        const beforeText = text.substring(lastIndex, match.start)
        if (beforeText) {
          children.push({
            _type: 'span',
            _key: `span-${spanKeyCounter++}`,
            text: beforeText,
          })
        }
      }

      // Add formatted text
      const marks: string[] = []
      if (match.type === 'strong') marks.push('strong')
      if (match.type === 'em') marks.push('em')

      if (match.type === 'link') {
        const linkKey = `link-${linkKeyCounter++}`
        links.push({
          _key: linkKey,
          _type: 'link',
          href: match.url,
        })
        marks.push(linkKey)
      }

      children.push({
        _type: 'span',
        _key: `span-${spanKeyCounter++}`,
        text: match.content,
        marks: marks.length > 0 ? marks : undefined,
      })

      lastIndex = match.end
    })

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex)
      if (remainingText) {
        children.push({
          _type: 'span',
          _key: `span-${spanKeyCounter++}`,
          text: remainingText,
        })
      }
    }

    // If no matches, return plain text
    if (children.length === 0) {
      children.push({
        _type: 'span',
        _key: `span-${spanKeyCounter++}`,
        text,
      })
    }

    return { children, links }
  }

  // Process lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Empty line - flush paragraph
    if (!line) {
      flushParagraph()
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.substring(4), 'h3'))
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.substring(3), 'h2'))
      continue
    }

    if (line.startsWith('# ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.substring(2), 'h1'))
      continue
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\. /)) {
      flushParagraph()
      const listItem = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')
      blocks.push(createTextBlock(listItem, 'normal'))
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph()
      blocks.push(createTextBlock(line.substring(2), 'blockquote'))
      continue
    }

    // Regular paragraph
    currentParagraph.push(line)
  }

  // Flush remaining paragraph
  flushParagraph()

  // If no blocks created, create at least one
  if (blocks.length === 0) {
    blocks.push(createTextBlock(markdown || 'No content', 'normal'))
  }

  return blocks
}

/**
 * Converts plain text to PortableText format
 */
export function textToPortableText(text: string): PortableTextContent {
  const blocks: PortableTextContent = []
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim())

  let blockKeyCounter = 0
  function generateKey(): string {
    return `block-${Date.now()}-${blockKeyCounter++}`
  }

  paragraphs.forEach((paragraph) => {
    const lines = paragraph.split('\n').map(l => l.trim()).filter(l => l)
    const text = lines.join(' ')

    if (text) {
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `span-${blockKeyCounter}`,
            text,
          },
        ],
      })
    }
  })

  if (blocks.length === 0) {
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: 'span-0',
          text: text || 'No content',
        },
      ],
    })
  }

  return blocks
}

