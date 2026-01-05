# Regenerate Sanity Token - Step by Step

## The Issue
The current token is returning "Unauthorized - Session not found", which means the token is invalid or wasn't copied correctly.

## Solution: Create a Fresh Token

### Step 1: Delete the Old Token
1. Go to: https://www.sanity.io/manage/personal/project/jh5avta0/api
2. Find the token "Content generator" in the list
3. Click the **trash icon** to delete it

### Step 2: Create a New Token
1. Click **"+ Add API token"** button
2. Fill in:
   - **Name:** `Blog Content Generator` (or any name)
   - **Permissions:** Select **"Editor"**
   - **Dataset:** Select **"production"**
3. Click **"Save"** or **"Create"**

### Step 3: Copy the Token CAREFULLY
⚠️ **CRITICAL STEPS:**
1. The token will appear in a yellow warning box
2. Click the **copy icon** next to the token (don't manually select and copy)
3. Or carefully select the ENTIRE token string (it's very long, ~180 characters)
4. Make sure you get the COMPLETE token - it starts with `sk` and is very long

### Step 4: Verify Token Format
The token should:
- Start with `sk`
- Be approximately 180-200 characters long
- Have NO spaces or line breaks
- Look like: `skhx11Jm8hqA0DAQyJSIny4qMprrRNPj8D8TIi22uSgRx0Nm3vBW1gtVge8vfmqBgmlzPlVbAMztct6tkLEBSVqHA4Bp6muGU2bPcDZo0gUTokpyJXqk2RaF4a3bittmmSoHXBjldx5EYjX0jdX5FjJuhC7CeaZ09LShXYK1Z36x9QuZYB9e`

### Step 5: Update .env.local
1. Open `.env.local` in your project
2. Find the line: `SANITY_WRITE_TOKEN=...`
3. Replace everything after `=` with the NEW token
4. Make sure there are NO spaces around the `=`
5. Make sure there are NO quotes around the token
6. Save the file

**Correct format:**
```env
SANITY_WRITE_TOKEN=skhx11Jm8hqA0DAQyJSIny4qMprrRNPj8D8TIi22uSgRx0Nm3vBW1gtVge8vfmqBgmlzPlVbAMztct6tkLEBSVqHA4Bp6muGU2bPcDZo0gUTokpyJXqk2RaF4a3bittmmSoHXBjldx5EYjX0jdX5FjJuhC7CeaZ09LShXYK1Z36x9QuZYB9e
```

**WRONG formats (don't do this):**
```env
SANITY_WRITE_TOKEN = skhx11...  ❌ (spaces around =)
SANITY_WRITE_TOKEN="skhx11..."  ❌ (quotes)
SANITY_WRITE_TOKEN= skhx11...   ❌ (space after =)
```

### Step 6: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 7: Test
```bash
curl http://localhost:3000/api/test-sanity
```

You should see `{"success":true,...}` if it works!

## Common Mistakes
1. ❌ Copying token with extra spaces
2. ❌ Missing characters at the end of the token
3. ❌ Adding quotes around the token in .env.local
4. ❌ Not restarting the server after updating .env.local
5. ❌ Using an organization-level token instead of project-level

## Still Not Working?
If you still get errors after regenerating:
1. Double-check the token in Sanity dashboard - make sure it shows "Editor" permissions
2. Verify the token is for project `jh5avta0` and dataset `production`
3. Check `.env.local` - make sure there are no hidden characters
4. Try creating the token again with a different name

