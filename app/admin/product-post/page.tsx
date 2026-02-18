'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, ExternalLink, ChevronDown, ArrowLeft } from 'lucide-react'
import { Avatar } from '../blog/Avatar'
import type { LinkedInPostBatch, LinkedInPostItem } from '@/lib/linkedinPosts'

const ADMIN_USER_NAME_KEY = 'admin-user-name'

export default function ProductPostPage() {
  const [userName, setUserName] = useState('')
  const [batches, setBatches] = useState<LinkedInPostBatch[]>([])
  const [loadingBatches, setLoadingBatches] = useState(false)
  const [showLinkedInForm, setShowLinkedInForm] = useState(false)
  const [productName, setProductName] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPostItem[]>([])
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [copyErrorKey, setCopyErrorKey] = useState<string | null>(null)
  const [claimingKey, setClaimingKey] = useState<string | null>(null)
  const [activeTabBatchId, setActiveTabBatchId] = useState<string | null>(null)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)

  useEffect(() => {
    try {
      const name = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_USER_NAME_KEY) : null
      setUserName(name || '')
    } catch {}
  }, [])

  const fetchBatches = async () => {
    setLoadingBatches(true)
    try {
      const res = await fetch('/api/linkedin/list')
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
    if (batches.length === 0) return
    const normalize = (name: string) => name.trim().toLowerCase()
    const productMap: Record<string, LinkedInPostBatch> = {}
    batches.forEach((b) => {
      const key = normalize(b.productName)
      if (!productMap[key] || new Date(b.createdAt).getTime() > new Date(productMap[key].createdAt).getTime()) {
        productMap[key] = b
      }
    })
    const productTabs = Object.values(productMap)
    const currentValid = activeTabBatchId && productTabs.some((t) => t.id === activeTabBatchId)
    if (!currentValid && productTabs[0]) {
      setActiveTabBatchId(productTabs[0].id)
    }
  }, [batches])

  const handleGenerateLinkedIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productName.trim() || !productUrl.trim()) {
      setGenerateError('Please fill in both Product name and Product URL.')
      return
    }
    setGenerateError(null)
    setGenerating(true)
    setLinkedInPosts([])
    try {
      const res = await fetch('/api/linkedin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          productUrl: productUrl.trim(),
        }),
      })
      const data = await res.json()
      if (res.ok && data.success && Array.isArray(data.posts)) {
        const saveRes = await fetch('/api/linkedin/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: productName.trim(),
            productUrl: productUrl.trim(),
            posts: data.posts,
          }),
        })
        if (saveRes.ok) {
          await fetchBatches()
          setShowLinkedInForm(false)
          setProductName('')
          setProductUrl('')
          setLinkedInPosts([])
        }
      } else {
        setGenerateError(data?.error || 'Failed to generate content. Please try again.')
      }
    } catch {
      setGenerateError('Network error. Please try again.')
    } finally {
      setGenerating(false)
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
        const res = await fetch('/api/linkedin/copy', {
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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return iso
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
            : 'bg-slate/5 cursor-default hover:bg-slate/5'
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
        <h1 className="text-3xl md:text-4xl font-display font-black mb-2">LinkedIn product post</h1>
        <p className="text-slate-400 mb-8">Generate and manage product-based LinkedIn content.</p>

        <Card className="relative overflow-hidden mb-8 border border-sky-500/20 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40">
          <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_55%)]" />
          <CardContent className="relative p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                Generate on-brand LinkedIn content in one click
              </h2>
              <p className="text-slate-300 text-sm md:text-[13px] mb-3 max-w-2xl">
                Turn any product URL into 3–4 ready-to-post LinkedIn updates. We analyze the page, pull the key value props, and save approved copies for your whole team.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span>✓ URL analysis</span>
                <span>✓ 3–4 variations</span>
                <span>✓ Team copy tracking</span>
              </div>
            </div>
            <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto">
              <Button
                variant="primary"
                className="w-auto px-5 py-2 text-xs md:text-[11px]"
                onClick={() => {
                  setShowLinkedInForm(true)
                  setLinkedInPosts([])
                  setGenerateError(null)
                }}
              >
                Generate product post
              </Button>
              <p className="text-[11px] text-slate-400 max-w-xs md:text-right">
                Copies are saved only inside this admin for your team.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6 flex flex-wrap gap-3 items-center">
          <Link href="/admin/blog">
            <Button variant="secondary">Blog Admin</Button>
          </Link>
          <a href="/studio" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="flex items-center gap-2">
              Open Sanity Studio
              <ExternalLink size={14} />
            </Button>
          </a>
        </div>

        <h2 className="text-xl font-display font-bold mb-4">Saved LinkedIn content</h2>
        {loadingBatches ? (
          <div className="flex flex-col items-center justify-center min-h-[160px] gap-3 text-center">
            <Avatar state="thinking" className="w-20 h-20" />
            <p className="text-xs text-slate-400">Loading saved LinkedIn content…</p>
          </div>
        ) : batches.length === 0 ? (
          <p className="text-slate-500 text-sm">No saved content yet. Generate posts above to see them here.</p>
        ) : (
          (() => {
            const normalize = (name: string) => name.trim().toLowerCase()
            const productMap: Record<string, LinkedInPostBatch> = {}
            for (const batch of batches) {
              const key = normalize(batch.productName)
              const existing = productMap[key]
              if (!existing || new Date(batch.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
                productMap[key] = batch
              }
            }
            const productTabs = Object.values(productMap)
            const activeBatch =
              (activeTabBatchId && productTabs.find((b) => b.id === activeTabBatchId)) || productTabs[0]
            const activeKey = activeBatch ? normalize(activeBatch.productName) : ''
            const displayBatches = batches
              .filter((b) => normalize(b.productName) === activeKey)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            return (
              <div className="w-full">
                <div className="mb-6 flex flex-col gap-3">
                  <div className="relative md:hidden">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Select product</label>
                    <button
                      type="button"
                      onClick={() => setIsProductDropdownOpen((open) => !open)}
                      className="flex w-full items-center justify-between rounded-lg border border-sky-500/40 bg-slate-950/90 px-4 py-2.5 text-left text-[13px] text-slate-50"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent/90 uppercase">
                          {activeBatch?.productName?.charAt(0) ?? '?'}
                        </span>
                        <span className="truncate font-medium">{activeBatch?.productName ?? 'Select'}</span>
                      </div>
                      <ChevronDown size={16} className={`ml-2 ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isProductDropdownOpen && (
                      <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-sky-500/30 bg-slate-950/98 shadow-xl">
                        {productTabs.map((batch) => (
                          <button
                            key={batch.id}
                            type="button"
                            onClick={() => {
                              setActiveTabBatchId(batch.id)
                              setIsProductDropdownOpen(false)
                            }}
                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] ${
                              normalize(batch.productName) === activeKey ? 'bg-accent/15 text-accent' : 'text-slate-100 hover:bg-white/5'
                            }`}
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/80 text-[11px] font-semibold uppercase text-slate-200">
                              {batch.productName.charAt(0)}
                            </span>
                            <span className="truncate">{batch.productName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1 border-b border-white/10">
                    {productTabs.map((batch) => (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => setActiveTabBatchId(batch.id)}
                        className={`px-4 py-3 font-display font-bold text-sm uppercase tracking-ultra border-b-2 -mb-px ${
                          normalize(batch.productName) === activeKey
                            ? 'text-accent border-accent bg-accent/5'
                            : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {batch.productName}
                      </button>
                    ))}
                  </div>
                </div>
                {displayBatches.map((batch) => (
                  <Card key={batch.id} className="bg-white/5 border-white/10 mb-4 last:mb-0">
                    <CardContent className="p-6">
                      <a
                        href={batch.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent text-sm hover:underline flex items-center gap-1 mb-2"
                      >
                        {batch.productUrl}
                        <ExternalLink size={14} />
                      </a>
                      <p className="text-slate-500 text-xs mb-6">{formatDate(batch.createdAt)}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {batch.posts.map((post, i) =>
                          renderPostCard(post, `${batch.id}-${i}`, { batchId: batch.id, postIndex: i })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          })()
        )}
      </div>

      <Dialog open={showLinkedInForm} onOpenChange={setShowLinkedInForm}>
        <DialogContent className="w-full max-w-full md:max-w-xl max-h-[90vh] overflow-y-auto" onClose={() => setShowLinkedInForm(false)}>
          <DialogHeader>
            <DialogTitle>Generate content</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGenerateLinkedIn} className="space-y-6">
            <div>
              <Label htmlFor="productName">Product name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. UnCloud"
                className="mt-2 bg-white/5 border-white/10"
                disabled={generating}
              />
            </div>
            <div>
              <Label htmlFor="productUrl">Product URL</Label>
              <Input
                id="productUrl"
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://example.com/product"
                className="mt-2 bg-white/5 border-white/10"
                disabled={generating}
              />
            </div>
            {generateError && <p className="text-sm text-red-400">{generateError}</p>}
            {!generating && <Button type="submit" className="w-full">Generate 3–4 posts</Button>}
          </form>
          {generating && (
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <Avatar state="thinking" className="w-20 h-20" />
              <p className="text-xs text-slate-400">We’re analyzing the page and drafting your LinkedIn posts…</p>
            </div>
          )}
          {linkedInPosts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-display font-bold mb-4">Generated posts ({linkedInPosts.length}) — saved below</h3>
              <div className="space-y-4">
                {linkedInPosts.map((post, i) => renderPostCard(post, `modal-${i}`))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
