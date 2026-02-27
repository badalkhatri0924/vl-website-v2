import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase/config'

const COLLECTION_NAME = 'blogConfig'
const DOCUMENT_ID = 'categoryLists'

// Default list should mirror the Priority Themes in blogMasterPrompt.ts
export const DEFAULT_BLOG_CATEGORIES: string[] = [
  'National Digital Infrastructure',
  'AI for Public Sector Operations',
  'National-Scale Learning & Skilling',
  'Digital control and compliance for critical systems (paraphrasing "Digital Sovereignty & Compliance" to avoid banned words)',
  'AI Literacy for Citizens & Workforces',
  'Governed AI & Enterprise Safety',
  'Citizen-First Digital Interfaces',
  'Document Intelligence in Government',
  'Modern Workplace Communities in the Public Sector',
  'Global Government AI Case Studies',
  'National LMS Architecture & Scale',
  'Responsible AI Policy & Governance',
  'Data Platforms for Ministries',
  'Automation of Government Workflows',
  'Multilingual & Inclusive UX for Citizens',
  'Public-Private Partnerships in Digital Transformation',
  'AI Readiness for Ministries & Agencies',
  'Measurement & Analytics for National Programs',
  'Future of Work in Public Sector',
  'Cross-Border Lessons from National AI Initiatives',
]

/**
 * Read the configured blog categories from Firestore.
 *
 * Structure:
 *   collection: blogConfig
 *   document:  categoryLists
 *   field:     categories (string[])
 *
 * On first run (or if the document is missing/empty), it will
 * automatically seed the document with DEFAULT_BLOG_CATEGORIES.
 */
export async function getAllBlogCategories(): Promise<string[]> {
  const ref = doc(db, COLLECTION_NAME, DOCUMENT_ID)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    await setDoc(ref, { categories: DEFAULT_BLOG_CATEGORIES }, { merge: true })
    return DEFAULT_BLOG_CATEGORIES
  }

  const data = snapshot.data() as { categories?: unknown }
  const raw = Array.isArray(data.categories) ? data.categories : []
  const cleaned = raw
    .map((value) => (typeof value === 'string' ? value : String(value)))
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

  if (cleaned.length === 0) {
    await setDoc(ref, { categories: DEFAULT_BLOG_CATEGORIES }, { merge: true })
    return DEFAULT_BLOG_CATEGORIES
  }

  return cleaned
}

export function pickRandomCategory(categories: string[]): string | undefined {
  const list = categories.filter((c) => Boolean(c && c.trim()))
  if (list.length === 0) return undefined
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}

