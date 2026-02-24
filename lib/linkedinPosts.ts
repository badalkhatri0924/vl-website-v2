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

export interface LinkedInPostItem {
  content: string
  hook?: string
  /** Optional image for this LinkedIn-style post */
  imageUrl?: string
  copiedBy?: string
  copiedAt?: string
}

export interface LinkedInPostBatch {
  id: string
  productName: string
  productUrl: string
  posts: LinkedInPostItem[]
  createdAt: string
}

const COLLECTION_NAME = 'linkedinPosts'

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

function normalizePosts(posts: unknown): LinkedInPostItem[] {
  if (!Array.isArray(posts)) return []
  return posts.map((p) => {
    const item = p && typeof p === 'object' ? p as Record<string, unknown> : {}
    return {
      content: typeof item.content === 'string' ? item.content : '',
      hook: typeof item.hook === 'string' ? item.hook : undefined,
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : undefined,
      copiedBy: typeof item.copiedBy === 'string' ? item.copiedBy : undefined,
      copiedAt: parseCopiedAt(item.copiedAt),
    }
  })
}

/**
 * List all saved LinkedIn post batches (newest first)
 */
export async function getLinkedInPostBatches(): Promise<LinkedInPostBatch[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    const batches: LinkedInPostBatch[] = []
    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      batches.push({
        id: docSnap.id,
        productName: data.productName ?? '',
        productUrl: data.productUrl ?? '',
        posts: normalizePosts(data.posts),
        createdAt: parseCreatedAt(data),
      })
    })
    return batches
  } catch (err) {
    console.error('Error reading LinkedIn posts from Firestore:', err)
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME))
      const batches: LinkedInPostBatch[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        batches.push({
          id: docSnap.id,
          productName: data.productName ?? '',
          productUrl: data.productUrl ?? '',
          posts: normalizePosts(data.posts),
          createdAt: parseCreatedAt(data),
        })
      })
      return batches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (fallback) {
      console.error('Fallback read failed:', fallback)
      return []
    }
  }
}

/**
 * Save a new batch of LinkedIn posts to Firestore
 */
export async function addLinkedInPostBatch(
  payload: Omit<LinkedInPostBatch, 'id' | 'createdAt'>
): Promise<LinkedInPostBatch> {
  const createdAt = Timestamp.now()
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    productName: payload.productName,
    productUrl: payload.productUrl,
    posts: payload.posts,
    createdAt,
  })
  return {
    id: docRef.id,
    productName: payload.productName,
    productUrl: payload.productUrl,
    posts: payload.posts,
    createdAt: createdAt.toDate().toISOString(),
  }
}

/**
 * Claim a post as "copied by" a user. First writer wins; returns false if already claimed.
 */
export async function claimPostCopy(
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
