# Sanity API Token Setup Guide

## Important: You Need a PROJECT-LEVEL Token

The modal you're seeing is for **Organization-level** tokens. For blog post creation, you need a **Project-level** token instead.

## Step-by-Step Instructions

### Step 1: Navigate to Your Project

1. In the Sanity dashboard, click on **"Select a project"** dropdown at the top
2. Select your project: **jh5avta0** (or the project name)
3. This will take you to the project dashboard

### Step 2: Go to Project API Settings

1. Once in your project dashboard, look for **"API"** in the left sidebar
2. Click on **"API"** or **"API settings"**
3. You should see a section for **"API tokens"** or **"Tokens"**

### Step 3: Create a New Token

1. Click **"+ Add API token"** or **"Create token"**
2. Fill in the token details:

   **Token Name:**
   ```
   Blog Content Generator
   ```
   (or any descriptive name you prefer)

   **Permissions:**
   - Select **"Editor"** permissions
   - This gives the token read and write access to your dataset

   **Dataset:**
   - Make sure it's set to **"production"** (your dataset name)
   - Or select "All datasets" if you want it to work with any dataset

3. Click **"Save token"** or **"Create"**

### Step 4: Copy the Token

⚠️ **IMPORTANT:** After creating the token, Sanity will show you the token value **ONCE**. 

1. **Copy the token immediately** - it looks like: `skxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
2. You won't be able to see it again after closing the modal
3. If you lose it, you'll need to create a new token

### Step 5: Add Token to Your Project

1. Open your `.env.local` file in the project root
2. Add the token:

```env
# Gemini API Key (Free Tier)
API_KEY=AIzaSyAtik_ETtKtk3yRbYFCMozBKSFIaWxdjRA

# Sanity Write Token (Required for creating blog posts)
SANITY_WRITE_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Replace `skxxxxxxxx...` with your actual token
4. Save the file

### Step 6: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

## Alternative: If You Can't Find Project API Settings

If you don't see the API section in your project:

1. Go to: `https://www.sanity.io/manage/personal/project/jh5avta0/api`
2. Replace `jh5avta0` with your actual project ID if different
3. This should take you directly to the API tokens page

## Verify Token Works

After setting up, test the token by making a request:

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "publishStatus": "draft"
  }'
```

If you get an error about missing author, create an author first in Sanity Studio at `http://localhost:3000/studio`.

## Troubleshooting

### Error: "SANITY_WRITE_TOKEN is required"
- Make sure `.env.local` exists in your project root
- Verify the token is correctly added (no extra spaces or quotes)
- Restart your dev server after adding the token

### Error: "Insufficient permissions"
- Make sure the token has **Editor** permissions (not Viewer)
- Verify the token is for the correct project and dataset

### Error: "Token not found"
- The token might be deleted or invalid
- Create a new token and update `.env.local`

## Security Notes

- ⚠️ Never commit `.env.local` to git (it's already in `.gitignore`)
- ⚠️ Never share your token publicly
- ⚠️ If you accidentally commit a token, regenerate it immediately in Sanity
- ✅ Tokens can be revoked and recreated anytime in Sanity dashboard

