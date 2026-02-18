import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase/config'

export interface NewPostItem {
  content: string
  hook?: string
  /** 0-based index into the batch's sourceArticles – which article this post is based on */
  sourceArticleIndex?: number
  copiedBy?: string
  copiedAt?: string
}

export interface SourceArticle {
  title: string
  link: string
}

export interface NewPostBatch {
  id: string
  newsCategory: string
  newsUrl: string
  /** Article sources used to generate posts – share these links to show where content came from */
  sourceArticles?: SourceArticle[]
  posts: NewPostItem[]
  createdAt: string
}

const COLLECTION_NAME = 'newsPosts'

function parseCreatedAt(data: { createdAt?: unknown }): string {
  const raw = data.createdAt
  if (raw && typeof (raw as { toDate?: () => Date }).toDate === 'function') {
    return (raw as { toDate: () => Date }).toDate().toISOString()
  }
  if (raw instanceof Timestamp) {
    return raw.toDate().toISOString()
  }
  if (typeof raw === 'string') {
    return raw
  }
  return new Date().toISOString()
}

function parseCopiedAt(raw: unknown): string | undefined {
  if (!raw) return undefined
  if (raw && typeof (raw as { toDate?: () => Date }).toDate === 'function') {
    return (raw as { toDate: () => Date }).toDate().toISOString()
  }
  if (raw instanceof Timestamp) return raw.toDate().toISOString()
  if (typeof raw === 'string') return raw
  return undefined
}

function normalizePosts(posts: unknown): NewPostItem[] {
  if (!Array.isArray(posts)) return []
  return posts.map((p) => {
    const item = p && typeof p === 'object' ? (p as Record<string, unknown>) : {}
    const rawIndex = item.sourceArticleIndex
    const sourceArticleIndex =
      typeof rawIndex === 'number' && Number.isFinite(rawIndex) && rawIndex >= 0
        ? Math.floor(rawIndex)
        : undefined
    return {
      content: typeof item.content === 'string' ? item.content : '',
      hook: typeof item.hook === 'string' ? item.hook : undefined,
      sourceArticleIndex,
      copiedBy: typeof item.copiedBy === 'string' ? item.copiedBy : undefined,
      copiedAt: parseCopiedAt(item.copiedAt),
    }
  })
}

function normalizeSourceArticles(raw: unknown): SourceArticle[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((a) => {
      const o = a && typeof a === 'object' ? (a as Record<string, unknown>) : {}
      const title = typeof o.title === 'string' ? o.title : ''
      const link = typeof o.link === 'string' ? o.link : ''
      return title && link ? { title, link } : null
    })
    .filter((a): a is SourceArticle => a !== null)
}

/**
 * List all saved news post batches (newest first)
 */
export async function getNewPostBatches(): Promise<NewPostBatch[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    const batches: NewPostBatch[] = []
    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      batches.push({
        id: docSnap.id,
        newsCategory: (data.newsCategory ?? data.productName) ?? '',
        newsUrl: (data.newsUrl ?? data.productUrl) ?? '',
        sourceArticles: normalizeSourceArticles(data.sourceArticles),
        posts: normalizePosts(data.posts),
        createdAt: parseCreatedAt(data),
      })
    })
    return batches
  } catch (err) {
    console.error('Error reading newPosts from Firestore:', err)
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      const batches: NewPostBatch[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        batches.push({
          id: docSnap.id,
          newsCategory: (data.newsCategory ?? data.productName) ?? '',
          newsUrl: (data.newsUrl ?? data.productUrl) ?? '',
          sourceArticles: normalizeSourceArticles(data.sourceArticles),
          posts: normalizePosts(data.posts),
          createdAt: parseCreatedAt(data),
        })
      })
      return batches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (fallback) {
      console.error('Fallback read newPosts failed:', fallback)
      return []
    }
  }
}

/**
 * Save a new batch of news posts to Firestore
 */
export async function addNewPostBatch(
  payload: Omit<NewPostBatch, 'id' | 'createdAt'>
): Promise<NewPostBatch> {
  const createdAt = Timestamp.now()
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    newsCategory: payload.newsCategory,
    newsUrl: payload.newsUrl,
    sourceArticles: payload.sourceArticles ?? [],
    posts: payload.posts,
    createdAt,
  })
  return {
    id: docRef.id,
    newsCategory: payload.newsCategory,
    newsUrl: payload.newsUrl,
    sourceArticles: payload.sourceArticles,
    posts: payload.posts,
    createdAt: createdAt.toDate().toISOString(),
  }
}

/**
 * Claim a news post as "copied by" a user. First writer wins.
 */
export async function claimNewPostCopy(
  batchId: string,
  postIndex: number,
  copiedBy: string
): Promise<boolean> {
  const docRef = doc(db, COLLECTION_NAME, batchId)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return false
  const data = snap.data()
  const posts = Array.isArray(data.posts) ? data.posts : []
  if (postIndex < 0 || postIndex >= posts.length) return false
  const existing = posts[postIndex] && typeof posts[postIndex] === 'object' ? (posts[postIndex] as Record<string, unknown>) : {}
  if (typeof existing.copiedBy === 'string' && existing.copiedBy.trim() !== '') return false
  const updatedPosts = [...posts]
  updatedPosts[postIndex] = {
    ...existing,
    content: existing.content ?? '',
    hook: existing.hook,
    copiedBy: copiedBy.trim(),
    copiedAt: Timestamp.now(),
  }
  await updateDoc(docRef, { posts: updatedPosts })
  return true
}
