# Sanity Blog System Setup

This project uses Sanity CMS for managing blog posts. The blog system is fully integrated with Next.js and provides a clean content management experience.

## Project Configuration

- **Project ID**: `jh5avta0`
- **Dataset**: `production`
- **Studio URL**: `/studio` (when running locally)

## Setup Instructions

### 1. Environment Variables

No environment variables are required for basic Sanity setup. The project ID is hardcoded in the configuration. However, if you need to use a different dataset or project, you can add:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=jh5avta0
NEXT_PUBLIC_SANITY_DATASET=production
```

### 2. Access Sanity Studio

To manage your blog content:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/studio`

3. You'll be prompted to authenticate with Sanity (if not already logged in)

### 3. Create Your First Blog Post

**To create a new blog post in Sanity Studio:**

1. Navigate to `http://localhost:3000/studio`
2. In the left sidebar, click on **"Posts"** (under the "Content" section)
3. You'll see the Posts list. Look for the **"+" button** in the top-right corner of the Posts panel (next to the search bar)
4. Click the **"+" button** or click **"Create new"** if you see that option
5. Fill in all the required fields:
   - **Title**: The blog post title (e.g., "The Future of Digital Governance")
   - **Slug**: This will auto-generate from the title, or you can customize it
   - **Author**: Click to select an existing author, or create one first (see step 4 below)
   - **Main Image**: Click to upload a featured image for your post
   - **Category**: Enter a category (e.g., "Sovereign AI", "LMS Scaling", "Product Design")
   - **Published At**: Click the date field and select when to publish
   - **Excerpt**: Write a short description (max 200 characters)
   - **Read Time**: Enter something like "8 MIN READ" or "12 MIN READ"
   - **Body**: Use the rich text editor to write your post content. You can:
     - Add headings, bold, italic text
     - Insert images
     - Create lists
     - Add links
   - **Tags**: (Optional) Click "Add item" to add tags like "Digital Sovereignty", "AI", etc.

6. Once all fields are filled, click the **"Publish"** button in the top-right corner

**Note:** If you don't see the "+" button, make sure you're logged into Sanity. You may need to authenticate first.

### 4. Create Authors

Before creating posts, you'll need to create authors:

1. Click on "Author" in the sidebar
2. Click "Create new"
3. Fill in:
   - **Name**: Author's full name
   - **Title**: e.g., "Chief Architect, VersionLabs"
   - **Image**: Author's profile picture

4. Click "Publish"

## Schema Structure

### Post Schema
- `title` (string, required)
- `slug` (slug, required, auto-generated from title)
- `author` (reference to author, required)
- `mainImage` (image, required)
- `category` (string, required)
- `publishedAt` (datetime, required)
- `excerpt` (text, required, max 200 chars)
- `readTime` (string, required)
- `body` (array of blocks, required) - Rich text content
- `tags` (array of strings, optional)

### Author Schema
- `name` (string, required)
- `title` (string, required)
- `image` (image, required)

## Features

- ✅ Full CRUD operations via Sanity Studio
- ✅ Rich text editor with image support
- ✅ Automatic slug generation
- ✅ Author management
- ✅ Category and tag support
- ✅ Image optimization via Sanity CDN
- ✅ PortableText rendering for rich content
- ✅ Static site generation support
- ✅ SEO-friendly URLs

## API Queries

The blog system uses GROQ queries located in `lib/sanity/queries.ts`:

- `blogPostsQuery`: Fetches all posts ordered by publication date
- `blogPostBySlugQuery`: Fetches a single post by slug
- `blogPostSlugsQuery`: Fetches all post slugs for static generation

## Components

- `BlogView`: Displays the blog listing page
- `BlogPostView`: Displays individual blog post pages
- `PortableTextRenderer`: Renders Sanity's PortableText content

## Deployment

When deploying:

1. Ensure your Sanity project is set up and accessible
2. The blog will automatically fetch content from Sanity
3. Static pages are generated at build time for better performance
4. Images are served from Sanity's CDN (cdn.sanity.io)

## Troubleshooting

### Studio not loading
- Check that you're logged into Sanity
- Verify the project ID in `sanity.config.ts` matches your Sanity project

### Posts not appearing
- Ensure posts are published (not just saved as drafts)
- Check that the dataset name matches (default: "production")
- Verify your GROQ queries in `lib/sanity/queries.ts`

### Images not loading
- Check that `next.config.js` includes `cdn.sanity.io` in `remotePatterns`
- Verify image URLs are correctly formatted in queries

## Next Steps

1. Create your first author in Sanity Studio
2. Create your first blog post
3. Customize the blog styling in `components/BlogView.tsx` and `components/BlogPostView.tsx`
4. Add more fields to the schema if needed (e.g., SEO metadata, related posts)

