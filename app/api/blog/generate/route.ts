import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/services/aiContentService'
import { markdownToPortableText } from '@/lib/sanity/portableTextConverter'
import { createBlogPost, getDefaultAuthorId, getAuthors, uploadImageBufferToSanity, testSanityConnection } from '@/lib/sanity/writeClient'
import { generateBlogImage, calculateReadTime, countWords } from '@/lib/content/imageHandler'
import { getAllCategories, getCategoryConfig } from '@/lib/content/categoryConfig'

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

    const body = await request.json()
    const {
      category,
      topic,
      aiProvider = 'gemini',
      authorId,
      publishStatus = 'draft',
    } = body

    // Validate category
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    const categoryConfig = getCategoryConfig(category)
    if (!categoryConfig) {
      return NextResponse.json(
        {
          error: `Invalid category. Available categories: ${getAllCategories().join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Validate AI provider - only Gemini is supported now
    if (aiProvider !== 'gemini') {
      return NextResponse.json(
        { error: 'Invalid AI provider. Only "gemini" is supported in this deployment.' },
        { status: 400 }
      )
    }

    // Generate content using AI
    console.log(`Generating blog content for category: ${category}, topic: ${topic || 'auto'}, provider: gemini`)
    
    const blogContent = await generateContent({
      category,
      topic,
    })

    // Get or use default author
    let finalAuthorId = authorId
    if (!finalAuthorId) {
      console.log('No authorId provided, fetching default author...')
      finalAuthorId = await getDefaultAuthorId()
      if (!finalAuthorId) {
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
      console.log('Using default author ID:', finalAuthorId)
    }

    // Convert markdown body to PortableText
    const portableTextBody = markdownToPortableText(blogContent.body)

    // Calculate read time
    const wordCount = countWords(blogContent.body)
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
        blogContent.excerpt
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

    // Set published date based on publish status
    const publishedAt = publishStatus === 'published' 
      ? new Date().toISOString()
      : undefined

    // Create the post in Sanity
    const postId = await createBlogPost({
      title: blogContent.title,
      slug,
      authorId: finalAuthorId,
      category,
      excerpt: blogContent.excerpt,
      readTime,
      body: portableTextBody,
      tags: blogContent.tags,
      publishedAt,
      mainImageAssetId,
      publishStatus,
    })

    return NextResponse.json({
      success: true,
      postId,
      slug,
      title: blogContent.title,
      status: publishStatus,
      imageUrl: imageUrl || null,
      imageAssetId: mainImageAssetId || null,
      message: `Blog post "${blogContent.title}" created successfully as ${publishStatus}`,
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
    const categories = getAllCategories()
    const categoryDetails = categories.map(cat => {
      const config = getCategoryConfig(cat)
      return {
        name: cat,
        description: config?.description,
        topics: config?.topics,
      }
    })

    return NextResponse.json({
      categories: categoryDetails,
      availableProviders: ['gemini'],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

