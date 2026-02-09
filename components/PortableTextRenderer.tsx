'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import ReactMarkdown from 'react-markdown'
import { SanityBlogPost } from '@/lib/sanity/utils'

interface PortableTextRendererProps {
  content: SanityBlogPost['content'] | string
}

type PortableTextBlockLike = {
  _type?: string
  style?: string
  children?: Array<{ text?: string }>
}

type SummaryListBlock = {
  _type: 'summaryList'
  _key: string
  items: string[]
}

/**
 * Normalize content: if it's a string that looks like JSON with a body key (e.g. API response),
 * extract the markdown body. Otherwise return the string as-is for markdown rendering.
 */
function getMarkdownFromContent(content: string): string {
  const trimmed = content.trim()
  if (!trimmed.startsWith('{')) return content
  try {
    const parsed = JSON.parse(content) as { body?: string }
    if (parsed && typeof parsed.body === 'string') return parsed.body
  } catch {
    // Not valid JSON, use as markdown
  }
  return content
}

const markdownProseClasses = {
  h1: 'text-4xl font-display font-black text-obsidian-900 mt-16 mb-6',
  h2: 'text-3xl font-display font-black text-obsidian-900 mt-12 mb-6',
  h3: 'text-2xl font-display font-black text-obsidian-900 mt-10 mb-4',
  h4: 'text-xl font-display font-black text-obsidian-900 mt-8 mb-4',
  p: 'mb-6 text-lg md:text-xl leading-relaxed text-slate-600',
  blockquote: 'border-l-4 border-accent pl-10 py-4 my-16 bg-slate-50 italic text-2xl text-obsidian-900 font-light',
  ul: 'mb-6 space-y-2 text-lg md:text-xl leading-relaxed text-slate-600 pl-8 list-disc',
  ol: 'mb-6 space-y-2 text-lg md:text-xl leading-relaxed text-slate-600 pl-8 list-decimal',
  li: 'pl-2',
  strong: 'font-semibold text-obsidian-900',
  em: 'italic',
}

function extractBlockPlainText(block: PortableTextBlockLike | undefined): string {
  if (!block || !Array.isArray(block.children)) return ''
  return block.children.map((c) => c?.text ?? '').join('').trim()
}

/**
 * Given Portable Text content, detect a "Summary" h2 heading and convert the
 * next up-to-3 normal paragraphs into a synthetic summaryList block so they
 * render as proper bullet points instead of plain paragraphs.
 */
function transformSummaryBlocks(
  content: SanityBlogPost['content'],
): Array<PortableTextBlockLike | SummaryListBlock> {
  if (!Array.isArray(content) || content.length === 0) return content as any

  const transformed: Array<PortableTextBlockLike | SummaryListBlock> = []

  for (let i = 0; i < content.length; i++) {
    const block = content[i] as PortableTextBlockLike

    const isH2Summary =
      block?._type === 'block' &&
      block.style === 'h2' &&
      extractBlockPlainText(block).toLowerCase() === 'summary'

    if (!isH2Summary) {
      transformed.push(block)
      continue
    }

    // Push the Summary heading block itself
    transformed.push(block)

    // Collect up to 3 following normal paragraphs before the next heading
    const items: string[] = []
    let j = i + 1
    while (j < content.length && items.length < 3) {
      const next = content[j] as PortableTextBlockLike
      const isHeading =
        next?._type === 'block' &&
        (next.style === 'h1' || next.style === 'h2' || next.style === 'h3' || next.style === 'h4')

      if (isHeading) break

      const text = extractBlockPlainText(next)
      if (text) {
        items.push(text)
        j++
      } else {
        break
      }
    }

    if (items.length > 0) {
      transformed.push({
        _type: 'summaryList',
        _key: `summary-list-${i}`,
        items,
      })
      // Skip the blocks we just consumed
      i = j - 1
    }
  }

  return transformed
}

const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ content }) => {
  // String content (e.g. markdown or JSON-with-body from API): render as formatted markdown
  if (typeof content === 'string') {
    const markdown = getMarkdownFromContent(content)
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className={markdownProseClasses.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={markdownProseClasses.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={markdownProseClasses.h3}>{children}</h3>,
          h4: ({ children }) => <h4 className={markdownProseClasses.h4}>{children}</h4>,
          p: ({ children }) => <p className={markdownProseClasses.p}>{children}</p>,
          blockquote: ({ children }) => <blockquote className={markdownProseClasses.blockquote}>{children}</blockquote>,
          ul: ({ children }) => <ul className={markdownProseClasses.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={markdownProseClasses.ol}>{children}</ol>,
          li: ({ children }) => <li className={markdownProseClasses.li}>{children}</li>,
          strong: ({ children }) => <strong className={markdownProseClasses.strong}>{children}</strong>,
          em: ({ children }) => <em className={markdownProseClasses.em}>{children}</em>,
        }}
      >
        {markdown}
      </ReactMarkdown>
    )
  }

  // Array content: Sanity Portable Text
  if (!Array.isArray(content) || content.length === 0) {
    return null
  }

  const value = transformSummaryBlocks(content as SanityBlogPost['content'])

  return (
    <PortableText
      value={value as any}
      components={{
        block: {
          h1: ({ children }) => (
            <h1 className="text-4xl font-display font-black text-obsidian-900 mt-16 mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-display font-black text-obsidian-900 mt-12 mb-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-display font-black text-obsidian-900 mt-10 mb-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-display font-black text-obsidian-900 mt-8 mb-4">{children}</h4>
          ),
          normal: ({ children }) => (
            <p className="mb-6 text-lg md:text-xl leading-relaxed text-slate-600">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-10 py-4 my-16 bg-slate-50 italic text-2xl text-obsidian-900 font-light">
              {children}
            </blockquote>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="mb-6 space-y-2 text-lg md:text-xl leading-relaxed text-slate-600 pl-8" style={{ listStyleType: 'disc' }}>
              {children}
            </ul>
          ),
          number: ({ children }) => (
            <ol className="mb-6 space-y-2 text-lg md:text-xl leading-relaxed text-slate-600 pl-8" style={{ listStyleType: 'decimal' }}>
              {children}
            </ol>
          ),
        },
        listItem: {
          bullet: ({ children }) => (
            <li className="pl-2" style={{ display: 'list-item' }}>{children}</li>
          ),
          number: ({ children }) => (
            <li className="pl-2" style={{ display: 'list-item' }}>{children}</li>
          ),
        },
        marks: {
          strong: ({ children }) => <strong className="font-semibold text-obsidian-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        },
        types: {
          image: ({ value }) => (
            <div className="my-12">
              <img
                src={value.asset?.url}
                alt={value.alt || ''}
                className="w-full rounded-lg"
              />
              {value.alt && (
                <p className="text-sm text-slate-500 mt-2 text-center italic">{value.alt}</p>
              )}
            </div>
          ),
          summaryList: ({ value }: { value: SummaryListBlock }) => (
            <ul className="mb-6 space-y-2 text-lg md:text-xl leading-relaxed text-slate-600 pl-8 list-disc">
              {value.items.map((item, idx) => (
                <li key={idx} className="pl-2">
                  {item}
                </li>
              ))}
            </ul>
          ),
        },
      }}
    />
  )
}

export default PortableTextRenderer


