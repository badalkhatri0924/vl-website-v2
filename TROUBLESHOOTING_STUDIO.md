# Troubleshooting: Create Button Not Showing in Sanity Studio

## Quick Fixes to Try:

### 1. Use the "+" Button in the Top Header
The "+" button appears in **TWO places**:
- **Top Header Bar**: Look at the very top of Sanity Studio, next to the search icon in the header. Click that "+" button and select "Post" from the dropdown menu.
- **Document List**: Should appear next to "Q Search list" in the Posts panel (but if it's missing, use the header button)

### 2. Clear Browser Cache and Restart
```bash
# Stop your dev server (Ctrl+C)
rm -rf .next
npm run dev
```

Then in your browser:
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear cache: Chrome Settings > Privacy > Clear browsing data

### 3. Check Browser Console for Errors
1. Open DevTools: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. Go to the "Console" tab
3. Look for any red error messages
4. Share any errors you see

### 4. Verify You're Logged In
- Check the top-right corner of Sanity Studio
- You should see your user avatar/icon
- If you see "Login" instead, click it and authenticate

### 5. Try Creating via URL
You can also create a new post directly by going to:
```
http://localhost:3000/studio/structure/post;new
```

### 6. Check Network Tab
1. Open DevTools > Network tab
2. Refresh the Studio page
3. Look for any failed requests (red status codes)
4. Check if API calls to Sanity are successful

### 7. Alternative: Use Sanity CLI
If the Studio UI isn't working, you can also use the Sanity CLI:
```bash
npx sanity documents create
```

## If Still Not Working:

The issue might be:
1. **JavaScript Error**: Check browser console
2. **Network Issue**: API calls to Sanity might be blocked
3. **Browser Extension**: Try in incognito/private mode
4. **React 19 Compatibility**: There might be a rendering issue

Please check the browser console and share any errors you find!


