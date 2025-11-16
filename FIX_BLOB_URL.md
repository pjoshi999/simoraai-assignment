# 🔧 Fix: Blob URL vs Server Path Issue

## Problem
**Error:** `Video file not found at path: blob:http://localhost:3000/...`

When uploading a video, the application was trying to generate captions using a blob URL (local browser object URL) instead of the server file path.

---

## Root Cause

The flow was:
1. User selects video → Creates blob URL for preview
2. User clicks "Auto-generate Captions" → Sends blob URL to API
3. API tries to find file at blob URL path → **FAILS** (blob URLs don't exist on server)

**Issue:** Frontend was using the local blob URL for both preview AND API calls, but the API needs the server file path.

---

## Solution

### Changes Made

**File:** `src/app/captioning/page.tsx`

1. **Separated Preview URL from Server Path:**
   ```typescript
   const [videoUrl, setVideoUrl] = useState<string>("");              // Blob URL for preview
   const [uploadedVideoPath, setUploadedVideoPath] = useState<string>(""); // Server path
   ```

2. **Auto-Upload on File Selection:**
   - When user selects a file, it now automatically uploads to server
   - No need for manual "Upload Video" button
   - Better user experience

3. **Fixed Caption Generation:**
   ```typescript
   // OLD (broken)
   body: JSON.stringify({ videoPath: videoUrl }) // Sent blob URL ❌
   
   // NEW (fixed)
   body: JSON.stringify({ videoPath: uploadedVideoPath }) // Sends server path ✅
   ```

4. **Better UI Feedback:**
   - Shows "Uploading..." status during upload
   - Shows "✓ Uploaded" when complete
   - Caption button disabled until upload completes
   - Shows "Uploading Video..." on button during upload

---

## How It Works Now

### New Flow:

1. **User Selects Video**
   - Creates blob URL for immediate preview
   - **Automatically starts upload** to server
   - Shows "Uploading..." status

2. **Upload Completes**
   - Stores server path (`/uploads/timestamp-filename.mp4`)
   - Shows "✓ Uploaded" confirmation
   - Enables "Auto-generate Captions" button

3. **User Clicks "Auto-generate Captions"**
   - Sends **server path** to API (not blob URL)
   - API finds file successfully
   - Generates captions

---

## Code Changes

### State Variables
```typescript
// Added new state for server path
const [uploadedVideoPath, setUploadedVideoPath] = useState<string>("");
```

### File Selection Handler
```typescript
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // ... validation ...
    
    // Create blob URL for preview
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Auto-upload to server (NEW!)
    uploadFile(file);
  }
};
```

### Upload Function
```typescript
const uploadFile = async (file: File) => {
  setIsUploading(true);
  
  // ... upload logic ...
  
  setUploadedVideoPath(data.videoUrl); // Store server path ✅
  setSuccessMessage("Video uploaded successfully! You can now generate captions.");
};
```

### Caption Generation
```typescript
const handleGenerateCaptions = async () => {
  // Check for server path, not blob URL
  if (!uploadedVideoPath) {
    setError("Please wait for video upload to complete first");
    return;
  }
  
  // Use server path for API call
  body: JSON.stringify({ videoPath: uploadedVideoPath })
};
```

### UI Updates
```typescript
// Upload status in upload area
{isUploading && (
  <p className="text-blue-400 mt-2 text-sm">Uploading...</p>
)}
{uploadedVideoPath && !isUploading && (
  <p className="text-green-400 mt-2 text-sm">✓ Uploaded</p>
)}

// Caption button disabled until upload completes
<button
  disabled={isGenerating || isUploading || !uploadedVideoPath}
  // ...
>
```

---

## Benefits

### User Experience
✅ **Simpler:** No manual upload button needed  
✅ **Clearer:** Shows upload progress  
✅ **Safer:** Can't try to generate captions before upload completes  
✅ **Faster:** Upload starts immediately on file selection  

### Technical
✅ **Correct:** Uses proper server paths for API calls  
✅ **Reliable:** No more "file not found" errors  
✅ **Maintainable:** Clear separation of preview vs server paths  

---

## Testing

### Test the Fix:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Select a video:**
   - Click upload area
   - Choose any .mp4 file
   - Should see "Uploading..." immediately

3. **Wait for upload:**
   - Should see "✓ Uploaded" when complete
   - Caption button should become enabled

4. **Generate captions:**
   - Click "Auto-generate Captions"
   - Should work without "file not found" error
   - Check terminal for: "Reading video file: /path/to/file.mp4"

---

## What If It Still Fails?

### Check These:

1. **Upload completes:**
   - Must see "✓ Uploaded" before generating captions
   - Check `public/uploads/` folder for file

2. **File permissions:**
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

3. **File size:**
   - Keep under 100MB for serverless
   - Use shorter videos for testing

4. **OpenAI API key:**
   - Must be set in `.env.local`
   - Must have credits

---

## Summary

### Problem
❌ Blob URL sent to API → File not found

### Solution
✅ Auto-upload on selection  
✅ Store separate server path  
✅ Use server path for API calls  
✅ Better UI feedback  

### Result
✅ **Caption generation works reliably**  
✅ **Better user experience**  
✅ **No more "file not found" errors**

---

**Status:** ✅ **FIXED**  
**Date:** November 16, 2025  
**Version:** 1.0.2

