import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import app from './config'

const storage = getStorage(app)

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

  // Strip any access token; keep only base URL with ?alt=media to avoid storing sensitive tokens
  const [base, query] = fullUrl.split('?')
  if (!query) return fullUrl

  const params = new URLSearchParams(query)
  const alt = params.get('alt')

  if (alt) {
    return `${base}?alt=${encodeURIComponent(alt)}`
  }

  return base
}

