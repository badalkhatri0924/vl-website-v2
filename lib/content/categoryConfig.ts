export interface CategoryConfig {
  name: string
  description: string
  targetAudience: string
  tone: string
  topics: string[]
  promptTemplate: string
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  'Sovereign AI': {
    name: 'Sovereign AI',
    description: 'Digital sovereignty, AI governance, and national AI strategies',
    targetAudience: 'Government officials, policy makers, and public sector stakeholders',
    tone: 'Professional, authoritative, strategic, forward-thinking',
    topics: [
      'Digital sovereignty',
      'AI governance frameworks',
      'National AI strategies',
      'Data localization',
      'AI ethics and compliance',
      'Government AI adoption',
      'Sovereign cloud infrastructure',
    ],
    promptTemplate: `Write a comprehensive, professional blog post about {topic} in the context of digital sovereignty and AI governance. 

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 800-2000 words in length
- Include practical insights and real-world examples
- Focus on government and public sector applications
- Emphasize security, compliance (NIC/GIGW), and digital sovereignty
- Include actionable recommendations
- Be well-structured with clear headings and subheadings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, and emphasis where appropriate. Do not use data separation symbols or generic AI markers such as \"--\" or \"---\"; keep the content clean and readable. Strictly do not use the em dash symbol \"-\" anywhere in the content.`,
  },
  'LMS Scaling': {
    name: 'LMS Scaling',
    description: 'Learning management systems, education technology, and scalability',
    targetAudience: 'Education administrators, IT leaders, and learning platform managers',
    tone: 'Technical yet accessible, solution-oriented, data-driven',
    topics: [
      'LMS scalability challenges',
      'Multi-tenant architecture',
      'Education technology trends',
      'Learning analytics',
      'Platform performance optimization',
      'User experience in education',
      'Enterprise LMS deployment',
    ],
    promptTemplate: `Write a comprehensive, technical blog post about {topic} in the context of Learning Management Systems (LMS) and education technology.

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 800-2000 words in length
- Include technical details and best practices
- Focus on scalability, performance, and multi-tenant architecture
- Provide real-world examples and case studies
- Include actionable implementation strategies
- Be well-structured with clear headings and subheadings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, and emphasis where appropriate. Do not use data separation symbols or generic AI markers such as \"--\" or \"---\"; keep the content clean and readable. Strictly do not use the em dash symbol \"-\" anywhere in the content.`,
  },
  'Product Design': {
    name: 'Product Design',
    description: 'UX/UI design, product development, and user experience',
    targetAudience: 'Product managers, designers, and development teams',
    tone: 'Creative, user-focused, practical, inspiring',
    topics: [
      'User experience design',
      'Citizen-centric design',
      'Government portal UX',
      'Design systems',
      'Accessibility in design',
      'Mobile-first design',
      'Design thinking methodologies',
    ],
    promptTemplate: `Write a comprehensive, engaging blog post about {topic} in the context of product design and user experience.

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 800-2000 words in length
- Include design principles and best practices
- Focus on user-centered design and citizen-centric approaches
- Provide visual design concepts and examples
- Include actionable design guidelines
- Be well-structured with clear headings and subheadings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, and emphasis where appropriate. Do not use data separation symbols or generic AI markers such as \"--\" or \"---\"; keep the content clean and readable. Strictly do not use the em dash symbol \"-\" anywhere in the content.`,
  },
}

export function getCategoryConfig(category: string): CategoryConfig | null {
  return categoryConfigs[category] || null
}

export function getAllCategories(): string[] {
  return Object.keys(categoryConfigs)
}

export function getCategoryPrompt(category: string, topic?: string): string {
  const config = getCategoryConfig(category)
  if (!config) {
    throw new Error(`Category "${category}" not found`)
  }

  const selectedTopic = topic || config.topics[Math.floor(Math.random() * config.topics.length)]
  
  return config.promptTemplate
    .replace(/{topic}/g, selectedTopic)
    .replace(/{targetAudience}/g, config.targetAudience)
    .replace(/{tone}/g, config.tone)
}

