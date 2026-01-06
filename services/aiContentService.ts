/**
 * Unified AI content generation service
 * Supports multiple free AI providers with fallback mechanism
 */

import { generateBlogContent, BlogContent } from './geminiService'
import { getCategoryPrompt } from '@/lib/content/categoryConfig'

export interface GenerateContentOptions {
  category: string
  topic?: string
}

/**
 * Generate blog content using Gemini
 */
export async function generateContent(
  options: GenerateContentOptions
): Promise<BlogContent> {
  const prompt = getCategoryPrompt(options.category, options.topic)

  try {
    return await generateWithGemini(prompt, options.category)
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw new Error('Failed to generate content with Gemini. Please check your API key and try again.')
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

// Gemini is the only provider now, so no provider availability helpers are needed.

