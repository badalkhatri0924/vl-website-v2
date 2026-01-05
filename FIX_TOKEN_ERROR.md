# Fix: "project user not found" Error

## Problem
The error `"project user not found for user ID"` means your token is **not a project-level token** or was created for a different project.

## Solution: Create a Project-Level Token

### Step 1: Go to Project API Settings

**Direct Link:** 
```
https://www.sanity.io/manage/personal/project/jh5avta0/api
```

Or navigate manually:
1. Go to https://www.sanity.io/manage
2. Click on your project: **jh5avta0** (or "VersionLabs Website")
3. In the left sidebar, click **"API"**
4. You should see **"API tokens"** section

### Step 2: Create New Token

1. Click **"+ Add API token"** or **"Create token"**
2. Fill in:
   - **Name:** `Blog Content Generator`
   - **Permissions:** Select **"Editor"** (NOT Viewer)
   - **Dataset:** Select **"production"** (your dataset name)
3. Click **"Save"** or **"Create"**

### Step 3: Copy the Token

⚠️ **CRITICAL:** The token is shown **ONLY ONCE**. Copy it immediately!

The token will look like:
```
skxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Update .env.local

1. Open `.env.local` in your project root
2. Replace the `SANITY_WRITE_TOKEN` value with the new token:

```env
# Gemini API Key (Free Tier)
API_KEY=AIzaSyAtik_ETtKtk3yRbYFCMozBKSFIaWxdjRA

# Sanity Write Token (PROJECT-LEVEL token required)
SANITY_WRITE_TOKEN=skxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file

### Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Test Again

```bash
curl -X POST http://localhost:3000/api/blog/generate \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Sovereign AI",
    "authorId": "e1c4a23d-a254-4313-84a6-b1d07ef22973",
    "publishStatus": "draft"
  }'
```

## How to Verify Token is Project-Level

A **project-level token**:
- ✅ Starts with `sk` (Sanity token)
- ✅ Is created from the **Project** API settings (not Organization)
- ✅ Has Editor permissions
- ✅ Is associated with a specific dataset

An **organization-level token**:
- ❌ Won't work for project operations
- ❌ Causes "project user not found" errors
- ❌ Is created from Organization settings

## Still Having Issues?

1. **Check token permissions:**
   - Must be **Editor** (not Viewer)
   - Must be for **production** dataset

2. **Verify project ID:**
   - Your project ID is: `jh5avta0`
   - Token must be created for this exact project

3. **Check token format:**
   - Should start with `sk`
   - Should be very long (100+ characters)
   - No spaces or line breaks

4. **Delete old token and create new one:**
   - In Sanity dashboard, delete the old token
   - Create a fresh one following steps above

