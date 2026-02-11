## Blog Idea Rotation (Fixed Order)

- **Goal**: Ensure each new AI blog post is based on a different idea, in a fixed sequence: 1 → 2 → 3 → 4 → 5 → 1 → …

- **State storage (Firebase)**:
  - **Collection**: `blogConfig`
  - **Document**: `ideaRotation`
  - **Field**: `lastIndex` (number from 1 to 5)
  - If `lastIndex` is missing, treat it as `5` so the sequence starts at `1`.

- **Rotation logic**:
  - On each `/api/blog/generate` call:
    - Read `lastIndex` from Firestore.
    - Compute `nextIndex = (lastIndex % 5) + 1`.
      - 5 → 1, 1 → 2, 2 → 3, 3 → 4, 4 → 5, then repeat.
    - Save `lastIndex = nextIndex` back to Firestore.
    - This `nextIndex` is the idea index for the current blog.

- **Passing the index to Gemini**:
  - Build `basePrompt` like:
    - `PREFERRED_IDEA_INDEX: ${nextIndex}`
  - Call `generateBlogContent(basePrompt)`, which prepends this line to the master blog prompt.

- **Prompt behavior (`PREFERRED_IDEA_INDEX`)**:
  - In `blogMasterPrompt.ts`, the model:
    - Brainstorms **5 ideas**, explicitly numbered **1 to 5**.
    - Reads `PREFERRED_IDEA_INDEX: N` from the top of the prompt.
    - **Does not** pick the “strongest” idea.
    - **Must** pick the idea whose index equals **N**.
    - If `PREFERRED_IDEA_INDEX` is missing or invalid, it defaults to using idea **1**.

- **Result**:
  - 1st generate: Firestore `lastIndex = 5` → `nextIndex = 1` → Gemini uses idea **1**.
  - 2nd generate: `lastIndex = 1` → `nextIndex = 2` → Gemini uses idea **2**.
  - 3rd generate: `lastIndex = 2` → `nextIndex = 3` → Gemini uses idea **3**.
  - 4th generate: `lastIndex = 3` → `nextIndex = 4` → Gemini uses idea **4**.
  - 5th generate: `lastIndex = 4` → `nextIndex = 5` → Gemini uses idea **5**.
  - 6th generate: `lastIndex = 5` → `nextIndex = 1` → sequence repeats from idea **1**.

