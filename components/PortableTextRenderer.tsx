'use client'

import { PortableText } from '@portabletext/react'
import { SanityBlogPost } from '@/lib/sanity/utils'

interface PortableTextRendererProps {
  content: SanityBlogPost['content']
}

const PortableTextRenderer: React.FC<PortableTextRendererProps> = ({ content }) => {
  return (
    <PortableText
      value={content}
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


