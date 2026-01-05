# How to Add a New Category - Quick Guide

## Step-by-Step Instructions

### Step 1: Open the File
Open: `lib/content/categoryConfig.ts`

### Step 2: Add Your Category
Add a new entry **before the closing `}`** of `categoryConfigs`. 

### Step 3: Copy This Template

```typescript
'Your Category Name': {
  name: 'Your Category Name',
  description: 'What this category is about',
  targetAudience: 'Who reads this content',
  tone: 'Professional, technical, friendly, etc.',
  topics: [
    'Topic 1',
    'Topic 2',
    'Topic 3',
    'Topic 4',
  ],
  promptTemplate: `Write a comprehensive blog post about {topic}.

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 800-2000 words in length
- Include relevant examples and insights
- Focus on practical applications
- Provide actionable recommendations
- Be well-structured with clear headings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, and emphasis where appropriate.`,
},
```

## Real Example: Adding "Cloud Infrastructure" Category

Here's a complete example you can copy:

```typescript
'Cloud Infrastructure': {
  name: 'Cloud Infrastructure',
  description: 'Cloud computing, infrastructure automation, and scalable architectures',
  targetAudience: 'CTOs, DevOps engineers, and infrastructure architects',
  tone: 'Technical, detailed, solution-focused',
  topics: [
    'Multi-cloud strategies',
    'Infrastructure as Code',
    'Container orchestration',
    'Serverless architectures',
    'Cloud security best practices',
    'Cost optimization',
  ],
  promptTemplate: `Write a comprehensive, technical blog post about {topic} in the context of cloud infrastructure and enterprise architecture.

Target audience: {targetAudience}
Tone: {tone}

The post should:
- Be 1000-2000 words in length
- Include technical details and best practices
- Focus on scalability, security, and cost-effectiveness
- Provide real-world examples and case studies
- Include code examples or architecture diagrams where relevant
- Cover compliance and governance aspects
- Be well-structured with clear headings and subheadings

Format the content in markdown with proper headings (##, ###), paragraphs, lists, code blocks, and emphasis where appropriate.`,
},
```

## Where to Add It

Add it **after** the last category (Product Design) and **before** the closing `}`:

```typescript
  'Product Design': {
    // ... existing code ...
  },
  'Your New Category': {  // ← Add here
    // ... your category config ...
  },
}  // ← Before this closing brace
```

## After Adding

1. **Save the file**
2. **No restart needed** - Next.js will pick up the changes automatically
3. **Test it:**

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Your Category Name",
    "publishStatus": "draft"
  }'
```

## Check Available Categories

```bash
curl http://localhost:3000/api/blog/generate
```

This will show all categories including your new one!

## Tips

- **Category name** - Use the exact name in API calls (case-sensitive)
- **Topics** - Add 5-7 relevant topics (one will be randomly selected)
- **Prompt template** - Customize to match your content style
- **Use variables** - `{topic}`, `{targetAudience}`, `{tone}` are automatically replaced

