# How to Update Categories and Prompts

## File Location
All category configurations are in: **`lib/content/categoryConfig.ts`**

## Understanding the Structure

Each category has:
- **name**: Display name
- **description**: Brief description
- **targetAudience**: Who the content is for
- **tone**: Writing style
- **topics**: List of topics (one is randomly selected if not specified)
- **promptTemplate**: The AI prompt with placeholders `{topic}`, `{targetAudience}`, `{tone}`

## How to Edit an Existing Category

### Example: Update "Sovereign AI" Category

```typescript
'Sovereign AI': {
  name: 'Sovereign AI',
  description: 'Your updated description',
  targetAudience: 'Your target audience',
  tone: 'Your desired tone',
  topics: [
    'Topic 1',
    'Topic 2',
    'Your new topic',  // Add more topics here
  ],
  promptTemplate: `Write a comprehensive blog post about {topic}.

Target audience: {targetAudience}
Tone: {tone}

Your custom instructions here...
- Point 1
- Point 2
- Point 3

Format the content in markdown...`,
},
```

### Key Points:
- `{topic}` - Gets replaced with a topic from the topics array
- `{targetAudience}` - Gets replaced with the targetAudience value
- `{tone}` - Gets replaced with the tone value
- You can add any instructions you want in the promptTemplate

## How to Add a New Category

### Step 1: Add Category Configuration

Add a new entry in `categoryConfigs`:

```typescript
'Your New Category': {
  name: 'Your New Category',
  description: 'Description of what this category covers',
  targetAudience: 'Who should read this content',
  tone: 'Professional, friendly, technical, etc.',
  topics: [
    'Topic 1',
    'Topic 2',
    'Topic 3',
  ],
  promptTemplate: `Write a comprehensive blog post about {topic}.

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 800-2000 words
- Include specific requirements
- Focus on your key areas
- Provide actionable insights

Format in markdown with headings (##, ###), paragraphs, lists, etc.`,
},
```

### Step 2: Use the New Category

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Your New Category",
    "publishStatus": "draft"
  }'
```

## Examples

### Example 1: Update Prompt for Existing Category

**Before:**
```typescript
promptTemplate: `Write a blog post about {topic}...`
```

**After (more specific):**
```typescript
promptTemplate: `Write a comprehensive, data-driven blog post about {topic} in the context of VersionLabs' expertise.

Target audience: {targetAudience}
Tone: {tone}

The post must:
- Start with a compelling hook
- Include at least 3 real-world examples
- Reference VersionLabs case studies where relevant
- End with a clear call-to-action
- Be 1200-1800 words
- Use markdown formatting with ## for main headings, ### for subheadings
- Include bullet points and numbered lists where appropriate
- Add emphasis using **bold** for key terms`
```

### Example 2: Add a New Category

```typescript
'Cloud Infrastructure': {
  name: 'Cloud Infrastructure',
  description: 'Cloud computing, infrastructure as code, and scalable architectures',
  targetAudience: 'CTOs, DevOps engineers, and infrastructure architects',
  tone: 'Technical, detailed, solution-focused',
  topics: [
    'Multi-cloud strategies',
    'Infrastructure automation',
    'Container orchestration',
    'Serverless architectures',
    'Cloud security best practices',
  ],
  promptTemplate: `Write a technical blog post about {topic} focusing on enterprise cloud infrastructure.

Target audience: {targetAudience}
Tone: {tone}

Requirements:
- 1000-2000 words
- Include code examples where relevant
- Cover security and compliance aspects
- Provide implementation guidance
- Use markdown with code blocks for examples`,
},
```

### Example 3: Update Topics List

```typescript
topics: [
  'Original topic 1',
  'Original topic 2',
  'New topic: AI-powered analytics',  // Add new topics
  'New topic: Real-time data processing',
  'New topic: Edge computing strategies',
],
```

## Prompt Template Variables

You can use these variables in your prompt:
- `{topic}` - Selected topic from the topics array
- `{targetAudience}` - The target audience
- `{tone}` - The writing tone

**Note:** These are automatically replaced when generating content.

## Custom Instructions in Prompts

You can add any instructions, such as:
- Word count requirements
- Structure requirements (headings, sections)
- Style guidelines
- Content requirements (examples, case studies)
- Formatting requirements
- SEO considerations
- Call-to-action requirements

## Testing Your Changes

1. **Edit the file**: `lib/content/categoryConfig.ts`
2. **Save the file**
3. **Restart your dev server** (if needed):
   ```bash
   npm run dev
   ```
4. **Test with a specific topic**:
   ```bash
   curl -X POST http://localhost:3000/api/blog/generate \
     -H "Content-Type: application/json" \
     -d '{
       "category": "Your Category",
       "topic": "Specific Topic Name",
       "publishStatus": "draft"
     }'
   ```

## View Available Categories

Check what categories are available:
```bash
curl http://localhost:3000/api/blog/generate
```

This returns all categories with their topics and descriptions.

## Tips

1. **Be specific in prompts** - More detailed prompts = better content
2. **Update topics regularly** - Keep topics relevant and current
3. **Test different tones** - Experiment with different writing styles
4. **Use placeholders** - Leverage `{topic}`, `{targetAudience}`, `{tone}` for flexibility
5. **Keep prompts focused** - Clear instructions produce better results

## Quick Reference

**File to edit:** `lib/content/categoryConfig.ts`

**Key functions:**
- `categoryConfigs` - Object containing all categories
- `getCategoryConfig(category)` - Get config for a category
- `getAllCategories()` - Get list of all category names
- `getCategoryPrompt(category, topic?)` - Get the final prompt string

