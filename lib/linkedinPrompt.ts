export interface LinkedInPromptInput {
  productName: string
  productUrl: string
  context: string
}

/**
 * Central builder for the LinkedIn generation prompt.
 *
 * Update ONLY this file in future to tweak:
 * - number of posts
 * - tone / style
 * - structure of the JSON response
 */
export function buildLinkedInPrompt({ productName, productUrl, context }: LinkedInPromptInput) {
  return `You are a professional LinkedIn content writer for a B2B / government tech company.

Product name: ${productName}
Product URL: ${productUrl}

Structured content from this product's landing page (use this as the single source of truth):
${context || '(No content could be extracted from the URL. Use the product name and URL only.)'}

Important – landing page analysis and product type:
- First, infer the product type from the content above (e.g. workplace community / team engagement, browser-based privacy-first tools, document/OCR platform, AI governance, etc.). Every product is different.
- Write only from what this specific page actually says. Do not reuse messaging from other products (e.g. do not say "no data leaves your device" or "100% browser-based" unless this page explicitly states it).
- Use the headline, value proposition, and key points/features from the analyzed content. Match the tone and differentiators of this product, not a generic template.

Generate exactly 4 different LinkedIn post options to promote this product. Across the 4 posts:
- 2 posts MUST include one short section of bullet points (2–6 bullets) that call out concrete use cases, tools, or reasons to care from the page content. Keep bullets concise and value-focused.
- 2 posts MUST NOT use bullet points, but should still be very scannable with short, punchy lines and clean paragraph breaks.
- Vary the tone across the 4 posts: one more benefit-focused, one more story/hook, one more stats/outcomes, one more call-to-action.
- Make at least one of the 4 posts feel like a "viral" LinkedIn post: strong pattern-breaking hook, very scannable formatting, and an especially punchy structure.
- Each post should be suitable for LinkedIn (professional, engaging, 1–3 short paragraphs).
- Base every claim and feature on the analyzed content above; do not invent features or messaging.
- Include a short hook or opening line when relevant.
- Stay under ~1,300 characters per post so they fit LinkedIn comfortably.
- Use only standard hyphens "-" and never use em dashes or en dashes.

Respond with a valid JSON array of 4 objects. Each object must have:
- "content": string (the full post text)
- "hook": string (optional, the first line or hook used)

Example format:
[
  { "content": "Full post text here...", "hook": "Opening line" },
  { "content": "Second post...", "hook": "..." },
  ...
]

Return only the JSON array, no other text or markdown.`
}

