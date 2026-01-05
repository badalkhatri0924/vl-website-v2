/**
 * Unified AI content generation service
 * Supports multiple free AI providers with fallback mechanism
 */

import { generateBlogContent, BlogContent } from './geminiService'
import { getCategoryPrompt } from '@/lib/content/categoryConfig'

export type AIProvider = 'gemini' | 'huggingface' | 'openrouter' | 'cohere'

export interface GenerateContentOptions {
  category: string
  topic?: string
  provider?: AIProvider
}

/**
 * Generate blog content using the specified AI provider
 */
export async function generateContent(
  options: GenerateContentOptions
): Promise<BlogContent> {
  const provider = options.provider || 'gemini'
  const prompt = getCategoryPrompt(options.category, options.topic)

  try {
    switch (provider) {
      case 'gemini':
        return await generateWithGemini(prompt, options.category)

      case 'huggingface':
        return await generateWithHuggingFace(prompt, options.category)

      case 'openrouter':
        return await generateWithOpenRouter(prompt, options.category)

      case 'cohere':
        return await generateWithCohere(prompt, options.category)

      default:
        throw new Error(`Unsupported AI provider: ${provider}`)
    }
  } catch (error) {
    console.error(`Error with ${provider}:`, error)
    
    // Fallback to Gemini if other provider fails
    if (provider !== 'gemini') {
      console.log('Falling back to Gemini...')
      try {
        return await generateWithGemini(prompt, options.category)
      } catch (fallbackError) {
        console.error('Fallback to Gemini also failed:', fallbackError)
        throw new Error('All AI providers failed. Please check your API keys and try again.')
      }
    }
    
    throw error
  }
}

/**
 * Generate content using Gemini (primary provider)
 */
async function generateWithGemini(
  prompt: string,
  category: string
): Promise<BlogContent> {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY (Gemini) is required')
  }
  return await generateBlogContent(prompt, category)
}

/**
 * Generate content using Hugging Face (optional free alternative)
 */
async function generateWithHuggingFace(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const { generateBlogContentWithHuggingFace } = await import('./huggingFaceService')
  return await generateBlogContentWithHuggingFace(prompt, category)
}

/**
 * Generate content using OpenRouter (optional free alternative)
 */
async function generateWithOpenRouter(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const { generateBlogContentWithOpenRouter } = await import('./openRouterService')
  return await generateBlogContentWithOpenRouter(prompt, category)
}

/**
 * Generate content using Cohere (optional free alternative)
 */
async function generateWithCohere(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const { generateBlogContentWithCohere } = await import('./cohereService')
  return await generateBlogContentWithCohere(prompt, category)
}

/**
 * Check if a provider is available (has API key)
 */
export function isProviderAvailable(provider: AIProvider): boolean {
  switch (provider) {
    case 'gemini':
      return !!process.env.API_KEY
    case 'huggingface':
      return !!process.env.HUGGING_FACE_API_KEY
    case 'openrouter':
      return !!process.env.OPENROUTER_API_KEY
    case 'cohere':
      return !!process.env.COHERE_API_KEY
    default:
      return false
  }
}

/**
 * Get available providers
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = ['gemini', 'huggingface', 'openrouter', 'cohere']
  return providers.filter(isProviderAvailable)
}

