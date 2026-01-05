# AI Blog Content Generation System - Complete Workflow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Complete Workflow](#complete-workflow)
4. [API Endpoints](#api-endpoints)
5. [File Structure](#file-structure)
6. [Configuration](#configuration)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)

---

## System Overview

This system automatically generates blog posts using AI (primarily Google Gemini API) and saves them to Sanity CMS. The system supports category-based content generation with customizable prompts, automatic markdown-to-PortableText conversion, and image handling.

### Key Features
- ✅ Free AI API integration (Gemini, with optional alternatives)
- ✅ Category-based content generation
- ✅ Automatic PortableText conversion
- ✅ Sanity CMS integration
- ✅ Image handling (Unsplash or placeholders)
- ✅ Draft/Published status control
- ✅ Automatic slug generation
- ✅ Read time calculation

---

## Architecture

```
┌─────────────────┐
│  API Request    │
│  /api/blog/     │
│  generate       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  1. Validate Input & Test Sanity   │
│     - Check category                │
│     - Test Sanity connection        │
│     - Get/validate author           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  2. Generate Category Prompt       │
│     lib/content/categoryConfig.ts   │
│     - Get category config           │
│     - Select topic (or use provided)│
│     - Build prompt template         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  3. Call AI Service                 │
│     services/aiContentService.ts     │
│     - Route to provider (Gemini)    │
│     - Handle fallback if needed     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  4. Gemini API Call                 │
│     services/geminiService.ts        │
│     - Initialize GoogleGenAI        │
│     - Build blog generation prompt  │
│     - Call generateContent()        │
│     - Parse JSON response           │
│     - Return BlogContent object     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  5. Process Content                 │
│     - Convert markdown to           │
│       PortableText                  │
│     - Calculate read time           │
│     - Generate slug                 │
│     - Fetch/upload image            │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  6. Save to Sanity                  │
│     lib/sanity/writeClient.ts        │
│     - Create authenticated client   │
│     - Build post document           │
│     - Upload image (if available)    │
│     - Create post via client.create()│
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  7. Return Success Response         │
│     - Post ID                       │
│     - Slug                          │
│     - Title                         │
│     - Status                        │
└─────────────────────────────────────┘
```

---

## Complete Workflow

### Step 1: API Request Received

**File:** `app/api/blog/generate/route.ts`

**Endpoint:** `POST /api/blog/generate`

**Request Body:**
```json
{
  "category": "Sovereign AI",
  "topic": "AI governance frameworks",  // Optional
  "aiProvider": "gemini",               // Optional, defaults to "gemini"
  "authorId": "author-id",             // Optional, uses default if not provided
  "publishStatus": "draft"             // Optional, defaults to "draft"
}
```

**Initial Validation:**
1. Check if `SANITY_WRITE_TOKEN` environment variable is set
2. Test Sanity connection using `testSanityConnection()`
3. Parse and validate request body
4. Validate category exists in `categoryConfigs`
5. Validate AI provider (must be one of: gemini, huggingface, openrouter, cohere)

**Code Location:**
```typescript
// app/api/blog/generate/route.ts lines 20-75
```

---

### Step 2: Category Prompt Generation

**File:** `lib/content/categoryConfig.ts`

**Function:** `getCategoryPrompt(category: string, topic?: string)`

**Process:**
1. Look up category in `categoryConfigs` object
2. If `topic` not provided, randomly select one from the category's `topics` array
3. Replace placeholders in `promptTemplate`:
   - `{topic}` → Selected or provided topic
   - `{targetAudience}` → Category's target audience
   - `{tone}` → Category's writing tone
4. Return final prompt string

**Example Category Config:**
```typescript
'Sovereign AI': {
  name: 'Sovereign AI',
  description: 'Digital sovereignty, AI governance, and national AI strategies',
  targetAudience: 'Government officials, policy makers, and public sector stakeholders',
  tone: 'Professional, authoritative, strategic, forward-thinking',
  topics: [
    'Digital sovereignty',
    'AI governance frameworks',
    'National AI strategies',
    // ... more topics
  ],
  promptTemplate: `Write a comprehensive, professional blog post about {topic}...`
}
```

**Example Generated Prompt:**
```
Write a comprehensive, professional blog post about AI governance frameworks in the context of digital sovereignty and AI governance.

Target audience: Government officials, policy makers, and public sector stakeholders
Tone: Professional, authoritative, strategic, forward-thinking

The post should:
- Be 800-2000 words in length
- Include practical insights and real-world examples
- Focus on government and public sector applications
- Emphasize security, compliance (NIC/GIGW), and digital sovereignty
- Include actionable recommendations
- Be well-structured with clear headings and subheadings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, and emphasis where appropriate.
```

**Code Location:**
```typescript
// lib/content/categoryConfig.ts lines 108-120
```

---

### Step 3: AI Service Routing

**File:** `services/aiContentService.ts`

**Function:** `generateContent(options: GenerateContentOptions)`

**Process:**
1. Get category prompt from Step 2 using `getCategoryPrompt()`
2. Route to appropriate AI provider based on `options.provider`:
   - `gemini` → `generateWithGemini()` (primary)
   - `huggingface` → `generateWithHuggingFace()` (optional)
   - `openrouter` → `generateWithOpenRouter()` (optional)
   - `cohere` → `generateWithCohere()` (optional)
3. If provider fails and it's not Gemini, automatically fallback to Gemini
4. Return `BlogContent` object with structure:
   ```typescript
   {
     title: string,
     excerpt: string,
     body: string,  // Markdown format
     tags: string[]
   }
   ```

**Code Location:**
```typescript
// services/aiContentService.ts lines 20-59
```

---

### Step 4: Gemini API Call (Detailed)

**File:** `services/geminiService.ts`

**Function:** `generateBlogContent(prompt: string, category: string)`

#### 4.1 Initialize Gemini Client

```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

**Environment Variable:** `API_KEY` (Gemini API key from Google AI Studio)

**Package:** `@google/genai` (already installed)

#### 4.2 Build Enhanced Blog Generation Prompt

The category prompt from Step 2 is enhanced with structure requirements:

```typescript
const blogGenerationPrompt = `${prompt}

Please generate a complete blog post with the following structure:
1. Title: A compelling, SEO-friendly title (max 80 characters)
2. Excerpt: A brief summary (max 200 characters) that captures the essence of the post
3. Body: The full blog post content in markdown format (800-2000 words)
4. Tags: 3-5 relevant tags as a comma-separated list

Format your response as JSON with the following structure:
{
  "title": "Your blog post title",
  "excerpt": "Your excerpt here",
  "body": "Your markdown content here",
  "tags": ["tag1", "tag2", "tag3"]
}

Ensure the content is well-structured with proper markdown formatting including headings (##, ###), paragraphs, lists, and emphasis.`;
```

#### 4.3 Make Gemini API Call

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { role: 'user', parts: [{ text: blogGenerationPrompt }] }
  ],
  config: {
    systemInstruction: `You are a professional content writer for VersionLabs, a government technology firm. Write high-quality, authoritative blog posts about ${category} topics.`,
    temperature: 0.8,
    topP: 0.95,
  }
});
```

**API Parameters:**
- **model:** `"gemini-3-flash-preview"` (free tier model)
- **temperature:** `0.8` (controls creativity/randomness)
- **topP:** `0.95` (nucleus sampling parameter)
- **systemInstruction:** Provides context about VersionLabs

**API Endpoint:** 
- Internally handled by `@google/genai` package
- Uses: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`

#### 4.4 Parse Gemini Response

**Response Format:** JSON string (may be wrapped in markdown code blocks)

**Parsing Process:**
1. Extract response text: `const responseText = response.text || ''`
2. Extract JSON using regex: `responseText.match(/\{[\s\S]*\}/)`
3. Parse JSON to get structured data:
   ```typescript
   {
     title: string,
     excerpt: string,
     body: string,  // Markdown content
     tags: string[]
   }
   ```
4. **Fallback Parsing** (if JSON parsing fails):
   - Extract title using regex patterns
   - Extract excerpt
   - Use full response as body
   - Extract or default tags to category name

**Validation:**
- Ensure excerpt is max 200 characters (truncate if needed)
- Ensure tags array exists (default to `[category]` if empty)
- Return validated `BlogContent` object

**Code Location:**
```typescript
// services/geminiService.ts lines 53-127
```

---

### Step 5: Content Processing

**File:** `app/api/blog/generate/route.ts`

#### 5.1 Get or Validate Author

```typescript
let finalAuthorId = authorId || await getDefaultAuthorId()
```

**Process:**
- If `authorId` provided in request, use it
- Otherwise, fetch first author from Sanity using `getDefaultAuthorId()`
- `getDefaultAuthorId()` calls `getAuthors()` which queries:
  ```groq
  *[_type == "author"] | order(_createdAt desc) {
    _id,
    name
  }
  ```
- Validate author exists, return error if none found

**Code Location:**
```typescript
// app/api/blog/generate/route.ts lines 86-106
// lib/sanity/writeClient.ts lines 126-164
```

#### 5.2 Convert Markdown to PortableText

**File:** `lib/sanity/portableTextConverter.ts`

**Function:** `markdownToPortableText(markdown: string)`

**Process:**
1. Split markdown into lines
2. Parse each line type:
   - **Headings** (`#`, `##`, `###`) → `style: 'h1'`, `'h2'`, `'h3'`
   - **Paragraphs** → `style: 'normal'`
   - **Lists** (`-`, `*`, numbered) → `style: 'normal'` with list formatting
   - **Blockquotes** (`>`) → `style: 'blockquote'`
3. Parse inline formatting within text:
   - `**bold**` → `marks: ['strong']`
   - `*italic*` → `marks: ['em']`
   - `[text](url)` → `marks: ['link']` with `markDefs` array
4. Generate unique keys for each block: `block-${Date.now()}-${counter}`
5. Return PortableText array

**PortableText Structure Example:**
```typescript
[
  {
    _type: 'block',
    _key: 'block-1234567890-0',
    style: 'h2',
    markDefs: [],
    children: [
      { 
        _type: 'span', 
        _key: 'span-0', 
        text: 'Introduction to AI Governance' 
      }
    ]
  },
  {
    _type: 'block',
    _key: 'block-1234567890-1',
    style: 'normal',
    markDefs: [
      { 
        _key: 'link-0', 
        _type: 'link', 
        href: 'https://example.com' 
      }
    ],
    children: [
      { _type: 'span', _key: 'span-1', text: 'Learn more about ' },
      { 
        _type: 'span', 
        _key: 'span-2', 
        text: 'AI governance', 
        marks: ['link-0'] 
      },
      { _type: 'span', _key: 'span-3', text: ' frameworks.' }
    ]
  }
]
```

**Code Location:**
```typescript
// lib/sanity/portableTextConverter.ts lines 33-297
// app/api/blog/generate/route.ts line 109
```

#### 5.3 Calculate Read Time

**File:** `lib/content/imageHandler.ts`

**Functions:**
- `countWords(text: string)`: Counts words in text
- `calculateReadTime(wordCount: number)`: Calculates read time

**Process:**
```typescript
const wordCount = countWords(blogContent.body)
const readTime = calculateReadTime(wordCount)  // Returns "8 MIN READ"
```

**Formula:** `Math.ceil(wordCount / 200)` (assumes 200 words per minute reading speed)

**Code Location:**
```typescript
// lib/content/imageHandler.ts lines 70-90
// app/api/blog/generate/route.ts lines 112-113
```

#### 5.4 Generate Slug from Title

**Function:** `slugifyTitle(title: string)`

**Process:**
```typescript
const slug = title
  .toLowerCase()                    // Convert to lowercase
  .trim()                           // Remove whitespace
  .replace(/[^\w\s-]/g, '')        // Remove special characters
  .replace(/[\s_-]+/g, '-')        // Replace spaces/underscores with hyphens
  .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
```

**Example:** 
- Input: "Building Digital Sovereignty: A Strategic Framework"
- Output: `"building-digital-sovereignty-a-strategic-framework"`

**Code Location:**
```typescript
// app/api/blog/generate/route.ts lines 11-18, 116
```

#### 5.5 Handle Image

**File:** `lib/content/imageHandler.ts`

**Function:** `getImageForCategory(category: string, topic?: string)`

**Process:**
1. Map category to image search terms:
   ```typescript
   const categoryImageMap = {
     'Sovereign AI': 'digital governance technology',
     'LMS Scaling': 'education technology learning',
     'Product Design': 'user interface design',
   }
   ```
2. Build search query: `categoryImageMap[category] + (topic || '')`
3. Try Unsplash API (if `UNSPLASH_ACCESS_KEY` set):
   ```typescript
   fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${key}`)
   ```
   - Extract image URL from response: `data.urls.regular`
4. If Unsplash fails or not configured, use placeholder:
   ```
   https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post
   ```
5. Upload image to Sanity (if not placeholder):
   ```typescript
   // Fetch image
   const response = await fetch(imageUrl)
   const buffer = await response.arrayBuffer()
   
   // Upload to Sanity
   const asset = await client.assets.upload('image', Buffer.from(buffer), {
     filename: `${slug}-image.jpg`,
     contentType: response.headers.get('content-type') || 'image/jpeg'
   })
   
   return asset._id  // Return Sanity asset reference ID
   ```

**Code Location:**
```typescript
// lib/content/imageHandler.ts lines 1-90
// lib/sanity/writeClient.ts lines 93-120
// app/api/blog/generate/route.ts lines 118-128
```

---

### Step 6: Save to Sanity CMS

**File:** `lib/sanity/writeClient.ts`

#### 6.1 Create Authenticated Sanity Client

**Function:** `getWriteClient()`

```typescript
const client = createClient({
  projectId: 'jh5avta0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,  // Never use CDN for writes
  token: process.env.SANITY_WRITE_TOKEN
})
```

**Environment Variable:** `SANITY_WRITE_TOKEN` 
- Must be project-level token (not organization-level)
- Must have Editor permissions
- Format: `sk...` (starts with "sk")

**Code Location:**
```typescript
// lib/sanity/writeClient.ts lines 8-21
```

#### 6.2 Build Post Document

**Function:** `createBlogPost(data: CreatePostData)`

**Document Structure:**
```typescript
const document = {
  _type: 'post',                    // Sanity document type
  title: data.title,                // Blog post title
  slug: {
    _type: 'slug',
    current: data.slug               // URL-friendly slug
  },
  author: {
    _type: 'reference',
    _ref: data.authorId             // Reference to author document
  },
  category: data.category,          // Category string
  excerpt: data.excerpt,            // Short description (max 200 chars)
  readTime: data.readTime,          // e.g., "8 MIN READ"
  body: data.body,                  // PortableText array
  publishedAt: data.publishedAt || new Date().toISOString(),
  tags: data.tags,                  // Array of tag strings
  mainImage: data.mainImageAssetId ? {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: data.mainImageAssetId   // Reference to uploaded image
    }
  } : undefined
}
```

**Code Location:**
```typescript
// lib/sanity/writeClient.ts lines 39-88
```

#### 6.3 Create Post in Sanity

```typescript
const client = getWriteClient()
const result = await client.create(document)
return result._id  // Returns Sanity document ID
```

**Sanity API Call Details:**
- **Endpoint:** `https://jh5avta0.api.sanity.io/v2024-01-01/data/mutate/production`
- **Method:** POST
- **Headers:** 
  - `Authorization: Bearer ${SANITY_WRITE_TOKEN}`
  - `Content-Type: application/json`
- **Body:** Mutations array with create operation:
  ```json
  {
    "mutations": [{
      "create": {
        "_type": "post",
        "title": "...",
        // ... rest of document
      }
    }]
  }
  ```

**Response:**
- Returns document with `_id`, `_rev`, `_createdAt`, etc.
- Post is now saved in Sanity CMS
- If `publishedAt` is set, post is published; otherwise, it's a draft

**Code Location:**
```typescript
// lib/sanity/writeClient.ts lines 80-83
// app/api/blog/generate/route.ts lines 136-147
```

---

### Step 7: Return Success Response

**Response Format:**
```json
{
  "success": true,
  "postId": "yphqT3qdV6aBdO2Q138Aje",
  "slug": "building-digital-sovereignty-a-strategic-framework",
  "title": "Building Digital Sovereignty: A Strategic Framework for Government AI Adoption",
  "status": "draft",
  "message": "Blog post \"Building Digital Sovereignty...\" created successfully as draft"
}
```

**Code Location:**
```typescript
// app/api/blog/generate/route.ts lines 149-156
```

---

## API Endpoints

### POST `/api/blog/generate`

Generate and create a blog post in Sanity CMS.

**Request:**
```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "topic": "AI governance frameworks",
    "aiProvider": "gemini",
    "authorId": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
    "publishStatus": "draft"
  }'
```

**Request Body Parameters:**
- `category` (required): Category name (e.g., "Sovereign AI", "LMS Scaling", "Product Design")
- `topic` (optional): Specific topic within category. If not provided, randomly selected from category's topics
- `aiProvider` (optional): AI provider to use. Default: `"gemini"`. Options: `"gemini"`, `"huggingface"`, `"openrouter"`, `"cohere"`
- `authorId` (optional): Sanity author document ID. If not provided, uses first author found
- `publishStatus` (optional): `"draft"` or `"published"`. Default: `"draft"`

**Response (Success - 200):**
```json
{
  "success": true,
  "postId": "yphqT3qdV6aBdO2Q138Aje",
  "slug": "building-digital-sovereignty",
  "title": "Building Digital Sovereignty: A Strategic Framework...",
  "status": "draft",
  "message": "Blog post created successfully as draft"
}
```

**Response (Error - 400/500):**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

**Common Errors:**
- `400`: Invalid category, missing required fields, no author found
- `500`: Sanity connection failed, AI generation failed, token issues

---

### GET `/api/blog/generate`

Get available categories and their configuration.

**Request:**
```bash
curl http://localhost:3000/api/blog/generate
```

**Response:**
```json
{
  "categories": [
    {
      "name": "Sovereign AI",
      "description": "Digital sovereignty, AI governance, and national AI strategies",
      "topics": [
        "Digital sovereignty",
        "AI governance frameworks",
        "National AI strategies",
        "Data localization",
        "AI ethics and compliance",
        "Government AI adoption",
        "Sovereign cloud infrastructure"
      ]
    },
    {
      "name": "LMS Scaling",
      "description": "Learning management systems, education technology, and scalability",
      "topics": [...]
    },
    {
      "name": "Product Design",
      "description": "UX/UI design, product development, and user experience",
      "topics": [...]
    }
  ],
  "availableProviders": ["gemini", "huggingface", "openrouter", "cohere"]
}
```

---

### GET `/api/test-sanity`

Test Sanity connection and token validity.

**Request:**
```bash
curl http://localhost:3000/api/test-sanity
```

**Response (Success):**
```json
{
  "success": true,
  "tokenPresent": true,
  "tokenLength": 182,
  "tokenPrefix": "sk3gOb8sp1...",
  "projectId": "jh5avta0",
  "dataset": "production",
  "testQuery": {
    "_id": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
    "name": "Chirag test"
  },
  "message": "Sanity connection successful!"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Unauthorized - Session not found",
  "details": "Error stack trace..."
}
```

---

## File Structure

```
project-root/
├── app/
│   └── api/
│       └── blog/
│           └── generate/
│               └── route.ts          # Main API endpoint (POST/GET)
│       └── test-sanity/
│           └── route.ts              # Sanity connection test endpoint
├── lib/
│   ├── content/
│   │   ├── categoryConfig.ts        # Category configurations & prompts
│   │   └── imageHandler.ts          # Image fetching & processing
│   └── sanity/
│       ├── config.ts                # Sanity project configuration
│       ├── client.ts                # Read-only Sanity client
│       ├── writeClient.ts           # Write-enabled Sanity client
│       ├── portableTextConverter.ts # Markdown → PortableText converter
│       ├── queries.ts               # GROQ queries for fetching
│       └── utils.ts                 # Utility functions
├── services/
│   ├── geminiService.ts            # Gemini API integration
│   ├── aiContentService.ts         # AI provider abstraction layer
│   ├── huggingFaceService.ts       # Hugging Face integration (optional)
│   ├── openRouterService.ts        # OpenRouter integration (optional)
│   └── cohereService.ts            # Cohere integration (optional)
├── sanity/
│   └── schemas/
│       ├── post.ts                 # Blog post schema definition
│       └── author.ts               # Author schema definition
└── .env.local                       # Environment variables (not in git)
```

---

## Configuration

### Environment Variables

**Required:**
```env
# Gemini API Key (Free Tier)
# Get from: https://aistudio.google.com/apikey
API_KEY=your_gemini_api_key_here

# Sanity Write Token (Project-level with Editor permissions)
# Get from: https://www.sanity.io/manage/personal/project/jh5avta0/api
SANITY_WRITE_TOKEN=your_sanity_write_token_here
```

**Optional:**
```env
# Unsplash API Key (for blog post images)
# Get from: https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Alternative AI Providers (Free tiers available)
HUGGING_FACE_API_KEY=your_hf_token_here
OPENROUTER_API_KEY=your_openrouter_key_here
COHERE_API_KEY=your_cohere_key_here
```

### Sanity Configuration

**File:** `lib/sanity/config.ts`

```typescript
export const config = {
  projectId: 'jh5avta0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
}
```

### Category Configuration

**File:** `lib/content/categoryConfig.ts`

Each category defines:
- `name`: Category display name
- `description`: What the category covers
- `targetAudience`: Who reads this content
- `tone`: Writing style (e.g., "Professional, authoritative")
- `topics`: Array of topics (one randomly selected if not specified)
- `promptTemplate`: AI prompt with placeholders:
  - `{topic}` - Selected topic
  - `{targetAudience}` - Target audience
  - `{tone}` - Writing tone

**Example:**
```typescript
'Sovereign AI': {
  name: 'Sovereign AI',
  description: 'Digital sovereignty, AI governance, and national AI strategies',
  targetAudience: 'Government officials, policy makers, and public sector stakeholders',
  tone: 'Professional, authoritative, strategic, forward-thinking',
  topics: [
    'Digital sovereignty',
    'AI governance frameworks',
    'National AI strategies',
    // ... more topics
  ],
  promptTemplate: `Write a comprehensive blog post about {topic}...
    Target audience: {targetAudience}
    Tone: {tone}
    ...`
}
```

---

## Usage Examples

### Generate Blog Post (Basic)

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "publishStatus": "draft"
  }'
```

### Generate with Specific Topic

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "LMS Scaling",
    "topic": "Multi-tenant architecture",
    "publishStatus": "draft"
  }'
```

### Generate and Publish Immediately

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Product Design",
    "authorId": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
    "publishStatus": "published"
  }'
```

### Use Different AI Provider

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "aiProvider": "huggingface",
    "publishStatus": "draft"
  }'
```

### Get Available Categories

```bash
curl http://localhost:3000/api/blog/generate
```

### Test Sanity Connection

```bash
curl http://localhost:3000/api/test-sanity
```

---

## Data Flow Summary

1. **Request** → API endpoint receives POST request with category
2. **Validation** → Category, provider, and Sanity connection validated
3. **Prompt Generation** → Category config builds AI prompt with topic
4. **AI Service** → Routes to appropriate AI provider (Gemini by default)
5. **Gemini API Call** → Generates blog content in JSON format
6. **Response Parsing** → JSON parsed to extract title, excerpt, body, tags
7. **Content Processing** → 
   - Markdown converted to PortableText
   - Slug generated from title
   - Read time calculated
   - Image fetched and uploaded
8. **Author Resolution** → Get author ID (provided or default)
9. **Sanity Upload** → Image uploaded to Sanity (if available)
10. **Post Creation** → Post document created in Sanity CMS
11. **Response** → Success response with post ID, slug, and details

---

## Troubleshooting

### Common Errors

#### 1. "SANITY_WRITE_TOKEN is required"
**Cause:** Environment variable not set  
**Solution:** 
- Add `SANITY_WRITE_TOKEN` to `.env.local`
- Restart development server

#### 2. "Unauthorized - Session not found"
**Cause:** Invalid or wrong type of Sanity token  
**Solution:**
- Ensure token is project-level (not organization-level)
- Ensure token has Editor permissions
- Regenerate token from: https://www.sanity.io/manage/personal/project/jh5avta0/api
- See `FIX_TOKEN_ERROR.md` for detailed steps

#### 3. "No author found"
**Cause:** No authors exist in Sanity  
**Solution:**
- Create an author in Sanity Studio: `http://localhost:3000/studio`
- Click "Author" → "Create new"
- Fill in Name, Title, and Image
- Click "Publish"
- Or provide `authorId` in API request

#### 4. "Invalid category"
**Cause:** Category doesn't exist in configuration  
**Solution:**
- Check available categories: `GET /api/blog/generate`
- Use exact category name (case-sensitive)
- Add new category in `lib/content/categoryConfig.ts` if needed

#### 5. "Failed to generate blog content"
**Cause:** AI API error (rate limit, invalid key, network issue)  
**Solution:**
- Check Gemini API key is valid
- Check rate limits (15 requests/minute for free tier)
- Try different AI provider
- Check network connection

#### 6. "Failed to upload image"
**Cause:** Image fetch or upload failed  
**Solution:**
- System continues without image (uses placeholder)
- Check Unsplash API key if using Unsplash
- Check network connection

### Debugging Tips

1. **Check Server Logs:**
   - Look for console.log messages in terminal
   - Check for error stack traces

2. **Test Sanity Connection:**
   ```bash
   curl http://localhost:3000/api/test-sanity
   ```

3. **Verify Environment Variables:**
   ```bash
   # Check if variables are loaded
   node -e "console.log(process.env.API_KEY ? 'API_KEY set' : 'API_KEY missing')"
   ```

4. **Check Author Exists:**
   - Go to Sanity Studio: `http://localhost:3000/studio`
   - Navigate to "Author" section
   - Verify at least one author is published

5. **Verify Token Permissions:**
   - Go to Sanity dashboard
   - Check token has "Editor" permissions
   - Verify token is for project `jh5avta0` and dataset `production`

### Performance Considerations

- **Gemini API Rate Limits:** 15 requests/minute (free tier)
- **Response Time:** ~15-30 seconds per post generation
- **Image Upload:** Adds ~2-5 seconds if using Unsplash
- **Sanity Write:** ~1-2 seconds per post creation
- **Total Time:** ~20-40 seconds for complete workflow

### Security Notes

- ⚠️ Never commit `.env.local` to git (already in `.gitignore`)
- ⚠️ Never share API keys publicly
- ⚠️ Use project-level Sanity tokens (not organization-level)
- ⚠️ Regenerate tokens if accidentally exposed
- ✅ Tokens can be revoked anytime in Sanity dashboard
- ✅ API keys can be regenerated in Google AI Studio

---

## Additional Resources

- **Sanity Setup:** See `SANITY_SETUP.md`
- **Token Setup:** See `SANITY_TOKEN_SETUP.md`
- **Category Configuration:** See `UPDATE_CATEGORIES_AND_PROMPTS.md`
- **Adding Categories:** See `ADD_NEW_CATEGORY_EXAMPLE.md`
- **Fixing Token Errors:** See `FIX_TOKEN_ERROR.md`

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review relevant documentation files
3. Check server logs for detailed error messages
4. Test individual components (Sanity connection, Gemini API)

---

**Last Updated:** 2024
**System Version:** 1.0.0

