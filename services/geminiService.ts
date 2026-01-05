
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
