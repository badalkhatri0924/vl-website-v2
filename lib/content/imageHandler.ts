/**
 * Image handling utilities for content
 * Supports Gemini image generation, Unsplash, and placeholders
 */

import { generateImageWithGemini, generateImagePromptForBlog } from '@/services/geminiService'

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random'
// Using a simpler placeholder that's more reliable
const PLACEHOLDER_IMAGE_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjMwIiBmaWxsPSIjNEE1NTY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZlcnNpb25MYWJzIEJsb2c8L3RleHQ+PC9zdmc+'

/**
 * Fetch an image from Unsplash based on a search query
 */
export async function fetchUnsplashImage(query: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY not set, using placeholder image')
    return PLACEHOLDER_IMAGE_URL
  }

  try {
    const url = new URL(UNSPLASH_API_URL)
    url.searchParams.set('query', query)
    url.searchParams.set('orientation', 'landscape')
    url.searchParams.set('client_id', accessKey)

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      console.warn(`Unsplash API error: ${response.statusText}`)
      return PLACEHOLDER_IMAGE_URL
    }

    const data = await response.json()
    return data.urls?.regular || data.urls?.full || PLACEHOLDER_IMAGE_URL
  } catch (error) {
    console.error('Error fetching Unsplash image:', error)
    return PLACEHOLDER_IMAGE_URL
  }
}

/**
 * Get a placeholder image URL
 */
export function getPlaceholderImage(): string {
  return PLACEHOLDER_IMAGE_URL
}

/**
 * Generate enhanced image search query using Gemini API
 * Uses Gemini to create better search terms for finding relevant images
 */
export async function generateImageSearchQueryWithGemini(
  title: string,
  category: string,
  topic?: string
): Promise<string> {
  const apiKey = process.env.API_KEY
  if (!apiKey) {
    // Fallback to basic search query
    return topic ? `${category} ${topic}` : category
  }

  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    const prompt = `Generate a concise, effective image search query (2-4 words) for finding a professional blog post featured image.

Article Title: "${title}"
Category: "${category}"
${topic ? `Topic: "${topic}"` : ''}

The search query should:
- Be specific and relevant to the article content
- Focus on visual concepts (not abstract ideas)
- Use terms that would return professional, modern images
- Be suitable for a government technology company blog
- Avoid generic terms

Return ONLY the search query, nothing else. Example: "digital governance technology" or "education technology learning"`

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.5,
        topP: 0.8,
      },
    })

    const searchQuery = (response.text || '').trim().replace(/["']/g, '')
    console.log('Gemini-generated image search query:', searchQuery)
    
    return searchQuery || (topic ? `${category} ${topic}` : category)
  } catch (error) {
    console.warn('Failed to generate image search query with Gemini, using fallback:', error)
    return topic ? `${category} ${topic}` : category
  }
}

/**
 * Generate image URL based on category and topic
 * Uses Gemini to enhance search queries, then tries Unsplash → Placeholder
 */
export async function getImageForCategory(
  category: string,
  topic?: string,
  title?: string
): Promise<string> {
  let searchQuery: string

  // Use Gemini to generate better search query if title is provided
  if (title) {
    try {
      searchQuery = await generateImageSearchQueryWithGemini(title, category, topic)
      console.log('Using Gemini-enhanced search query:', searchQuery)
    } catch (error) {
      console.warn('Failed to generate search query with Gemini, using fallback')
      // Fallback to basic mapping
      const categoryImageMap: Record<string, string> = {
        'Sovereign AI': 'digital governance technology',
        'LMS Scaling': 'education technology learning',
        'Product Design': 'user interface design',
      }
      searchQuery = topic 
        ? `${categoryImageMap[category] || category} ${topic}`
        : categoryImageMap[category] || category
    }
  } else {
    // Basic mapping without Gemini
    const categoryImageMap: Record<string, string> = {
      'Sovereign AI': 'digital governance technology',
      'LMS Scaling': 'education technology learning',
      'Product Design': 'user interface design',
    }
    searchQuery = topic 
      ? `${categoryImageMap[category] || category} ${topic}`
      : categoryImageMap[category] || category
  }

  // Try Unsplash with enhanced search query
  try {
    const unsplashImage = await fetchUnsplashImage(searchQuery)
    if (unsplashImage && unsplashImage !== PLACEHOLDER_IMAGE_URL) {
      console.log('Successfully fetched image from Unsplash')
      return unsplashImage
    }
  } catch (error) {
    console.warn('Unsplash image fetch failed:', error)
  }

  // Fallback to placeholder
  console.log('Using placeholder image as fallback')
  return getPlaceholderImage()
}

/**
 * Calculate read time from word count
 */
export function calculateReadTime(wordCount: number): string {
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(wordCount / 200)
  return `${minutes} MIN READ`
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Generate an image for a blog post using Gemini Imagen
 * Returns the image buffer and metadata
 */
export async function generateBlogImage(
  title: string,
  category: string,
  excerpt?: string,
  imageConcept?: string,
  inputTopic?: string
): Promise<{ imageData: Buffer; mimeType: string } | null> {
  try {
    // First, generate an optimized prompt for the image
    console.log('Generating image prompt for blog post...')
    const imagePrompt = await generateImagePromptForBlog(
      title,
      category,
      excerpt,
      imageConcept,
      inputTopic
    )
    
    console.log('Generating image with Gemini Imagen...')
    console.log('Image prompt:', imagePrompt)
    
    // Generate the image using Gemini
    const result = await generateImageWithGemini(imagePrompt)
    
    if (result) {
      console.log('Image generated successfully')
      return result
    } else {
      console.warn('Failed to generate image with Gemini')
      return null
    }
  } catch (error) {
    console.error('Error in generateBlogImage:', error)
    return null
  }
}

/**
 * Generate an AI image URL for short-form content (currently used for Twitter posts).
 * NEVER uploads to Sanity – returns a data URL from Gemini or falls back to Unsplash/placeholder.
 */
export async function generateImageForShortContent(
  text: string,
  options?: { contextLabel?: string }
): Promise<string | null> {
  const trimmed = (text || '').trim()
  if (!trimmed) return null

  const apiKey = process.env.API_KEY
  // If we don't have Gemini configured, fall back to Unsplash helper
  if (!apiKey) {
    const fallbackQuery = options?.contextLabel ? `${options.contextLabel} ${trimmed}` : trimmed
    return await getImageForCategory(fallbackQuery, trimmed, trimmed)
  }

  try {
    const maxExcerpt = trimmed.slice(0, 280)
    const label = options?.contextLabel || 'social post'

    const prompt = `Create a high-quality, wide 16:9 landscape image that visually represents the following ${label}.
The image must not contain any text or logos. It should feel modern, professional, and suitable for a technology and policy audience.

Post content:
"${maxExcerpt}"

Focus on the core idea of the post and illustrate it metaphorically or contextually.`

    const result = await generateImageWithGemini(prompt)
    if (!result || !result.imageData) {
      console.warn('Gemini Imagen did not return image data for short content, falling back to Unsplash.')
      const fallbackQuery = options?.contextLabel ? `${options.contextLabel} ${trimmed}` : trimmed
      return await getImageForCategory(fallbackQuery, trimmed, trimmed)
    }

    // Return a data URL only – no Sanity upload for short content
    const base64 = result.imageData.toString('base64')
    return `data:${result.mimeType};base64,${base64}`
  } catch (error) {
    console.error('Error generating Gemini image for short content, falling back to Unsplash:', error)
    const fallbackQuery = options?.contextLabel ? `${options.contextLabel} ${text}` : text
    try {
      return await getImageForCategory(fallbackQuery, text, text)
    } catch {
      return getPlaceholderImage()
    }
  }
}

