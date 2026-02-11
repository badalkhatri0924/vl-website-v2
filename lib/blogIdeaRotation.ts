import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase/config'

const COLLECTION_NAME = 'blogConfig'
const DOCUMENT_ID = 'ideaRotation'

/**
 * Get the next idea index (1–5) in a fixed rotation:
 * 1 → 2 → 3 → 4 → 5 → 1 → ...
 *
 * The last used index is stored in Firestore so we can
 * continue the sequence across requests.
 */
export async function getNextIdeaIndex(): Promise<number> {
  const rotationRef = doc(db, COLLECTION_NAME, DOCUMENT_ID)
  const snapshot = await getDoc(rotationRef)

  let lastIndex: number

  if (snapshot.exists()) {
    const data = snapshot.data() as { lastIndex?: number }
    // Default to 5 so the first computed nextIndex is 1
    lastIndex = typeof data.lastIndex === 'number' ? data.lastIndex : 5
  } else {
    lastIndex = 5
  }

  const nextIndex = (lastIndex % 5) + 1

  console.log(
    '[BlogIdeaRotation] lastIndex:',
    lastIndex,
    '→ nextIndex:',
    nextIndex
  )

  await setDoc(rotationRef, { lastIndex: nextIndex }, { merge: true })

  return nextIndex
}

