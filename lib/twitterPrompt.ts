export interface TwitterPromptInput {
  productName: string
  productUrl: string
  context: string
}

/**
 * Build a Twitter @handle from product name (lowercase, no spaces).
 */
function productHandle(productName: string): string {
  return '@' + productName.replace(/\s+/g, '').toLowerCase()
}

/**
 * Central builder for the Twitter product post generation prompt.
 * Format: impactful, line-by-line structure (hook → problem → solution → benefits → CTA → hashtags).
 */
export function buildTwitterPrompt({ productName, productUrl, context }: TwitterPromptInput) {
  const handle = productHandle(productName)
  const domain = (() => {
    try {
      const u = new URL(productUrl)
      return u.hostname.replace(/^www\./, '')
    } catch {
      return productUrl
    }
  })()

  return `You are a professional Twitter (X) content writer for a B2B / tech company. Generate high-impact product posts with a clear, scannable structure.

Product name: ${productName}
Product handle (use this in the tweet): ${handle}
Product URL: ${productUrl}
Domain for CTA: ${domain}

Structured content from this product's landing page (use as the single source of truth):
${context || '(No content could be extracted from the URL. Use the product name and URL only.)'}

CRITICAL – Impactful content format (follow this structure):

1. **Use line breaks for impact.** Every short phrase or sentence must be on its own line. In your "content" string, use real newline characters (\\n) between lines. No long paragraphs.

2. **Structure each tweet like this:**
   - **Hook (1 line):** One strong, attention-grabbing opening. Examples: "Your bookmark folder is where great ideas go to die." or "One of the biggest lies in productivity culture is 'consume more.'" or "Stop compromising on data privacy for simple file conversions."
   - **Problem (2–4 short lines):** Describe the pain in very short lines. E.g. "You see a link." "You save it." "You forget it." or "We already read enough." "The issue is that most vanish from memory." "That gap kills momentum."
   - **Solution (1 line):** Introduce the product. E.g. "${handle} fixes this cycle." or "Tools like ${handle} exist to close that gap." or "${handle} provides professional-grade tools that run 100% locally."
   - **Benefits (2–4 short lines):** What the product does. E.g. "It extracts the meaning." "It identifies the topics." "It summarizes the takeaways." or "Zero tracking. Zero uploads. Even works offline."
   - **CTA (1–2 lines):** Call to action. E.g. "Save links once." "Never forget why they mattered." "Build your knowledge base at ${handle}" or "Try: ${domain}" or "Experience it at ${domain}"
   - **Hashtags (end):** 1–3 relevant hashtags, e.g. #Productivity #bookmark #Tools

3. **Rules:**
   - Base every claim on the analyzed page content. Do not invent features.
   - Use ${handle} when mentioning the product. You may also use "Try: ${domain}" or "at ${domain}" in the CTA.
   - Keep each tweet under 280 characters total (including newlines and hashtags). If the full structure does not fit, shorten lines or drop one benefit line, but keep the hook + problem + solution + CTA + hashtags.
   - Use only standard hyphens "-" and never em dashes or en dashes.
   - One of the 4 variants MAY use a short bullet-style list (e.g. "Now in [Product]:\\n- Feature one\\n- Feature two") for variety; still use newlines.

Generate exactly 4 different Twitter post options. Vary:
- 2 posts: Classic problem/solution ("lie" or pain → "${handle} exist to close that gap" or "fixes this").
- 1 post: Hook that names the problem (e.g. "Your X is where Y go to die") then short problem lines → product → benefits → CTA.
- 1 post: Can use a bullet-style list of features (with - ) plus punchy CTA and hashtags.

Respond with a valid JSON array of 4 objects. Each object must have:
- "content": string (the full tweet with REAL newlines \\n between each line for visual impact; max 280 characters)
- "hook": string (the first line / opening hook only)

Example content format (show newlines as \\n in your output):
"One of the biggest lies in productivity culture is \\"consume more.\\"\\nReading more doesn't make you smarter.\\nRemembering and connecting does.\\nThat gap kills momentum.\\nTools like ${handle} exist to close that gap.\\nBecause forgotten knowledge is wasted work.\\n#Productivity #bookmark"

Return only the JSON array, no other text or markdown.`
}
