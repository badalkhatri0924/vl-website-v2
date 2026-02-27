import { NextRequest, NextResponse } from 'next/server'
import { generateBlogContent } from '@/services/geminiService'
import { markdownToPortableText } from '@/lib/sanity/portableTextConverter'
import { getDefaultAuthorId, getAuthors, uploadImageBufferToSanity, testSanityConnection } from '@/lib/sanity/writeClient'
import { generateBlogImage, calculateReadTime, countWords } from '@/lib/content/imageHandler'
import { addPendingBlogPost } from '@/lib/pendingBlogs'
import { getNextIdeaIndex } from '@/lib/blogIdeaRotation'
import { getAllBlogCategories, pickRandomCategory } from '@/lib/blogCategories'

/**
 * Generate a slug from a title
 */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    // Test Sanity connection first
    if (!process.env.SANITY_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_WRITE_TOKEN environment variable is not set' },
        { status: 500 }
      )
    }

    const connectionTest = await testSanityConnection()
    if (!connectionTest) {
      return NextResponse.json(
        { 
          error: 'Failed to connect to Sanity. Please check your SANITY_WRITE_TOKEN.',
          hint: 'Make sure the token is a project-level token with Editor permissions.'
        },
        { status: 500 }
      )
    }

    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body',
          message: jsonError instanceof Error ? jsonError.message : 'Failed to parse request body',
          hint: 'Please ensure the request body is valid JSON with required fields: category, topic (optional), authorId (optional), publishStatus (optional)'
        },
        { status: 400 }
      )
    }

    const {
      aiProvider = 'gemini',
      authorId,
      publishStatus = 'draft',
      category: requestedCategory,
    } = body as {
      aiProvider?: 'gemini'
      authorId?: string
      publishStatus?: 'draft' | 'published'
      category?: string
    }

    // Validate AI provider - only Gemini is supported now
    if (aiProvider !== 'gemini') {
      return NextResponse.json(
        { error: 'Invalid AI provider. Only "gemini" is supported in this deployment.' },
        { status: 400 }
      )
    }

    // Generate content using AI (deep-dive prompt flow)
    console.log(`Generating deep-dive blog content, provider: gemini`)

    // Resolve available categories from Firestore config (with fallback)
    const availableCategories = await getAllBlogCategories()

    // Determine which of the 5 internally brainstormed ideas to use
    // in a fixed rotation: 1 → 2 → 3 → 4 → 5 → 1 → ...
    const preferredIdeaIndex = await getNextIdeaIndex()

    // Determine the category hint to pass to the model:
    // - if the admin selected a category and it exists in config, use that
    // - otherwise, randomly pick one from the configured list
    const normalizedRequestedCategory =
      typeof requestedCategory === 'string' ? requestedCategory.trim() : ''

    const validRequestedCategory =
      normalizedRequestedCategory &&
      availableCategories.includes(normalizedRequestedCategory)
        ? normalizedRequestedCategory
        : ''

    const randomFallbackCategory = pickRandomCategory(availableCategories)

    const categoryHint = validRequestedCategory || randomFallbackCategory || ''

    const basePromptLines: string[] = []

    if (categoryHint) {
      basePromptLines.push(
        `PREFERRED_CATEGORY: ${categoryHint}`,
        'You MUST ensure that the selected idea and the final "category" field in the JSON output both match PREFERRED_CATEGORY exactly, using one of the Priority Themes only.'
      )
    }

    basePromptLines.push(`PREFERRED_IDEA_INDEX: ${preferredIdeaIndex}`)

    const basePrompt = basePromptLines.join('\n')

    const blogContent = await generateBlogContent(basePrompt)

    // Get or use default author
    let finalAuthorId: string | undefined = authorId ?? undefined
    if (!finalAuthorId) {
      console.log('No authorId provided, fetching default author...')
      const defaultAuthorId = await getDefaultAuthorId()
      if (!defaultAuthorId) {
        // Try to get all authors for better error message
        const allAuthors = await getAuthors()
        console.error('No authors found. Available authors:', allAuthors)
        return NextResponse.json(
          { 
            error: 'No author found. Please create an author in Sanity Studio first.',
            hint: allAuthors.length === 0 
              ? 'Make sure the author is published and SANITY_WRITE_TOKEN is set correctly.'
              : `Found ${allAuthors.length} author(s) but could not retrieve ID.`
          },
          { status: 400 }
        )
      }
      finalAuthorId = defaultAuthorId
      console.log('Using default author ID:', finalAuthorId)
    }

    // Ensure we have clean markdown (strip out any accidental JSON wrapper)
    let markdownBody = blogContent.body
    if (markdownBody && markdownBody.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(markdownBody)
        if (parsed && typeof parsed === 'object') {
          markdownBody = typeof parsed.body === 'string' ? parsed.body : markdownBody
          // Optionally align other fields if present
          if (parsed.title && typeof parsed.title === 'string') {
            blogContent.title = parsed.title
          }
          if (parsed.excerpt && typeof parsed.excerpt === 'string') {
            blogContent.excerpt = parsed.excerpt
          }
          if (Array.isArray(parsed.tags)) {
            blogContent.tags = parsed.tags
          }
          if (typeof parsed.inputTopic === 'string') {
            blogContent.inputTopic = parsed.inputTopic
          }
          if (typeof parsed.imageConcept === 'string') {
            blogContent.imageConcept = parsed.imageConcept
          }
        }
      } catch {
        // If JSON.parse fails, fall back to original markdownBody
      }
    }

    // Decide on the category to use for this article and image generation.
    // Prefer (in order):
    // 1) The validated admin-selected category
    // 2) The random fallback category from config
    // 3) The category returned by the model
    // 4) A legacy default if everything else fails.
    const modelCategory = blogContent.category && blogContent.category.trim()

    const category =
      validRequestedCategory ||
      randomFallbackCategory ||
      modelCategory ||
      'National Digital Infrastructure'

    console.log(
      'Deep-dive blog generated with category:',
      category,
      '| preferred idea index:',
      preferredIdeaIndex
    )

    // Convert markdown body to PortableText
    const portableTextBody = markdownToPortableText(markdownBody)

    // Calculate read time
   const wordCount = countWords(markdownBody)
    const readTime = calculateReadTime(wordCount)

    // Generate slug from title
    const slug = slugifyTitle(blogContent.title)

    // Generate and upload image using Gemini Imagen
    let mainImageAssetId: string | undefined
    let imageUrl: string | undefined
    
    try {
      console.log('Generating image with Gemini Imagen for blog post...')
      const generatedImage = await generateBlogImage(
        blogContent.title,
        category,
        blogContent.excerpt,
        blogContent.imageConcept,
        blogContent.inputTopic
      )
      
      if (generatedImage && generatedImage.imageData) {
        console.log('Image generated successfully, uploading to Sanity...')
        try {
          const uploadResult = await uploadImageBufferToSanity(
            generatedImage.imageData,
            `${slug}-generated.png`,
            generatedImage.mimeType
          )
          mainImageAssetId = uploadResult.assetId
          imageUrl = uploadResult.url
          console.log('Image uploaded successfully to Sanity')
          console.log('Asset ID:', mainImageAssetId)
          console.log('Image URL:', imageUrl)
        } catch (uploadError) {
          console.error('Failed to upload generated image to Sanity:', uploadError)
          mainImageAssetId = undefined
          imageUrl = undefined
        }
      } else {
        console.warn('Failed to generate image with Gemini, post will be created without image')
        mainImageAssetId = undefined
        imageUrl = undefined
      }
    } catch (imageError) {
      console.error('Error in image generation/upload process:', imageError)
      // Continue without image if generation fails
      mainImageAssetId = undefined
      imageUrl = undefined
    }

    // Save to pending instead of directly to Sanity
    const pendingPost = await addPendingBlogPost({
      title: blogContent.title,
      slug,
      authorId: finalAuthorId as string,
      category,
      excerpt: blogContent.excerpt,
      readTime,
      body: markdownBody, // Store markdown for display
      bodyPortableText: portableTextBody, // Store PortableText for Sanity
      tags: blogContent.tags,
      imageAssetId: mainImageAssetId,
      imageUrl: imageUrl,
      publishStatus,
    })

    return NextResponse.json({
      success: true,
      pendingId: pendingPost.id,
      slug,
      title: blogContent.title,
      status: 'pending',
      imageUrl: imageUrl || null,
      imageAssetId: mainImageAssetId || null,
      message: `Blog post "${blogContent.title}" generated and saved for review. Please approve or reject it from the admin page.`,
    })
  } catch (error) {
    console.error('Error generating blog post:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to generate blog post',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve available categories and configuration
 */
export async function GET() {
  try {
    const authors = await getAuthors()
    const authorDetails = (authors || []).map(author => ({
      id: author._id,
      name: author.name,
    }))

    const categories = await getAllBlogCategories()

    return NextResponse.json({
      availableProviders: ['gemini'],
      authors: authorDetails,
      categories,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories and authors' },
      { status: 500 }
    )
  }
}

