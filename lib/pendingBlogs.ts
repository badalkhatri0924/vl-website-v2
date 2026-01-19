import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase/config'

export interface PendingBlogPost {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  body: string // Markdown content
  bodyPortableText: any[] // PortableText content
  tags?: string[]
  readTime: string
  authorId: string
  imageAssetId?: string
  imageUrl?: string
  createdAt: string
  publishStatus?: 'draft' | 'published'
}

const COLLECTION_NAME = 'blogListings'

/**
 * Read all pending blog posts from Firestore
 */
export async function getPendingBlogPosts(): Promise<PendingBlogPost[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const posts: PendingBlogPost[] = []
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      // Convert Firestore Timestamp to ISO string if needed
      let createdAt: string
      if (data.createdAt?.toDate) {
        createdAt = data.createdAt.toDate().toISOString()
      } else if (data.createdAt instanceof Timestamp) {
        createdAt = data.createdAt.toDate().toISOString()
      } else if (typeof data.createdAt === 'string') {
        createdAt = data.createdAt
      } else {
        createdAt = new Date().toISOString()
      }
      
      posts.push({
        id: docSnapshot.id,
        ...data,
        createdAt,
      } as PendingBlogPost)
    })
    
    return posts
  } catch (error) {
    console.error('Error reading pending blogs from Firestore:', error)
    // If orderBy fails (e.g., no index), try without ordering
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
      const posts: PendingBlogPost[] = []
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data()
        let createdAt: string
        if (data.createdAt?.toDate) {
          createdAt = data.createdAt.toDate().toISOString()
        } else if (data.createdAt instanceof Timestamp) {
          createdAt = data.createdAt.toDate().toISOString()
        } else if (typeof data.createdAt === 'string') {
          createdAt = data.createdAt
        } else {
          createdAt = new Date().toISOString()
        }
        
        posts.push({
          id: docSnapshot.id,
          ...data,
          createdAt,
        } as PendingBlogPost)
      })
      // Sort by createdAt descending manually
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (fallbackError) {
      console.error('Error reading pending blogs from Firestore (fallback):', fallbackError)
      return []
    }
  }
}

/**
 * Get a specific pending blog post by ID
 */
export async function getPendingBlogPost(id: string): Promise<PendingBlogPost | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnapshot = await getDoc(docRef)
    
    if (!docSnapshot.exists()) {
      return null
    }
    
    const data = docSnapshot.data()
    // Convert Firestore Timestamp to ISO string if needed
    let createdAt: string
    if (data.createdAt?.toDate) {
      createdAt = data.createdAt.toDate().toISOString()
    } else if (data.createdAt instanceof Timestamp) {
      createdAt = data.createdAt.toDate().toISOString()
    } else if (typeof data.createdAt === 'string') {
      createdAt = data.createdAt
    } else {
      createdAt = new Date().toISOString()
    }
    
    return {
      id: docSnapshot.id,
      ...data,
      createdAt,
    } as PendingBlogPost
  } catch (error) {
    console.error('Error getting pending blog post from Firestore:', error)
    return null
  }
}

/**
 * Add a new pending blog post to Firestore
 */
export async function addPendingBlogPost(post: Omit<PendingBlogPost, 'id' | 'createdAt'>): Promise<PendingBlogPost> {
  try {
    const createdAt = Timestamp.now()
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      createdAt,
    })
    
    return {
      id: docRef.id,
      ...post,
      createdAt: createdAt.toDate().toISOString(),
    } as PendingBlogPost
  } catch (error) {
    console.error('Error adding pending blog post to Firestore:', error)
    throw error
  }
}

/**
 * Remove a pending blog post by ID from Firestore
 */
export async function removePendingBlogPost(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnapshot = await getDoc(docRef)
    
    if (!docSnapshot.exists()) {
      return false // Post not found
    }
    
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error removing pending blog post from Firestore:', error)
    return false
  }
}
