
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the "VersionLabs AI Assistant", a representative of a world-class government technology firm specializing in digital infrastructure.
Your goal is to help government officials and public sector stakeholders understand how VersionLabs can transform their national platforms.

Key points about VersionLabs:
- Expertise: Government Portals, Enterprise LMS (Learning Management Systems), and Strategic AI Automation.
- Core Values: Digital Sovereignty, Security, Multi-tenant Scalability, and Citizen-Centric UI/UX.
- National Impact: Managing mission-critical platforms with millions of users.

Tone Guidelines:
- Professional, authoritative, and helpful.
- Focus on security and compliance (NIC/GIGW).
- For project inquiries, direct them to "Request a Proposal" or "Schedule a Discovery Session".
`;

export const getGeminiChatResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "I apologize, but I am unable to process that request at the moment. Please contact VersionLabs support for urgent inquiries.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the VersionLabs enterprise AI systems. Please try again shortly.";
  }
};

export interface BlogContent {
  title: string
  excerpt: string
  body: string
  tags: string[]
}

/**
 * Generate blog content using Gemini API
 */
export async function generateBlogContent(
  prompt: string,
  category: string
): Promise<BlogContent> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

Ensure the content is well-structured with proper markdown formatting including headings (##, ###), paragraphs, lists, and emphasis.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: 'user', parts: [{ text: blogGenerationPrompt }] }
      ],
      config: {
        systemInstruction: `You are a professional content writer for VersionLabs, a government technology firm. Write high-quality, authoritative blog posts about ${category} topics.`,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    const responseText = response.text || '';
    
    // Try to extract JSON from the response
    let blogContent: BlogContent;
    try {
      // Look for JSON in the response (might be wrapped in markdown code blocks)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: parse the response manually
      console.warn('Failed to parse JSON, using fallback parsing');
      blogContent = {
        title: extractTitle(responseText) || `Blog Post about ${category}`,
        excerpt: extractExcerpt(responseText) || responseText.substring(0, 200),
        body: responseText,
        tags: extractTags(responseText) || [category],
      };
    }

    // Validate and clean the content
    if (blogContent.excerpt.length > 200) {
      blogContent.excerpt = blogContent.excerpt.substring(0, 197) + '...';
    }

    if (!blogContent.tags || blogContent.tags.length === 0) {
      blogContent.tags = [category];
    }

    return blogContent;
  } catch (error) {
    console.error("Gemini Blog Generation Error:", error);
    throw new Error(`Failed to generate blog content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function extractTitle(text: string): string | null {
  const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/i) || 
                     text.match(/title["']?\s*:\s*["']?([^"'\n]+)/i) ||
                     text.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractExcerpt(text: string): string | null {
  const excerptMatch = text.match(/"excerpt"\s*:\s*"([^"]+)"/i) ||
                       text.match(/excerpt["']?\s*:\s*["']?([^"'\n]+)/i);
  return excerptMatch ? excerptMatch[1].trim() : null;
}

function extractTags(text: string): string[] | null {
  const tagsMatch = text.match(/"tags"\s*:\s*\[([^\]]+)\]/i);
  if (tagsMatch) {
    try {
      const tagsArray = JSON.parse(`[${tagsMatch[1]}]`);
      return Array.isArray(tagsArray) ? tagsArray.map(t => String(t).trim()) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Generate an image using Gemini's gemini-2.5-flash-image model
 * This model supports image generation using the @google/genai SDK
 */
export async function generateImageWithGemini(
  prompt: string
): Promise<{ imageData: Buffer; mimeType: string } | null> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error('❌ API_KEY not set, cannot generate image');
    return null;
  }

  try {
    console.log('🎨 Generating image with Gemini (gemini-2.5-flash-image)...');
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...');
    
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
    });

    // Extract image from response
    // Response structure: candidates[0].content.parts[0].inlineData
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // The image is base64 encoded in inlineData.data
            const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
            const mimeType = part.inlineData.mimeType || 'image/png';
            
            console.log('✅ Image generated successfully with Gemini!');
            console.log('📊 Image size:', Math.round(imageBuffer.length / 1024), 'KB');
            console.log('📄 MIME type:', mimeType);
            
            return {
              imageData: imageBuffer,
              mimeType: mimeType,
            };
          }
        }
      }
    }

    console.warn('⚠️  No image data in Gemini response');
    console.log('Response structure:', JSON.stringify(response).substring(0, 300));
    
    // Fallback to Unsplash if available
    return await generateImageFromUnsplash(prompt);
    
  } catch (error) {
    console.error('❌ Gemini image generation error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    // Try Unsplash as fallback
    console.log('⚠️  Falling back to Unsplash...');
    return await generateImageFromUnsplash(prompt);
  }
}

/**
 * Fallback: Generate image from Unsplash
 * Uses smart keyword extraction to find relevant professional photos
 */
async function generateImageFromUnsplash(
  prompt: string
): Promise<{ imageData: Buffer; mimeType: string } | null> {
  const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!unsplashAccessKey) {
    console.warn('⚠️  UNSPLASH_ACCESS_KEY not set, cannot fetch fallback image');
    return null;
  }

  try {
    const searchQuery = extractKeywordsFromPrompt(prompt);
    console.log('🔍 Searching Unsplash for:', searchQuery);
    
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${unsplashAccessKey}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Unsplash API error:', response.status);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.urls?.regular || data.urls?.full;
    
    if (!imageUrl) {
      console.warn('⚠️  No image URL in Unsplash response');
      return null;
    }

    // Fetch the actual image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to fetch image from Unsplash URL');
      return null;
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    console.log('✅ Image fetched successfully from Unsplash');
    console.log('📊 Image size:', Math.round(imageBuffer.length / 1024), 'KB');

    return {
      imageData: imageBuffer,
      mimeType: mimeType,
    };
  } catch (error) {
    console.error('❌ Error fetching image from Unsplash:', error);
    return null;
  }
}

/**
 * Extract keywords from an image prompt for search
 */
function extractKeywordsFromPrompt(prompt: string): string {
  // Simple keyword extraction - take important words
  const words = prompt.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4); // Filter short words
  
  // Take first 3-5 meaningful words
  const keywords = words.slice(0, 5).join(' ');
  return keywords || 'modern technology digital';
}

/**
 * Generate an optimized image prompt for blog content
 */
export async function generateImagePromptForBlog(
  title: string,
  category: string,
  excerpt?: string
): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // Fallback to basic prompt
    return `Professional, modern illustration representing ${category} - ${title}. Clean, corporate style suitable for a technology blog. High quality, photorealistic.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const metaPrompt = `You are an expert at creating image generation prompts. Based on the following blog post details, create a single, detailed image generation prompt (max 150 words) that would produce a professional, modern, high-quality featured image for a government technology blog.

Blog Title: "${title}"
Category: "${category}"
${excerpt ? `Excerpt: "${excerpt}"` : ''}

The image should be:
- Professional and corporate-appropriate
- Modern and visually appealing
- Related to technology/government/digital transformation
- Photorealistic or clean illustration style
- Suitable for a 16:9 aspect ratio blog header

Return ONLY the image generation prompt, nothing else.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: metaPrompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const imagePrompt = (response.text || '').trim();
    console.log('Generated image prompt:', imagePrompt);
    
    return imagePrompt || `Professional illustration of ${category} - ${title}. Modern, clean, corporate style.`;
  } catch (error) {
    console.warn('Failed to generate image prompt with Gemini, using fallback:', error);
    return `Professional, modern illustration representing ${category} - ${title}. Clean, corporate style suitable for a technology blog.`;
  }
}
