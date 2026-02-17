## LinkedIn Post Admin – Quick Overview

### Access

- `/admin` with:
  - **Name** (per user; used for “Copied by …”).
  - **Password** (shared admin password).
- Auth check shows the **Avatar** loader before loading tools.

### Generate & Save Posts

- In `/admin`, click **Generate product post** in the LinkedIn card.
- Dialog asks for:
  - **Product name**
  - **Product URL**
- Frontend → `POST /api/linkedin/generate`
  - Fetches URL, extracts meta + snippet.
  - Uses Gemini to create **4 LinkedIn post options**.
- On success, frontend → `POST /api/linkedin/save`
  - Saves to Firestore collection **`linkedinPosts`**:
    - `productName`, `productUrl`, `createdAt`
    - `posts: [{ content, hook?, copiedBy?, copiedAt? }]`

### Loading Content

- On admin load, frontend → `GET /api/linkedin/list`
  - Returns all `linkedinPosts` docs (newest first) with normalized timestamps.
- UI:
  - **Tabs** by product (`productName`).
  - Active tab shows:
    - Product URL + created date.
    - Posts in a **2-column grid** on desktop.

### Copy Locking

- Each post card shows:
  - Optional **hook**, main **content**, and actions.
- First user to click **Copy**:
  - Frontend → `POST /api/linkedin/copy` with `{ batchId, postIndex, copiedBy }`.
  - API:
    - If `posts[postIndex].copiedBy` is empty:
      - Sets `copiedBy` and `copiedAt` (Timestamp.now()).
    - If already set:
      - Returns **409 already_claimed** (no changes).
  - On success:
    - Text is copied to clipboard.
    - Batches are reloaded.
- UI states:
  - If `copiedBy` exists:
    - Show blue pill: **“Copied by {name} {date}”**.
    - **Hide Copy button** (post is locked).
  - If API returns 409:
    - Show inline warning: “Already used by another team member.”

### Data Model (Firestore)

- **Collection**: `linkedinPosts`
- **Document fields**:
  - `productName: string`
  - `productUrl: string`
  - `createdAt: Timestamp`
  - `posts: LinkedInPostItem[]`
- **LinkedInPostItem**:

  ```ts
  interface LinkedInPostItem {
    content: string
    hook?: string
    copiedBy?: string   // first user who copied this post
    copiedAt?: string   // ISO string (converted from Timestamp)
  }
  ```

