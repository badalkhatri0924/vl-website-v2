'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'
import { PendingBlogPost } from '@/lib/pendingBlogs'
import ReactMarkdown from 'react-markdown'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import { Avatar } from './Avatar'

const BLOG_ADMIN_PASSWORD = 'vl@2025'
const BLOG_ADMIN_AUTH_KEY = 'blog-admin-auth'

function getDisplayMarkdownFromBody(post: PendingBlogPost): string {
  const rawBody = post.body
  if (!rawBody) return ''

  const trimmed = rawBody.trim()

  // Handle legacy entries where the entire JSON payload was stored in `body`
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)

      // If the parsed value itself is a markdown string
      if (typeof parsed === 'string') {
        return parsed
      }

      // If the JSON has a `body` field containing markdown
      if (parsed && typeof parsed.body === 'string') {
        return parsed.body
      }
    } catch {
      // Fall through to returning the raw body below
    }
  }

  return rawBody
}

export default function BlogAdminPage() {
  const [pendingPosts, setPendingPosts] = useState<PendingBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<PendingBlogPost | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null) // Format: "postId-action" e.g., "post123-approve-draft"
  const [isGenerating, setIsGenerating] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  // Authors are now always resolved to the default author in the backend.
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [enteredPassword, setEnteredPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  // On mount, check blog admin auth status from localStorage
  useEffect(() => {
    try {
      const storedAuth =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(BLOG_ADMIN_AUTH_KEY)
          : null

      if (storedAuth === 'authenticated') {
        setIsAuthenticated(true)
        setShowLoginDialog(false)
      } else {
        setShowLoginDialog(true)
      }
    } catch (error) {
      console.error('Error reading blog admin auth from localStorage', error)
      setShowLoginDialog(true)
    } finally {
      setCheckingAuth(false)
    }
  }, [])

  // Once authenticated, load pending posts and generator metadata
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingPosts()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    if (!enteredPassword.trim()) {
      setLoginError('Password is required.')
      return
    }

    if (enteredPassword === BLOG_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setShowLoginDialog(false)
      setLoginError('')
      try {
        window.localStorage.setItem(BLOG_ADMIN_AUTH_KEY, 'authenticated')
      } catch (error) {
        console.error('Error saving blog admin auth to localStorage', error)
      }
    } else {
      setLoginError('Incorrect password. Please try again.')
      setEnteredPassword('')
    }
  }

  const fetchPendingPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog/pending')
      const data = await response.json()
      if (data.success) {
        setPendingPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching pending posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Always create as draft; publish is handled via Approve flow
          publishStatus: 'draft',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNotification({
          message: `New blog generated and added to pending review`,
          type: 'success',
        })
        await fetchPendingPosts()
        setTimeout(() => setNotification(null), 3000)
      } else {
        setNotification({
          message: data?.error || data?.message || 'Failed to generate blog post',
          type: 'error',
        })
        setTimeout(() => setNotification(null), 5000)
      }
    } catch (error) {
      console.error('Error generating blog post:', error)
      setNotification({
        message: 'Unexpected error while generating blog post',
        type: 'error',
      })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApprove = async (pendingId: string, publishStatus: 'draft' | 'published' = 'draft') => {
    try {
      setProcessing(`${pendingId}-approve-${publishStatus}`)
      const response = await fetch('/api/blog/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pendingId, publishStatus }),
      })

      const data = await response.json()
      if (data.success) {
        setNotification({ message: `Blog post approved and saved to Sanity as ${publishStatus}!`, type: 'success' })
        await fetchPendingPosts()
        if (selectedPost?.id === pendingId) {
          setIsDetailsOpen(false)
          setSelectedPost(null)
        }
        setTimeout(() => setNotification(null), 3000)
      } else {
        setNotification({ message: `Error: ${data.error || data.message}`, type: 'error' })
        setTimeout(() => setNotification(null), 5000)
      }
    } catch (error) {
      console.error('Error approving post:', error)
      setNotification({ message: 'Failed to approve blog post', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (pendingId: string) => {
    try {
      setProcessing(`${pendingId}-reject`)
      const response = await fetch('/api/blog/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pendingId }),
      })

      const data = await response.json()
      if (data.success) {
        setNotification({ message: 'Blog post rejected and removed', type: 'success' })
        await fetchPendingPosts()
        if (selectedPost?.id === pendingId) {
          setIsDetailsOpen(false)
          setSelectedPost(null)
        }
        setTimeout(() => setNotification(null), 3000)
      } else {
        setNotification({ message: `Error: ${data.error || data.message}`, type: 'error' })
        setTimeout(() => setNotification(null), 5000)
      }
    } catch (error) {
      console.error('Error rejecting post:', error)
      setNotification({ message: 'Failed to reject blog post', type: 'error' })
      setTimeout(() => setNotification(null), 5000)
    } finally {
      setProcessing(null)
    }
  }

  const handleViewDetails = (post: PendingBlogPost) => {
    setSelectedPost(post)
    setIsDetailsOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-black mb-8">Blog Admin</h1>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar state="thinking" className="w-48 h-48" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-100">
                  Checking admin access…
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Verifying your secure session before loading the blog tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-black mb-8">Blog Admin</h1>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar state="thinking" className="w-48 h-48" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-100">
                  Loading pending blog posts…
                </p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Fetching drafts from Firebase and preparing them for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-obsidian-950 text-white pt-28 md:pt-32 pb-24 md:pb-32 px-4 md:px-8">
      {/* Password Dialog */}
      {!checkingAuth && (
        <Dialog open={showLoginDialog} onOpenChange={() => {}}>
          <DialogContent className="max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-center justify-center">
                <Lock size={24} className="text-accent" />
                <span>Enter Password</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin()
                    }
                  }}
                  placeholder="Enter password"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-400 font-sans">{loginError}</p>
              )}

              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Main content only visible when authenticated */}
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto relative">
        <h1 className="text-3xl md:text-4xl font-display font-black mb-2">Blog Admin</h1>
        <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base">Review and manage pending blog posts</p>

        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          <p className="text-sm text-slate-400 max-w-xl">
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Button
              variant="secondary"
              onClick={() => setShowHowItWorks(true)}
              className="w-full sm:w-auto"
            >
              How This Works
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open('/studio', '_blank')}
              className="w-full sm:w-auto"
            >
              Open Sanity Studio
            </Button>
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? 'Generating...' : 'Generate New Blog'}
            </Button>
          </div>
        </div>

        {/* How it works dialog */}
        <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>How the Blog Admin works</DialogTitle>
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(false)}
                  className="ml-4 text-slate-400 hover:text-white text-2xl leading-none px-2"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </DialogHeader>
            <div className="space-y-4 text-sm text-slate-300 mt-2">
              <p>
                This page lets you generate AI-written deep-dive posts and control exactly what gets published to the public blog.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>
                  <span className="font-semibold text-white">Generate New Blog</span> runs the AI prompt, creates a new article,
                  and saves it in Firebase (collection <span className="font-mono text-white">blogListings</span>) as a
                  <span className="font-semibold"> pending</span> post with image, tags, and metadata that are then shown in
                  this admin list.
                </li>
                <li>
                  Each card in the grid shows the generated image, title, excerpt, read time, and tags. Use{' '}
                  <span className="font-semibold text-white">View Details</span> to read the full content.
                </li>
                <li>
                  Use the action buttons:
                  <ul className="mt-1 ml-5 list-disc space-y-1">
                    <li><span className="font-semibold text-white">Draft</span> – save into Sanity as an unpublished draft.</li>
                    <li><span className="font-semibold text-white">Publish</span> – save into Sanity and make the post live on the blog.</li>
                    <li><span className="font-semibold text-red-400">Reject</span> – delete the pending post if you do not want to use it.</li>
                  </ul>
                </li>
              </ol>
              <p className="text-xs text-slate-500">
                Changes only go live on the public site when you choose{' '}
                <span className="font-semibold text-emerald-400">Publish</span>.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed bottom-8 right-8 z-[200] max-w-3xl min-w-[320px] w-[calc(100%-4rem)] sm:w-auto p-5 rounded-lg shadow-2xl border backdrop-blur-sm transform transition-all duration-300 ease-out ${
            notification.type === 'success' 
              ? 'bg-green-600/90 border-green-500 text-white' 
              : 'bg-red-600/90 border-red-500 text-white'
          } transition-all duration-300`}>
            <p className="text-sm">{notification.message}</p>
            {/* <button
              onClick={() => setNotification(null)}
              className="text-white/80 hover:text-white transition-colors text-sm"
              aria-label="Close notification"
            >
              ×
            </button> */}
          </div>
        )}

        {/* Full-screen loader while generating a new blog */}
        {isGenerating && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/75 backdrop-blur-sm">
            <div className="relative bg-obsidian-950/95 border border-white/10 rounded-3xl px-12 py-10 flex flex-col items-center gap-7 shadow-[0_0_60px_rgba(15,23,42,0.9)] overflow-hidden">
              {/* Soft radial glow background */}
              <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(251,146,60,0.16),_transparent_55%)]" />

              {/* Avatar + world-orbit animation */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outer orbit ring */}
                <div className="absolute inset-4 rounded-full border border-accent/25 animate-spin slow-spin" />
                {/* Orbiting nodes */}
                <div className="absolute -top-1 left-1 w-3 h-3 rounded-full bg-accent/80 shadow-[0_0_15px_rgba(56,189,248,0.9)] animate-bounce" />
                <div className="absolute bottom-2 right-3 w-2.5 h-2.5 rounded-full bg-orange-400/90 shadow-[0_0_15px_rgba(251,146,60,0.9)] animate-ping" />

                {/* Core bot avatar */}
                <div className="relative w-24 h-24 rounded-[1.75rem] bg-gradient-to-br from-accent via-sky-500 to-orange-400 flex items-center justify-center shadow-[0_0_45px_rgba(56,189,248,0.65)]">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse delay-150" />
                    </div>
                  </div>
                  {/* Small antenna */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 rounded-full bg-black" />
                </div>

                {/* Floating platform shadow */}
                <div className="absolute inset-x-10 bottom-4 h-4 rounded-full bg-black/80 blur-md opacity-70" />
              </div>

              <div className="relative text-center space-y-2 max-w-md">
                <p className="text-sm font-medium tracking-wide text-slate-50">
                  Generating a new deep-dive article…
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mapping ideas across education, workforce and infrastructure, then composing a Version Labs insight and matching visual in the background.
                </p>
              </div>
            </div>
          </div>
        )}

        {pendingPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-400">No pending blog posts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pendingPosts.map((post) => (
              <Card key={post.id} className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="space-y-4">
                    {/* Image on top */}
                    {post.imageUrl && (
                      <div className="w-full max-w-3xl mx-auto">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full max-h-[260px] object-cover rounded-lg border border-white/10"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div>
                      <h2 className="text-2xl font-display font-bold mb-2">{post.title}</h2>
                      <p className="text-slate-300 mb-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>Read Time: <span className="text-white">{post.readTime}</span></span>
                        <span>Created: <span className="text-white">{formatDate(post.createdAt)}</span></span>
                        {post.tags && post.tags.length > 0 && (
                          <span>Tags: <span className="text-white">{post.tags.join(', ')}</span></span>
                        )}
                      </div>
                    </div>

                    {/* Buttons in one row */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleReject(post.id)}
                        disabled={processing === `${post.id}-reject`}
                        className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white hover:text-white border-red-600"
                      >
                        {processing === `${post.id}-reject` ? 'Processing...' : 'Reject'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(post.id, 'draft')}
                        disabled={processing === `${post.id}-approve-draft`}
                        className="flex-1 min-w-[150px] bg-amber-500 hover:bg-amber-600"
                      >
                        {processing === `${post.id}-approve-draft` ? 'Processing...' : 'Draft'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(post.id, 'published')}
                        disabled={processing === `${post.id}-approve-published`}
                        className="flex-1 min-w-[170px] bg-green-600 hover:bg-green-700"
                      >
                        {processing === `${post.id}-approve-published` ? 'Processing...' : 'Publish'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewDetails(post)}
                        disabled={processing?.startsWith(`${post.id}-`)}
                        className="flex-1 min-w-[120px]"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent 
            className="max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClose={() => setIsDetailsOpen(false)}
          >
            <DialogHeader>
              <DialogTitle className="pr-8 break-words">{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6 overflow-y-auto flex-1 pr-2 -mr-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Excerpt</h3>
                  <p className="text-gray-400 break-words">{selectedPost.excerpt}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Content</h3>
                  <div className="prose prose-invert max-w-none text-gray-400 break-words overflow-x-hidden [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>h5]:text-white [&>h6]:text-white [&>h1]:mt-6 [&>h2]:mt-6 [&>h3]:mt-4 [&>h4]:mt-4 [&>h5]:mt-3 [&>h6]:mt-3 [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h1]:font-bold [&>h2]:font-semibold [&>h3]:font-semibold [&>p]:text-gray-400 [&>p]:break-words [&>ul]:text-gray-400 [&>ol]:text-gray-400 [&>li]:text-gray-400 [&>li]:break-words [&>code]:bg-slate-800 [&>code]:text-slate-200 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:break-all [&>pre]:bg-slate-900 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:max-w-full [&>a]:text-blue-400 [&>a]:hover:text-blue-300 [&>a]:break-all">
                    {selectedPost.bodyPortableText && Array.isArray(selectedPost.bodyPortableText) && selectedPost.bodyPortableText.length > 0 ? (
                      <PortableTextRenderer content={selectedPost.bodyPortableText} />
                    ) : (
                      <ReactMarkdown>{getDisplayMarkdownFromBody(selectedPost)}</ReactMarkdown>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="break-words">
                    <span className="text-slate-400">Read Time:</span>
                    <span className="ml-2 text-white">{selectedPost.readTime}</span>
                  </div>
                  <div className="break-words col-span-2">
                    <span className="text-slate-400">Slug:</span>
                    <span className="ml-2 text-white break-all">{selectedPost.slug}</span>
                  </div>
                  <div className="break-words">
                    <span className="text-slate-400">Created:</span>
                    <span className="ml-2 text-white">{formatDate(selectedPost.createdAt)}</span>
                  </div>
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="col-span-2 break-words">
                      <span className="text-slate-400">Tags:</span>
                      <span className="ml-2 text-white">{selectedPost.tags.join(', ')}</span>
                    </div>
                  )}
                </div>

                {selectedPost.imageUrl && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
                    <div className="w-full max-w-3xl mx-auto">
                      <img 
                        src={selectedPost.imageUrl} 
                        alt={selectedPost.title}
                        className="w-full max-h-[420px] object-cover rounded-lg border border-white/10"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-white/10 flex-wrap">
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(selectedPost.id)}
                    disabled={processing === `${selectedPost.id}-reject`}
                    className="bg-red-600 hover:bg-red-700 text-white hover:text-white border-red-600"
                  >
                    {processing === `${selectedPost.id}-reject` ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(selectedPost.id, 'draft')}
                    disabled={processing === `${selectedPost.id}-approve-draft`}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    {processing === `${selectedPost.id}-approve-draft` ? 'Processing...' : 'Draft'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(selectedPost.id, 'published')}
                    disabled={processing === `${selectedPost.id}-approve-published`}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing === `${selectedPost.id}-approve-published` ? 'Processing...' : 'Publish'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleViewDetails(selectedPost)}
                    disabled={processing?.startsWith(`${selectedPost.id}-`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* No dialog – clicking "Generate New Blog" now starts generation immediately */}
      </div>
      )}
    </div>
  )
}
