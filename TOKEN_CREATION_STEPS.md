# Create Token - Quick Steps

## You're in the Right Place! ✅

You're on the "Add API token" form. Here's what to do:

### Step 1: Enter Token Name
In the "Name" field, type:
```
Blog Content Generator
```
(or any name you prefer)

### Step 2: Select Permissions ⚠️ IMPORTANT
**Currently "Viewer" is selected - you need to change this!**

Click on **"Editor"** (NOT Viewer)

**Why?**
- ❌ **Viewer** = Read-only (can't create posts)
- ✅ **Editor** = Read + Write (can create posts) ← **Use this one**
- ✅ **Developer** = Read + Write + Settings (also works, but Editor is enough)

### Step 3: Click "Save"
Click the blue "Save" button at the bottom

### Step 4: Copy the Token
⚠️ **CRITICAL:** After clicking Save, you'll see the token **ONCE**. 
- Click the **copy icon** next to the token
- Or carefully copy the entire token (it's very long, ~180 characters)

### Step 5: Update .env.local
1. Open `.env.local` in your project
2. Find: `SANITY_WRITE_TOKEN=...`
3. Replace with: `SANITY_WRITE_TOKEN=your_new_token_here`
4. Save

### Step 6: Restart Server
```bash
npm run dev
```

### Step 7: Test
```bash
curl http://localhost:3000/api/test-sanity
```

## Summary
1. ✅ Name: "Blog Content Generator"
2. ✅ Permissions: **Editor** (change from Viewer!)
3. ✅ Save
4. ✅ Copy token
5. ✅ Update .env.local
6. ✅ Restart server

