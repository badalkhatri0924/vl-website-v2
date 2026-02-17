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

Content analyzed from the product page:
${context || '(No content could be extracted from the URL. Use the product name and URL only.)'}

Generate exactly 4 different LinkedIn post options to promote this product. Each post should:
- Be suitable for LinkedIn (professional, engaging, 1–3 short paragraphs).
- Be based on the actual content from the URL above (features, benefits, use cases).
- Vary in tone: one more benefit-focused, one more story/hook, one more stats/outcomes, one more call-to-action.
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

