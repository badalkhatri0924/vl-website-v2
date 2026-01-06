import { createClient } from '@sanity/client'
import { config } from './config'

/**
 * Get or create authenticated Sanity client with write permissions
 * Creates a new client instance to ensure token is always current
 */
export function getWriteClient() {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    throw new Error('SANITY_WRITE_TOKEN is required')
  }

  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false, // Never use CDN for writes
    token: token,
  })
}

/**
 * Create a blog post in Sanity
 */
export interface CreatePostData {
  title: string
  slug: string
  authorId: string
  category: string
  excerpt: string
  readTime: string
  body: any[] // PortableText content
  tags?: string[]
  publishedAt?: string
  mainImageAssetId?: string
}

export async function createBlogPost(data: CreatePostData): Promise<string> {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!token) {
    throw new Error('SANITY_WRITE_TOKEN is required for creating posts')
  }

  // Verify token is present (first 10 chars for logging, not full token)
  console.log('Using Sanity token:', token ? `${token.substring(0, 10)}...` : 'NOT SET')
  console.log('Project ID:', config.projectId)
  console.log('Dataset:', config.dataset)

  const document = {
    _type: 'post',
    title: data.title,
    slug: {
      _type: 'slug',
      current: data.slug,
    },
    author: {
      _type: 'reference',
      _ref: data.authorId,
    },
    category: data.category,
    excerpt: data.excerpt,
    readTime: data.readTime,
    body: data.body,
    publishedAt: data.publishedAt || new Date().toISOString(),
    ...(data.tags && data.tags.length > 0 && {
      tags: data.tags,
    }),
    ...(data.mainImageAssetId && {
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: data.mainImageAssetId,
        },
      },
    }),
  }

  try {
    const client = getWriteClient()
    const result = await client.create(document)
    
    // Verify the post was created with image
    if (data.mainImageAssetId) {
      console.log('Post created with image reference:', data.mainImageAssetId)
    } else {
      console.warn('Post created without image - mainImageAssetId was not provided')
    }
    
    return result._id
  } catch (error) {
    console.error('Error creating blog post:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload an image to Sanity from a URL and return the asset reference
 */
export async function uploadImageToSanity(
  imageUrl: string,
  filename: string = 'blog-image.jpg'
): Promise<string> {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN is required for uploading images')
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const client = getWriteClient()
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename,
      contentType: response.headers.get('content-type') || 'image/jpeg',
    })

    return asset._id
  } catch (error) {
    console.error('Error uploading image to Sanity:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload an image buffer directly to Sanity and return the asset reference
 * This is useful for AI-generated images
 */
export async function uploadImageBufferToSanity(
  imageBuffer: Buffer,
  filename: string = 'generated-image.png',
  contentType: string = 'image/png'
): Promise<{ assetId: string; url: string }> {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN is required for uploading images')
  }

  try {
    const client = getWriteClient()
    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
      contentType,
    })

    console.log('Image uploaded to Sanity successfully, asset ID:', asset._id)
    
    // Return both the asset ID and the URL
    return {
      assetId: asset._id,
      url: asset.url || '',
    }
  } catch (error) {
    console.error('Error uploading image buffer to Sanity:', error)
    throw new Error(`Failed to upload image buffer: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get all authors from Sanity
 * Fetches both published and draft authors
 */
export async function getAuthors(): Promise<Array<{ _id: string; name: string }>> {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('SANITY_WRITE_TOKEN is not set')
    return []
  }

  try {
    const client = getWriteClient()
    // Fetch all authors (both published and drafts)
    // Using writeClient with token allows access to drafts
    const authors = await client.fetch(`
      *[_type == "author"] | order(_createdAt desc) {
        _id,
        name
      }
    `)
    
    console.log(`Found ${authors.length} author(s) in Sanity`)
    if (authors.length > 0) {
      console.log('Author IDs:', authors.map((a: { _id: string; name: string }) => a._id))
    }
    
    return authors || []
  } catch (error) {
    console.error('Error fetching authors:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return []
  }
}

/**
 * Get default author ID (first author found)
 */
export async function getDefaultAuthorId(): Promise<string | null> {
  const authors = await getAuthors()
  return authors.length > 0 ? authors[0]._id : null
}

/**
 * Test if the Sanity token is valid by making a simple query
 */
export async function testSanityConnection(): Promise<boolean> {
  try {
    const token = process.env.SANITY_WRITE_TOKEN
    if (!token) {
      console.error('SANITY_WRITE_TOKEN is not set')
      return false
    }

    // Try a simple query to test the connection
    const client = getWriteClient()
    const result = await client.fetch(`*[_type == "author"][0]._id`)
    console.log('Sanity connection test successful')
    return true
  } catch (error) {
    console.error('Sanity connection test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    return false
  }
}

