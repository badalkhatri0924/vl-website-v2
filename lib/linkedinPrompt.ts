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

Generate exactly 6 different LinkedIn post options for this product. Balance them as follows:

Content type (6 total):
- 3 posts MUST be promotional: focus on promoting the product, its benefits, use cases, and call-to-action. These should drive interest and adoption.
- 3 posts MUST be insight-based: focus on sharing valuable insights, trends, or perspectives that the product or its domain enables. Add thought leadership and context; do not just sell.

Format (6 total):
- 3 posts MUST include one short section of bullet points (2–6 bullets) that call out concrete use cases, tools, reasons to care, or key takeaways from the page content. Keep bullets concise and value-focused.
- 3 posts MUST NOT use bullet points; keep them very scannable with short, punchy lines and clean paragraph breaks.

Ensure the 6 posts together mix both dimensions: you will have promotional posts with and without bullets, and insight-based posts with and without bullets, so the set stays balanced and engaging.

- Each post should be suitable for LinkedIn (professional, engaging, 1–3 short paragraphs).
- Base every claim and feature on the analyzed content above; do not invent features or messaging.
- Include a short hook or opening line when relevant.
- Stay under ~1,300 characters per post so they fit LinkedIn comfortably.
- Use only standard hyphens "-" and never use em dashes or en dashes.

Respond with a valid JSON array of 6 objects. Each object must have:
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

export interface LinkedInBlogPromptInput {
  title: string
  excerpt: string
  bodySummary: string
  blogUrl: string
  tags?: string[]
}

/**
 * Prompt for generating a LinkedIn post from a published blog article.
 * Used when the admin clicks "Generate LinkedIn Content" on a published blog.
 */
export function buildLinkedInBlogPrompt({ title, excerpt, bodySummary, blogUrl, tags }: LinkedInBlogPromptInput) {
  return `You are a professional LinkedIn content writer.

We have published a blog article and need a short LinkedIn post to promote it.

Blog title: ${title}
Blog excerpt: ${excerpt}
${tags && tags.length > 0 ? `Tags: ${tags.join(', ')}` : ''}

Summary of the blog content (use as the ONLY source of truth – do not add anything that is not in this content):
${bodySummary || excerpt}

Blog URL (MUST be included at the end of the post): ${blogUrl}

Generate exactly 1 LinkedIn post that:
- Contains ONLY content derived from the blog above. Do not mention any company name, brand, or organization unless it explicitly appears in the blog content.
- Is short, professional, and suitable for LinkedIn (1–3 short paragraphs)
- MUST include the blog link at the end (use the exact URL: ${blogUrl})
- Teases the key insight or value of the article with a compelling hook
- Stays under ~1,300 characters so it fits LinkedIn comfortably
- Uses only standard hyphens "-" and never em dashes or en dashes
- Does not invent facts or add promotional branding; base everything strictly on the blog content above

Respond with a valid JSON object:
{ "content": "Full post text including the blog URL at the end..." }

Return only the JSON object, no other text or markdown.`
}

export type NewsCategoryLabel = 'AI News' | 'Tech Industry – India' | 'Tech Industry – Global' | 'Latest Trend News – Worldwide' | 'All about 12 hours in India' | 'All about 24 hours outside India – Worldwide'

export interface LinkedInNewsPromptInput {
  category: NewsCategoryLabel
  newsContext: string
}

/**
 * Prompt for generating LinkedIn posts from latest news in a category.
 * Used when the admin selects AI News, Tech India, or Tech Global.
 */
export function buildLinkedInNewsPrompt({ category, newsContext }: LinkedInNewsPromptInput) {
  return `You are a professional LinkedIn content writer for a B2B / government tech company (Version Labs).

Category: ${category}

Top 4 latest news and headlines (use as the single source of truth for this batch):
${newsContext || '(No news items provided.)'}

Generate exactly 4 different LinkedIn post options that comment on or share insights from this news. Rules:
- Base every post on the actual headlines and stories above. Do not invent stories or facts.
- Each post MUST be primarily based on ONE of the numbered news items (1–4) above. Set "sourceIndex" to that item's number so we can link the post to the correct article.
- 2 posts MUST include a short section of bullet points (2–5 bullets) summarizing key takeaways or trends from the news.
- 2 posts MUST NOT use bullet points; use short, punchy lines and clear paragraph breaks.
- Vary the angle: one post can lead with a single headline and your take, one with a trend summary, one with implications for tech/industry, one with a call to reflect or act.
- Keep tone professional and engaging, suitable for LinkedIn. Add value (insight, trend, or question) rather than just repeating headlines.
- Include a short hook or opening line when relevant. Stay under ~1,300 characters per post.
- Use only standard hyphens "-" and never use em dashes or en dashes.

Respond with a valid JSON array of 4 objects. Each object must have:
- "content": string (the full post text)
- "hook": string (optional, the first line or hook used)
- "sourceIndex": number (1-based index of the news item above that this post is based on, e.g. 1 for the first headline)

Example format:
[
  { "content": "Full post text here...", "hook": "Opening line", "sourceIndex": 1 },
  { "content": "Second post...", "hook": "...", "sourceIndex": 2 },
  ...
]

Return only the JSON array, no other text or markdown.`
}

