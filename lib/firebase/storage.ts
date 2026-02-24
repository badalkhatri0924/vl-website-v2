import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import app from './config'

const storage = getStorage(app)

function stripTokenFromDownloadUrl(fullUrl: string): string {
  const [base, query] = fullUrl.split('?')
  if (!query) return fullUrl

  const params = new URLSearchParams(query)
  const alt = params.get('alt')

  if (alt) {
    return `${base}?alt=${encodeURIComponent(alt)}`
  }

  return base
}

/**
 * Upload a raw image buffer for a Twitter post to Firebase Storage and return its download URL.
 * Images are stored under the `twitter-post-images/` prefix.
 */
export async function uploadTwitterPostImage(buffer: Buffer, mimeType: string): Promise<string> {
  const timestamp = Date.now()
  const extension = mimeType.split('/')[1] || 'png'
  const path = `twitter-post-images/post-${timestamp}-${Math.random().toString(36).slice(2)}.${extension}`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, buffer, { contentType: mimeType })
  const fullUrl = await getDownloadURL(storageRef)
  return stripTokenFromDownloadUrl(fullUrl)
}

/**
 * Upload a raw image buffer for a LinkedIn post to Firebase Storage and return its download URL.
 * Images are stored under the `linkedIn-post-images/` prefix.
 */
export async function uploadLinkedInPostImage(buffer: Buffer, mimeType: string): Promise<string> {
  const timestamp = Date.now()
  const extension = mimeType.split('/')[1] || 'png'
  const path = `linkedIn-post-images/post-${timestamp}-${Math.random().toString(36).slice(2)}.${extension}`
  const storageRef = ref(storage, path)

  await uploadBytes(storageRef, buffer, { contentType: mimeType })
  const fullUrl = await getDownloadURL(storageRef)
  return stripTokenFromDownloadUrl(fullUrl)
}

