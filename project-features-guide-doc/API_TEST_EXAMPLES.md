# API Test Examples

Quick reference for testing the Blog Content Generation API.

## Quick Test Commands

### 1. Test Sanity Connection
```bash
curl http://localhost:3000/api/test-sanity
```

### 2. Get Available Categories
```bash
curl http://localhost:3000/api/blog/generate
```

### 3. Generate Basic Blog Post
```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "publishStatus": "draft"
  }'
```

## JSON Request Examples

### Basic Generation
```json
{
  "category": "Sovereign AI",
  "publishStatus": "draft"
}
```

### With Specific Topic
```json
{
  "category": "Sovereign AI",
  "topic": "AI governance frameworks",
  "publishStatus": "draft"
}
```

### Publish Immediately
```json
{
  "category": "LMS Scaling",
  "topic": "Multi-tenant architecture",
  "publishStatus": "published"
}
```

### With Custom Author
```json
{
  "category": "Product Design",
  "authorId": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
  "publishStatus": "draft"
}
```

### All Parameters
```json
{
  "category": "Sovereign AI",
  "topic": "Digital sovereignty",
  "aiProvider": "gemini",
  "authorId": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
  "publishStatus": "draft"
}
```

## Response Examples

### Success Response
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

### Error Response
```json
{
  "error": "Invalid category. Available categories: Sovereign AI, LMS Scaling, Product Design"
}
```

## Available Categories

1. **Sovereign AI**
   - Topics: Digital sovereignty, AI governance frameworks, National AI strategies, Data localization, AI ethics and compliance, Government AI adoption, Sovereign cloud infrastructure

2. **LMS Scaling**
   - Topics: LMS scalability challenges, Multi-tenant architecture, Education technology trends, Learning analytics, Platform performance optimization, User experience in education, Enterprise LMS deployment

3. **Product Design**
   - Topics: User experience design, Citizen-centric design, Government portal UX, Design systems, Accessibility in design, Mobile-first design, Design thinking methodologies

## Using with Postman

1. Import the collection from `API_TEST_EXAMPLES.json`
2. Set base URL to `http://localhost:3000`
3. Run the requests

## Using with VS Code REST Client

1. Install "REST Client" extension
2. Open `API_TEST_REQUESTS.http`
3. Click "Send Request" above each request

## Using with cURL

All examples are provided in the JSON file under `curlExamples` section.

## Testing Checklist

- [ ] Test Sanity connection works
- [ ] Get categories returns all categories
- [ ] Generate product post with each category
- [ ] Generate product post with specific topic
- [ ] Generate and publish immediately
- [ ] Test error handling (invalid category, missing fields)
- [ ] Verify images are uploaded and rendering
- [ ] Check generated posts in Sanity Studio

