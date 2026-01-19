# Admin Blog Page - Generate New Blog Feature

## Overview
This document explains how the "Generate New Blog" feature works on the admin blog page, specifically how blog posts are generated and saved to JSON.

## File Structure

### Key Files
- **Frontend**: `app/admin/blog/page.tsx` - Admin UI component
- **API Route**: `app/api/blog/generate/route.ts` - Handles blog generation
- **Data Storage**: `lib/pendingBlogs.ts` - Manages JSON file operations
- **JSON File**: `data/pending-blogs.json` - Stores pending blog posts

---

## How "Generate New Blog" Works - Step by Step

### 1. **User Clicks "Generate New Blog" Button**
   - Location: Admin blog page (`/admin/blog`)
   - Action: Opens a dialog modal with form fields
   - Button: Located in the header section of the admin page

### 2. **User Fills Out the Form**
   - **Category** (Required): User selects from available categories
   - **Topic** (Optional): User can specify a topic or leave empty for AI to choose
   - **Author** (Optional): User can select an author or use default from Sanity
   - Form validation ensures category is selected before submission

### 3. **Frontend Sends POST Request**
   - When user clicks "Generate Blog" button, `handleGenerate()` function is called
   - Makes POST request to `/api/blog/generate` endpoint
   - Request body includes:
     ```json
     {
       "category": "selected-category",
       "topic": "optional-topic",
       "authorId": "optional-author-id",
       "publishStatus": "draft"
     }
     ```

### 4. **API Route Processes the Request**
   - **File**: `app/api/blog/generate/route.ts`
   - **Steps**:
     a. Validates Sanity connection and environment variables
     b. Validates category and AI provider
     c. Calls AI service to generate blog content (title, body, excerpt, tags)
     d. Gets or assigns default author ID
     e. Converts markdown body to PortableText format (for Sanity)
     f. Calculates read time based on word count
     g. Generates slug from title
     h. Generates blog image using Gemini Imagen
     i. Uploads image to Sanity and gets asset ID and URL

### 5. **Data is Saved to JSON File**
   - **File**: `lib/pendingBlogs.ts`
   - **Function**: `addPendingBlogPost()`
   - **Process**:
     a. Reads existing posts from `data/pending-blogs.json`
     b. Creates new post object with:
        - Unique ID: `pending-{timestamp}-{random-string}`
        - All blog data (title, slug, body, excerpt, etc.)
        - Created timestamp
     c. Appends new post to array
     d. Writes entire array back to JSON file with formatting (2-space indent)
   - **JSON File Location**: `data/pending-blogs.json`

### 6. **Response Sent Back to Frontend**
   - API returns success response with:
     ```json
     {
       "success": true,
       "pendingId": "pending-1234567890-abc123",
       "slug": "generated-slug",
       "title": "Generated Blog Title",
       "status": "pending",
       "imageUrl": "https://...",
       "message": "Blog post generated and saved for review"
     }
     ```

### 7. **Frontend Updates UI**
   - Shows success notification
   - Closes the generate dialog
   - Refreshes pending posts list by calling `fetchPendingPosts()`
   - New blog post appears in the pending list

### 8. **Pending Posts Display**
   - Frontend fetches all pending posts from `/api/blog/pending`
   - This API route reads from `data/pending-blogs.json`
   - Posts are displayed as cards with:
     - Title, excerpt, category, read time
     - Generated image (if available)
     - Action buttons: View Details, Approve as Draft, Approve & Publish, Reject

---

## Data Flow Diagram

```
User Action
    ↓
[Click "Generate New Blog"]
    ↓
[Fill Form & Submit]
    ↓
Frontend: handleGenerate()
    ↓
POST /api/blog/generate
    ↓
API Route Processing:
  ├─ Validate inputs
  ├─ Generate AI content
  ├─ Generate image
  ├─ Upload to Sanity
  └─ Save to JSON
    ↓
addPendingBlogPost()
    ↓
Read data/pending-blogs.json
    ↓
Append new post
    ↓
Write to data/pending-blogs.json
    ↓
Return success response
    ↓
Frontend: Refresh list
    ↓
Display new post in pending list
```

---

## JSON File Structure

The `data/pending-blogs.json` file stores an array of blog post objects:

```json
[
  {
    "id": "pending-1234567890-abc123",
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "category": "Category Name",
    "excerpt": "Short description...",
    "body": "Full markdown content...",
    "bodyPortableText": [...],
    "tags": ["tag1", "tag2"],
    "readTime": "8 MIN READ",
    "authorId": "author-id-from-sanity",
    "imageAssetId": "sanity-asset-id",
    "imageUrl": "https://cdn.sanity.io/...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "publishStatus": "draft"
  }
]
```

---

## Key Functions

### Frontend (`page.tsx`)
- `handleGenerate()` - Initiates blog generation
- `fetchPendingPosts()` - Fetches and displays pending posts
- `handleApprove()` - Approves and publishes posts
- `handleReject()` - Removes posts from pending list

### Backend (`lib/pendingBlogs.ts`)
- `getPendingBlogPosts()` - Reads all posts from JSON
- `addPendingBlogPost()` - Adds new post to JSON
- `removePendingBlogPost()` - Removes post from JSON
- `getPendingBlogPost(id)` - Gets specific post by ID

### API Route (`route.ts`)
- `POST /api/blog/generate` - Generates and saves blog post
- `GET /api/blog/generate` - Returns available categories and authors

---

## Important Points

1. **JSON is the Intermediate Storage**: Blog posts are saved to JSON before being approved to Sanity
2. **Two Content Formats**: 
   - `body`: Markdown format (for display in admin UI)
   - `bodyPortableText`: Sanity PortableText format (for publishing)
3. **Image Handling**: Images are uploaded to Sanity immediately, but post remains in JSON until approved
4. **Unique IDs**: Each pending post gets a unique ID with timestamp and random string
5. **File Operations**: All JSON operations are async and handle file creation if it doesn't exist
6. **Error Handling**: If image generation fails, post is still created without image

---

## Next Steps After Generation

Once a blog post is generated and saved to JSON:

1. **View Details**: Admin can click "View Details" to see full content
2. **Approve as Draft**: Saves to Sanity as draft (not published)
3. **Approve & Publish**: Saves to Sanity and publishes immediately
4. **Reject**: Removes post from JSON file (deletes it)

---

## Environment Requirements

- `SANITY_WRITE_TOKEN` - Required for Sanity operations
- `GEMINI_API_KEY` - Required for AI content and image generation
- `data/` directory - Must exist (created automatically if missing)

---

## Troubleshooting

- **JSON file not found**: The system automatically creates the file and directory if missing
- **Image upload fails**: Post is still created, but without image
- **Author not found**: System uses default author from Sanity, or returns error if none exists
- **Category invalid**: Returns error with list of available categories
