'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar } from '../blog/Avatar'
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Link2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

interface AnalysisResult {
  hook: string
  content: string
  summary: string
  extractedChars: number
}

export default function UrlAnalyserPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAnalyse = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Please enter a URL to analyse.')
      inputRef.current?.focus()
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/url-analyser/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResult({
          hook: data.hook || '',
          content: data.content || '',
          summary: data.summary || '',
          extractedChars: data.extractedChars || 0,
        })
      } else {
        setError(data?.error || 'Failed to analyse URL. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.content) return
    try {
      await navigator.clipboard.writeText(result.content)
    } catch {
      const el = document.createElement('textarea')
      el.value = result.content
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 px-4 md:px-8">
      <div className="w-full max-w-full px-4 md:px-32">

        {/* Back */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Admin
        </Link>

        {/* Page header */}
        <h1 className="text-3xl md:text-4xl font-display font-black mb-2">URL Analyser</h1>
        <p className="text-slate-400 mb-8">
          Paste any URL — blog, article, or product page. We read the full content and generate a LinkedIn post.
        </p>

        {/* Hero card */}
        <Card className="relative overflow-hidden mb-8 border border-sky-500/20 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_55%)]" />
          <CardContent className="relative p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Turn any URL into a LinkedIn post
              </h2>
              <p className="text-slate-300 text-sm md:text-[13px] mb-3 max-w-2xl">
                Paste a blog, article, news story, or product page. We fetch and read the full content, then write a short, sharp LinkedIn post ready to publish.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span>✓ Reads full article content</span>
                <span>✓ Short LinkedIn format</span>
                <span>✓ One-click copy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL input */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleAnalyse} className="space-y-4">
              <div>
                <Label htmlFor="urlInput" className="text-sm text-slate-300 mb-2 block">
                  Article / Blog / Product URL
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <Input
                      id="urlInput"
                      ref={inputRef}
                      type="url"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(null) }}
                      placeholder="https://example.com/blog/article-title"
                      className="pl-9 bg-white/5 border-white/10 text-sm"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !url.trim()}
                    className="px-6 shrink-0"
                  >
                    {loading ? 'Analysing…' : 'Analyse'}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Works with blogs, news articles, Medium, product pages, and more.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                  <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </form>

            {loading && (
              <div className="mt-8 flex flex-col items-center gap-3 text-center py-2">
                <Avatar state="thinking" className="w-20 h-20" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Reading the full content…</p>
                  <p className="text-xs text-slate-400 mt-0.5">Fetching the page and crafting your LinkedIn post.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <>
            {/* Source info */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm hover:underline flex items-center gap-1.5 truncate max-w-xl"
              >
                {url}
                <ExternalLink size={13} />
              </a>
              {result.summary && (
                <span className="text-xs text-slate-500 italic">— {result.summary}</span>
              )}
            </div>

            {/* Post card */}
            <Card className="bg-white/5 border-white/10 mb-4">
              <CardContent className="p-4">
                {result.hook && (
                  <p className="text-slate-200 font-bold text-2xl leading-snug mb-4">{result.hook}</p>
                )}
                <p className="text-slate-200 text-sm whitespace-pre-wrap mb-3">
                  {result.hook && result.content.startsWith(result.hook)
                    ? result.content.slice(result.hook.length).trimStart()
                    : result.content}
                </p>

                <div className="flex items-center gap-3 flex-wrap pt-4 border-t border-white/10">
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 py-2 px-4 text-xs"
                    onClick={handleCopy}
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2 py-2 px-4 text-xs"
                    onClick={() => handleAnalyse()}
                    disabled={loading}
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </Button>
                  {copied && (
                    <span className="text-xs text-slate-400">Copied to clipboard</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  )
}
