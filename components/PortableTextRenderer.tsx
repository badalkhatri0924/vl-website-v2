'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import ReactMarkdown from 'react-markdown'
import { SanityBlogPost } from '@/lib/sanity/utils'

interface PortableTextRendererProps {
  content: SanityBlogPost['content'] | string
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

  return (
    <PortableText
      value={content as SanityBlogPost['content']}
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
        },
      }}
    />
  )
}

export default PortableTextRenderer


