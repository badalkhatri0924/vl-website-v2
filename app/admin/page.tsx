'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, FileText, Newspaper, ArrowRight, LayoutGrid, PenLine } from 'lucide-react'

const LINKS = [
  {
    href: '/admin/product-post',
    label: 'LinkedIn product post',
    description: 'Generate posts from any product URL. Analyze the page, get 3–4 variations, save for your team.',
    icon: FileText,
    accent: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    href: '/admin/news-post',
    label: 'LinkedIn News post',
    description: 'Generate LinkedIn posts from latest news. Pick AI News, Tech India, or Tech Global.',
    icon: Newspaper,
    accent: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400',
    borderHover: 'hover:border-amber-500/40',
  },
  {
    href: '/admin/blog',
    label: 'Blog Admin',
    description: 'Review, approve, or reject AI-generated blog posts.',
    icon: PenLine,
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400',
    borderHover: 'hover:border-emerald-500/40',
  },
  {
    href: '/studio',
    label: 'Open Sanity Studio',
    description: 'Edit content in Sanity CMS.',
    icon: ExternalLink,
    external: true,
    accent: 'from-violet-500/20 to-purple-500/10',
    iconBg: 'bg-gradient-to-br from-violet-500/20 to-purple-500/10 text-violet-400',
    borderHover: 'hover:border-violet-500/40',
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 px-4 md:px-8 relative overflow-hidden">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(139,92,246,0.05),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-900/50 to-transparent" />

      <div className="relative w-full max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-6">
            <LayoutGrid size={14} className="text-sky-400" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-300">
            Admin
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Content management tools. Choose a section to get started.
          </p>
        </header>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {LINKS.map((item, i) => {
            const Icon = item.icon
            const content = (
              <Card
                className={`group relative overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] ${item.borderHover} transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${item.accent}`} />
                <CardContent className="relative p-6 md:p-7 flex items-start gap-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ring-1 ring-white/5`}>
                    <Icon size={24} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-white text-lg mb-2 flex items-center gap-2">
                      {item.label}
                      <ArrowRight size={18} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
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
