'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, FileText, Newspaper, ArrowRight } from 'lucide-react'

const LINKS = [
  {
    href: '/admin/product-post',
    label: 'LinkedIn product post',
    description: 'Generate posts from any product URL. Analyze the page, get 3–4 variations, save for your team.',
    icon: FileText,
  },
  {
    href: '/admin/news-post',
    label: 'News post',
    description: 'Generate LinkedIn posts from latest news. Pick AI News, Tech India, or Tech Global.',
    icon: Newspaper,
  },
  {
    href: '/admin/blog',
    label: 'Blog Admin',
    description: 'Review, approve, or reject AI-generated blog posts.',
    icon: FileText,
  },
  {
    href: '/studio',
    label: 'Open Sanity Studio',
    description: 'Edit content in Sanity CMS.',
    icon: ExternalLink,
    external: true,
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 px-4 md:px-8">
      <div className="w-full max-w-full px-4 md:px-32">
        <h1 className="text-3xl md:text-4xl font-display font-black mb-2">Admin</h1>
        <p className="text-slate-400 mb-8">Content management tools</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {LINKS.map((item) => {
            const Icon = item.icon
            const content = (
              <Card className="group border border-white/10 bg-white/5 hover:bg-white/[0.08] hover:border-sky-500/30 transition-all">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-white mb-1 flex items-center gap-2">
                      {item.label}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition shrink-0" />
                    </h2>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
            if (item.external) {
              return (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              )
            }
            return (
              <Link key={item.href} href={item.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
