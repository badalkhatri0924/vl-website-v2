/**
 * Hugging Face Inference API service for blog content generation
 * Free tier available with rate limits
 */

import { BlogContent } from './geminiService'

/**
 * Generate blog content using Hugging Face Inference API
 */
export async function generateBlogContentWithHuggingFace(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const apiKey = process.env.HUGGING_FACE_API_KEY

  if (!apiKey) {
    throw new Error('HUGGING_FACE_API_KEY is required for Hugging Face service')
  }

  // Use a free model like Mistral or Llama
  const model = 'mistralai/Mistral-7B-Instruct-v0.2' // Free model option

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
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: blogGenerationPrompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.8,
            top_p: 0.95,
            return_full_text: false,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Handle different response formats from Hugging Face
    let generatedText = ''
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text
    } else if (data.generated_text) {
      generatedText = data.generated_text
    } else if (typeof data === 'string') {
      generatedText = data
    } else {
      throw new Error('Unexpected response format from Hugging Face API')
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
    console.error('Hugging Face API Error:', error)
    throw new Error(`Failed to generate blog content with Hugging Face: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

