# Image Generation and Rendering Fix

## Changes Made

### 1. Gemini-Enhanced Image Search Queries

**File:** `lib/content/imageHandler.ts`

- Added `generateImageSearchQueryWithGemini()` function
- Uses Gemini API to generate better, more specific image search queries based on:
  - Blog post title
  - Category
  - Topic (if provided)
- Falls back to basic category mapping if Gemini fails

**How it works:**
1. Gemini analyzes the blog post title and category
2. Generates a concise, visual search query (2-4 words)
3. This enhanced query is used with Unsplash API
4. Results in more relevant images for blog posts

### 2. Improved Image Upload Handling

**File:** `app/api/blog/generate/route.ts`

- Enhanced image upload logic with better error handling
- Always uploads a placeholder image if other methods fail
- Ensures every blog post has an image (no null images)
- Better logging for debugging image issues

**Process:**
1. Try to get image using Gemini-enhanced search query
2. Try Unsplash with enhanced query
3. If both fail, upload placeholder image to Sanity
4. Ensures `mainImageAssetId` is always set

### 3. Fixed Image Rendering in Queries

**File:** `lib/sanity/queries.ts`

- Added `coalesce()` function to GROQ queries
- Provides fallback placeholder URL if image is missing
- Prevents `null` imageUrl in frontend

**Before:**
```groq
"imageUrl": mainImage.asset->url  // Could be null
```

**After:**
```groq
"imageUrl": coalesce(mainImage.asset->url, "https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post")
```

### 4. Frontend Image Fallbacks

**Files:** 
- `components/BlogView.tsx`
- `components/BlogPostView.tsx`

- Added fallback placeholder URLs in image `src` attributes
- Added `onError` handlers to catch image load failures
- Ensures images always display, even if URL is broken

**Example:**
```tsx
<img 
  src={post.imageUrl || 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'} 
  alt={post.title}
  onError={(e) => {
    const target = e.target as HTMLImageElement
    target.src = 'https://via.placeholder.com/1200x630/4A5568/FFFFFF?text=Blog+Post'
  }}
/>
```

### 5. Type Safety Updates

**File:** `lib/sanity/utils.ts`

- Updated `SanityBlogPost` interface
- Changed `imageUrl: string` to `imageUrl: string | null`
- Better TypeScript type safety

## How Gemini Image Generation Works

### Current Implementation

Gemini API doesn't directly generate images, but we use it to:

1. **Enhance Image Search Queries:**
   - Input: Blog post title, category, topic
   - Gemini generates: Optimized search query for image services
   - Output: Better search terms → Better images from Unsplash

2. **Future: Direct Image Generation**
   - When Google's Imagen 3 API becomes available, we can integrate it
   - The structure is already in place for easy integration

### Example Flow

```
Blog Post: "Building Digital Sovereignty: A Strategic Framework"
Category: "Sovereign AI"
Topic: "AI governance frameworks"

↓ Gemini Analysis

Enhanced Search Query: "digital governance technology framework"

↓ Unsplash Search

Relevant Professional Image

↓ Upload to Sanity

Image displayed in blog post
```

## Image Rendering Fixes

### Problem
- Images were not rendering because:
  1. Image upload might fail silently
  2. Query returns `null` for missing images
  3. Frontend doesn't handle `null` imageUrl

### Solution
1. **Always upload an image** (even if it's a placeholder)
2. **Query uses `coalesce()`** to provide fallback
3. **Frontend has multiple fallbacks:**
   - Default value in `src` attribute
   - `onError` handler for broken URLs
   - Placeholder URL as final fallback

## Testing

### Test Image Generation

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "topic": "AI governance frameworks",
    "publishStatus": "draft"
  }'
```

### Check Server Logs

Look for:
- `"Gemini-generated image search query: ..."`
- `"Image URL fetched: Image found"`
- `"Uploading image to Sanity from URL: ..."`
- `"Image uploaded successfully, asset ID: ..."`

### Verify in Sanity Studio

1. Go to `http://localhost:3000/studio`
2. Open the generated blog post
3. Check if `Main Image` field has an image
4. Verify the image displays correctly

### Verify on Frontend

1. Go to `http://localhost:3000/blog`
2. Check if featured post has an image
3. Click on a post and verify hero image displays
4. Check browser console for image load errors

## Troubleshooting

### Images Still Not Rendering

1. **Check Sanity Studio:**
   - Verify image is uploaded in the post document
   - Check if `mainImage` field has a value

2. **Check Server Logs:**
   - Look for image upload errors
   - Check if `mainImageAssetId` is being set

3. **Check Network Tab:**
   - Verify image URLs are accessible
   - Check for CORS or 404 errors

4. **Verify Query:**
   ```bash
   # Test the query directly
   curl http://localhost:3000/api/test-sanity
   ```

### Image Upload Fails

**Common causes:**
- Invalid image URL (404, CORS blocked)
- Sanity token doesn't have asset upload permissions
- Network issues

**Solution:**
- System automatically falls back to placeholder
- Check `SANITY_WRITE_TOKEN` has Editor permissions
- Verify network connectivity

### Gemini Search Query Generation Fails

**Fallback behavior:**
- Uses basic category mapping
- Still tries Unsplash with basic query
- Falls back to placeholder if all fails

## Future Enhancements

### Direct Image Generation

When available, integrate:
- **Google Imagen 3 API** - Direct image generation
- **DALL-E API** - Alternative image generation
- **Stable Diffusion API** - Open-source option

### Current Structure Ready For:
```typescript
// Future implementation
export async function generateImageWithImagen(
  prompt: string
): Promise<string> {
  // Call Imagen 3 API
  // Return image URL or base64
}
```

## Summary

✅ **Gemini-enhanced image search queries** - Better image relevance  
✅ **Always upload images** - No null images in posts  
✅ **Query fallbacks** - `coalesce()` provides placeholder  
✅ **Frontend fallbacks** - Multiple layers of image fallback  
✅ **Better error handling** - Comprehensive logging  
✅ **Type safety** - Proper TypeScript types  

Images should now always render, even if generation or upload fails!

