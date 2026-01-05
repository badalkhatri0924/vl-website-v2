/**
 * OpenRouter API service for blog content generation
 * Provides access to multiple free and paid models
 */

import { BlogContent } from './geminiService'

/**
 * Generate blog content using OpenRouter API
 * Uses free models like Llama 3 or Mistral when available
 */
export async function generateBlogContentWithOpenRouter(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for OpenRouter service')
  }

  // Use a free model - check OpenRouter docs for current free models
  // Common free models: meta-llama/Llama-3-8b-instruct:free, mistralai/mistral-7b-instruct:free
  const model = 'meta-llama/llama-3-8b-instruct:free'

  const blogGenerationPrompt = `${prompt}

Please generate a complete blog post with the following structure:
1. Title: A compelling, SEO-friendly title (max 80 characters)
2. Excerpt: A brief summary (max 200 characters) that captures the essence of the post
3. Body: The full blog post content in markdown format (800-2000 words)
4. Tags: 3-5 relevant tags as a comma-separated list

Format your response as JSON with the following structure:
{
  "title": "Your blog post title",
  "excerpt": "Your excerpt here",
  "body": "Your markdown content here",
  "tags": ["tag1", "tag2", "tag3"]
}

Ensure the content is well-structured with proper markdown formatting including headings (##, ###), paragraphs, lists, and emphasis.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'VersionLabs Blog Generator',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a professional content writer for VersionLabs, a government technology firm. Write high-quality, authoritative blog posts about ${category} topics.`,
          },
          {
            role: 'user',
            content: blogGenerationPrompt,
          },
        ],
        temperature: 0.8,
        top_p: 0.95,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const generatedText = data.choices?.[0]?.message?.content || ''

    if (!generatedText) {
      throw new Error('No content generated from OpenRouter API')
    }

    // Try to parse JSON from the response
    let blogContent: BlogContent
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        blogContent = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      // Fallback: create content from text
      const lines = generatedText.split('\n').filter(l => l.trim())
      blogContent = {
        title: lines[0]?.replace(/^#+\s*/, '').substring(0, 80) || `Blog Post about ${category}`,
        excerpt: lines.slice(1, 3).join(' ').substring(0, 200) || generatedText.substring(0, 200),
        body: generatedText,
        tags: [category],
      }
    }

    // Validate and clean
    if (blogContent.excerpt.length > 200) {
      blogContent.excerpt = blogContent.excerpt.substring(0, 197) + '...'
    }

    if (!blogContent.tags || blogContent.tags.length === 0) {
      blogContent.tags = [category]
    }

    return blogContent
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw new Error(`Failed to generate blog content with OpenRouter: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

