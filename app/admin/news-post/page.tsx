'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Copy, Check, ExternalLink, ArrowLeft, ChevronDown } from 'lucide-react'
import { Avatar } from '../blog/Avatar'
import type { LinkedInPostItem } from '@/lib/linkedinPosts'
import type { NewPostBatch } from '@/lib/newPosts'

const ADMIN_USER_NAME_KEY = 'admin-user-name'

const NEWS_OPTIONS: { id: 'ai-news' | 'tech-india' | 'tech-global'; label: string }[] = [
  { id: 'ai-news', label: 'AI News' },
  { id: 'tech-india', label: 'Tech Industry – India' },
  { id: 'tech-global', label: 'Tech Industry – Global' },
]

type NewsCategoryId = 'ai-news' | 'tech-india' | 'tech-global'

export default function NewsPostPage() {
  const [userName, setUserName] = useState('')
  const [formCategory, setFormCategory] = useState<NewsCategoryId | ''>('')
  const [newsCategory, setNewsCategory] = useState<NewsCategoryId | null>(null)
  const [newsCategoryLabel, setNewsCategoryLabel] = useState('')
  const [newsArticles, setNewsArticles] = useState<{ title: string; link: string; publishedAt: string; source?: string; snippet?: string }[]>([])
  const [newsPosts, setNewsPosts] = useState<LinkedInPostItem[]>([])
  const [newsGenerating, setNewsGenerating] = useState(false)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copyErrorKey, setCopyErrorKey] = useState<string | null>(null)
  const [claimingKey, setClaimingKey] = useState<string | null>(null)

  const [batches, setBatches] = useState<NewPostBatch[]>([])
  const [loadingBatches, setLoadingBatches] = useState(false)
  const [activeSavedCategory, setActiveSavedCategory] = useState<NewsCategoryId>('ai-news')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [showNewsForm, setShowNewsForm] = useState(false)

  useEffect(() => {
    try {
      const name = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_USER_NAME_KEY) : null
      setUserName(name || '')
    } catch {}
  }, [])

  const fetchBatches = async () => {
    setLoadingBatches(true)
    try {
      const res = await fetch('/api/news-posts/list')
      const data = await res.json()
      if (data.success && Array.isArray(data.batches)) {
        setBatches(data.batches)
      }
    } finally {
      setLoadingBatches(false)
    }
  }

  useEffect(() => {
    fetchBatches()
  }, [])

  useEffect(() => {
    if (!isCategoryDropdownOpen) return
    const close = () => setIsCategoryDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [isCategoryDropdownOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCategory) return
    const category = formCategory as NewsCategoryId
    const option = NEWS_OPTIONS.find((o) => o.id === category)
    setNewsCategory(category)
    setNewsCategoryLabel(option?.label ?? category)
    setNewsError(null)
    setNewsArticles([])
    setNewsPosts([])
    setNewsGenerating(true)
    try {
      const res = await fetch('/api/linkedin/news-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: category as NewsCategoryId }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setNewsArticles(Array.isArray(data.news) ? data.news : [])
        const posts = (data.posts || []).map((p: { content: string; hook?: string }) => ({
          content: p.content,
          hook: p.hook,
        }))
        if (posts.length > 0) {
          const saveRes = await fetch('/api/news-posts/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              newsCategory: option?.label ?? category,
              newsUrl: `https://news.google.com?category=${category}`,
              posts,
            }),
          })
          if (saveRes.ok) {
            await fetchBatches()
            setActiveSavedCategory(category)
            setShowNewsForm(false)
            setFormCategory('')
            setNewsError(null)
          }
        }
      } else {
        setNewsError(data?.error || 'Failed to fetch news or generate posts.')
      }
    } catch {
      setNewsError('Network error. Please try again.')
    } finally {
      setNewsGenerating(false)
    }
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return iso
    }
  }

  const copyPost = async (
    text: string,
    key: string,
    options?: { batchId: string; postIndex: number }
  ) => {
    setCopyErrorKey(null)
    if (options) {
      setClaimingKey(key)
      try {
        const res = await fetch('/api/news-posts/copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batchId: options.batchId,
            postIndex: options.postIndex,
            copiedBy: userName,
          }),
        })
        const data = await res.json()
        if (res.status === 409) {
          setCopyErrorKey(key)
          setTimeout(() => setCopyErrorKey(null), 4000)
          return
        }
        if (!res.ok) {
          setCopyErrorKey(key)
          setTimeout(() => setCopyErrorKey(null), 4000)
          return
        }
        await navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 3000)
        await fetchBatches()
      } catch {
        setCopyErrorKey(key)
        setTimeout(() => setCopyErrorKey(null), 4000)
      } finally {
        setClaimingKey(null)
      }
    } else {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 3000)
    }
  }

  const renderPostCard = (
    post: LinkedInPostItem,
    postKey: string,
    options?: { batchId: string; postIndex: number }
  ) => {
    const isClaimed = Boolean(post.copiedBy?.trim())
    const isJustCopied = copiedKey === postKey
    const isClaiming = claimingKey === postKey
    const showClaimError = copyErrorKey === postKey
    return (
      <Card
        key={postKey}
        className={`relative overflow-hidden border-white/10 ${
          isClaimed
            ? 'bg-slate-900/80 cursor-not-allowed hover:bg-slate-900/80 select-none'
            : 'bg-slate/5'
        }`}
      >
        {isClaimed && (
          <div className="pointer-events-none absolute inset-0 bg-red-950/60 backdrop-blur-[1px]" />
        )}
        <CardContent className="relative p-4">
          {post.hook && (
            <p className="text-slate-200 font-bold text-3xl mb-6">{post.hook}</p>
          )}
          <p className="text-slate-200 text-sm whitespace-pre-wrap mb-3">{post.content}</p>
          <div className="flex items-center gap-3 flex-wrap pt-4">
            {isClaimed ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 text-sky-100 px-3 py-2 text-[11px] font-medium border border-sky-400/40">
                <span className="font-semibold">Copied by {post.copiedBy}</span>
                {post.copiedAt && (
                  <span className="text-sky-200/80 text-[10px]">{formatDate(post.copiedAt)}</span>
                )}
              </span>
            ) : (
              <Button
                variant="secondary"
                className="flex items-center gap-2 py-2 px-4 text-xs"
                disabled={isClaiming}
                onClick={() =>
                  copyPost(
                    post.content,
                    postKey,
                    options ? { batchId: options.batchId, postIndex: options.postIndex } : undefined
                  )
                }
              >
                {isClaiming ? 'Claiming…' : isJustCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </Button>
            )}
            {isJustCopied && userName && !isClaimed && (
              <span className="text-xs text-slate-400">Copied by {userName}</span>
            )}
            {showClaimError && (
              <span className="text-xs text-amber-400">Already used by another team member.</span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 px-4 md:px-8">
      <div className="w-full max-w-full px-4 md:px-32">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back to Admin
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-black mb-2">News post</h1>
        <p className="text-slate-400 mb-8">Generate LinkedIn posts from latest worldwide news.</p>

        <Card className="relative overflow-hidden mb-8 border border-sky-500/20 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_55%)]" />
          <CardContent className="relative p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Generate LinkedIn posts from latest news
              </h2>
              <p className="text-slate-300 text-sm md:text-[13px] mb-3 max-w-2xl">
                Pick a category. We fetch the latest worldwide news and generate 3–4 ready-to-post LinkedIn updates. Save copies to your team library.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span>✓ AI News</span>
                <span>✓ Tech India / Global</span>
                <span>✓ 3–4 variations</span>
              </div>
            </div>
            <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
              <Button
                variant="primary"
                className="w-auto px-5 py-2 text-xs md:text-[11px]"
                onClick={() => {
                  setShowNewsForm(true)
                  setNewsError(null)
                  setFormCategory('')
                }}
              >
                Generate news post
              </Button>
              <p className="text-[11px] text-slate-400 max-w-xs md:text-right">
                Posts are saved and shown in the category tab below.
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showNewsForm} onOpenChange={setShowNewsForm}>
          <DialogContent className="w-full max-w-full md:max-w-xl max-h-[90vh] overflow-y-auto" onClose={() => setShowNewsForm(false)}>
            <DialogHeader>
              <DialogTitle>Generate content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="news-category-modal">Category</Label>
                <select
                  id="news-category-modal"
                  value={formCategory}
                  onChange={(e) => setFormCategory((e.target.value || '') as NewsCategoryId | '')}
                  disabled={newsGenerating}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                >
                  <option value="">Select category</option>
                  {NEWS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {newsError && <p className="text-sm text-red-400">{newsError}</p>}
              {!newsGenerating && <Button type="submit" className="w-full">Fetch news & generate posts</Button>}
            </form>
            {newsGenerating && (
              <div className="mt-6 flex flex-col items-center gap-3 text-center">
                <Avatar state="thinking" className="w-20 h-20" />
                <p className="text-xs text-slate-400">Fetching latest news and generating LinkedIn posts…</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <h2 className="text-xl font-display font-bold mb-4 mt-8">Saved news content</h2>
        {loadingBatches ? (
          <div className="flex flex-col items-center justify-center min-h-[100px] gap-3 text-center mb-8">
            <Avatar state="thinking" className="w-14 h-14" />
            <p className="text-xs text-slate-400">Loading saved news content…</p>
          </div>
        ) : (
          <div className="w-full mb-8">
            <div className="mb-4 flex flex-col gap-3">
              <div className="relative md:hidden">
                <label className="block text-xs font-medium text-slate-400 mb-1">Select category</label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-lg border border-sky-500/40 bg-slate-950/90 px-4 py-2.5 text-left text-[13px] text-slate-50"
                >
                  <span className="truncate font-medium">
                    {NEWS_OPTIONS.find((o) => o.id === activeSavedCategory)?.label ?? 'Select'}
                  </span>
                  <ChevronDown size={16} className={`ml-2 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-sky-500/30 bg-slate-950/98 shadow-xl">
                    {NEWS_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setActiveSavedCategory(opt.id)
                          setIsCategoryDropdownOpen(false)
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] ${
                          opt.id === activeSavedCategory ? 'bg-accent/15 text-accent' : 'text-slate-100 hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden md:flex flex-wrap gap-1 border-b border-white/10">
                {NEWS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActiveSavedCategory(opt.id)}
                    className={`px-4 py-3 font-display font-bold text-sm uppercase tracking-ultra border-b-2 -mb-px ${
                      opt.id === activeSavedCategory
                        ? 'text-accent border-accent bg-accent/5'
                        : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {(() => {
              const normalize = (name: string) => name.trim().toLowerCase()
              const selectedLabel = NEWS_OPTIONS.find((o) => o.id === activeSavedCategory)?.label ?? ''
              const categoryBatches = batches
                .filter((b) => normalize(b.newsCategory) === normalize(selectedLabel))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

              if (categoryBatches.length === 0) {
                return (
                  <p className="text-slate-500 text-sm">
                    No saved content for this category yet. Generate and save posts below using &quot;{selectedLabel}&quot; to see them here.
                  </p>
                )
              }
              return categoryBatches.map((batch) => (
                <Card key={batch.id} className="bg-white/5 border-white/10 mb-4 last:mb-0">
                  <CardContent className="p-6">
                    <a
                      href={batch.newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm hover:underline flex items-center gap-1 mb-2"
                    >
                      {batch.newsUrl}
                      <ExternalLink size={14} />
                    </a>
                    <p className="text-slate-500 text-xs mb-6">{formatDate(batch.createdAt)}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {batch.posts.map((post, i) =>
                        renderPostCard(post, `saved-${batch.id}-${i}`, { batchId: batch.id, postIndex: i })
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            })()}
          </div>
        )}

        {newsGenerating && (
          <div className="flex flex-col items-center gap-3 text-center py-12">
            <Avatar state="thinking" className="w-20 h-20" />
            <p className="text-sm text-slate-400">Fetching latest news and generating LinkedIn posts…</p>
          </div>
        )}

        {newsError && !newsGenerating && (
          <p className="text-sm text-red-400 mb-6">{newsError}</p>
        )}

        {!newsGenerating && newsArticles.length > 0 && newsCategory === activeSavedCategory && (
          <div className="mb-6">
            <h2 className="text-xl font-display font-bold mb-4">Latest news ({newsCategoryLabel || activeSavedCategory})</h2>
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {newsArticles.slice(0, 10).map((article, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-start gap-2"
                  >
                    <ExternalLink size={12} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{article.title}</span>
                  </a>
                  {article.publishedAt && (
                    <span className="text-slate-500 text-xs block mt-0.5">{article.publishedAt}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loadingBatches && !newsGenerating && newsArticles.length === 0 && !newsError && batches.length === 0 && (
          <div className="flex flex-col items-center gap-3 text-center py-12 mb-8">
            <Avatar state="thinking" className="w-20 h-20" />
            <p className="text-slate-500 text-sm">Select a category above to fetch news and generate posts.</p>
          </div>
        )}
      </div>
    </div>
  )
}
