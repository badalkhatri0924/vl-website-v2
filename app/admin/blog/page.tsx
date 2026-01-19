'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PendingBlogPost } from '@/lib/pendingBlogs'
import ReactMarkdown from 'react-markdown'

export default function BlogAdminPage() {
  const [pendingPosts, setPendingPosts] = useState<PendingBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<PendingBlogPost | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null) // Format: "postId-action" e.g., "post123-approve-draft"
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [categories, setCategories] = useState<Array<{ name: string; description?: string; topics?: string[] }>>([])
  const [authors, setAuthors] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [generateCategory, setGenerateCategory] = useState<string>('')
  const [generateTopic, setGenerateTopic] = useState<string>('')
  const [generateAuthorId, setGenerateAuthorId] = useState<string>('')

  useEffect(() => {
    fetchPendingPosts()
    fetchCategories()
  }, [])

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

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await fetch('/api/blog/generate', {
        method: 'GET',
      })
      const data = await response.json()
      if (response.ok) {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories)
          if (!generateCategory && data.categories.length > 0) {
            setGenerateCategory(data.categories[0].name)
          }
        }
        if (Array.isArray(data.authors)) {
          setAuthors(data.authors)
          // Keep generateAuthorId empty by default so the
          // "Use default author from Sanity" option stays selected.
        }
      }      
    } catch (error) {
      console.error('Error fetching categories for generator:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleGenerate = async () => {
    if (!generateCategory) {
      setNotification({
        message: 'Please select a category before generating.',
        type: 'error',
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    try {
      setIsGenerating(true)
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: generateCategory,
          topic: generateTopic || undefined,
          authorId: generateAuthorId || undefined,
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
        setIsGenerateDialogOpen(false)
        setGenerateTopic('')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-black mb-8">Blog Admin</h1>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-white pt-32 pb-32 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display font-black mb-2">Blog Admin</h1>
        <p className="text-slate-400 mb-8">Review and manage pending blog posts</p>

        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            Generate a new AI-written blog post as a draft and send it to the pending list for review.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => window.open('/studio', '_blank')}
            >
              Open Sanity Studio
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsGenerateDialogOpen(true)}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate New Blog'}
            </Button>
          </div>
        </div>

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

        {pendingPosts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-400">No pending blog posts</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-display font-bold mb-2">{post.title}</h2>
                      <p className="text-slate-300 mb-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span>Category: <span className="text-white">{post.category}</span></span>
                        <span>Read Time: <span className="text-white">{post.readTime}</span></span>
                        <span>Created: <span className="text-white">{formatDate(post.createdAt)}</span></span>
                        {post.tags && post.tags.length > 0 && (
                          <span>Tags: <span className="text-white">{post.tags.join(', ')}</span></span>
                        )}
                      </div>
                      {post.imageUrl && (
                        <div className="mt-4">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="max-w-xs rounded-lg border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px] flex-shrink-0">
                      <Button
                        variant="secondary"
                        onClick={() => handleViewDetails(post)}
                        disabled={processing?.startsWith(`${post.id}-`)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(post.id, 'draft')}
                        disabled={processing === `${post.id}-approve-draft`}
                      >
                        {processing === `${post.id}-approve-draft` ? 'Processing...' : 'Approve as Draft'}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleApprove(post.id, 'published')}
                        disabled={processing === `${post.id}-approve-published`}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing === `${post.id}-approve-published` ? 'Processing...' : 'Approve & Publish'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleReject(post.id)}
                        disabled={processing === `${post.id}-reject`}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/30"
                      >
                        {processing === `${post.id}-reject` ? 'Processing...' : 'Reject'}
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
                    <ReactMarkdown>{selectedPost.body}</ReactMarkdown>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="break-words">
                    <span className="text-slate-400">Category:</span>
                    <span className="ml-2 text-white">{selectedPost.category}</span>
                  </div>
                  <div className="break-words">
                    <span className="text-slate-400">Read Time:</span>
                    <span className="ml-2 text-white">{selectedPost.readTime}</span>
                  </div>
                  <div className="break-words">
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
                    variant="primary"
                    onClick={() => handleApprove(selectedPost.id, 'draft')}
                    disabled={processing === `${selectedPost.id}-approve-draft`}
                  >
                    {processing === `${selectedPost.id}-approve-draft` ? 'Processing...' : 'Approve as Draft'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(selectedPost.id, 'published')}
                    disabled={processing === `${selectedPost.id}-approve-published`}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing === `${selectedPost.id}-approve-published` ? 'Processing...' : 'Approve & Publish'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(selectedPost.id)}
                    disabled={processing === `${selectedPost.id}-reject`}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/30"
                  >
                    {processing === `${selectedPost.id}-reject` ? 'Processing...' : 'Reject'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Generate Blog Dialog */}
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent className="max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="pr-8 break-words">Generate New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 overflow-y-auto flex-1 pr-1 -mr-1">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Category
                </label>
                <select
                  value={generateCategory}
                  onChange={(e) => setGenerateCategory(e.target.value)}
                  disabled={isGenerating || isLoadingCategories}
                  className="w-full rounded-md bg-obsidian-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  {categories.length === 0 && (
                    <option value="">
                      {isLoadingCategories ? 'Loading categories...' : 'No categories available'}
                    </option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {generateCategory && (
                  <p className="text-xs text-slate-400">
                    {categories.find((c) => c.name === generateCategory)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Author (optional)
                </label>
                <select
                  value={generateAuthorId}
                  onChange={(e) => setGenerateAuthorId(e.target.value)}
                  disabled={isGenerating || authors.length === 0}
                  className="w-full rounded-md bg-obsidian-900 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  {authors.length === 0 && (
                    <option value="">
                      No authors found in Sanity (default author will be used)
                    </option>
                  )}
                  {authors.length > 0 && (
                    <>
                      <option value="">
                        Use default author from Sanity
                      </option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <p className="text-xs text-slate-400">
                  If left empty, the default author configured in Sanity will be used.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Topic (optional)
                </label>
                <input
                  type="text"
                  value={generateTopic}
                  onChange={(e) => setGenerateTopic(e.target.value)}
                  placeholder="Let AI choose, or specify a topic..."
                  disabled={isGenerating}
                  className="w-full rounded-md bg-obsidian-900 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                />
                <p className="text-xs text-slate-400">
                  If left empty, AI will automatically choose a relevant topic for this category.
                </p>
                {generateCategory && categories.find((c) => c.name === generateCategory)?.topics && (
                  <p className="text-xs text-slate-400">
                    Suggested topics:{' '}
                    {categories
                      .find((c) => c.name === generateCategory)
                      ?.topics?.slice(0, 5)
                      .join(', ')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="secondary"
                  onClick={() => setIsGenerateDialogOpen(false)}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={isGenerating || !generateCategory}
                >
                  {isGenerating ? 'Generating...' : 'Generate Blog'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
