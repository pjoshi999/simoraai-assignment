# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ✅ Issue 1: Zod Module Not Found
**Error:**
```
ERROR in ./node_modules/zod/lib/index.js
Module build failed: Error: ENOENT: no such file or directory
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Why:** Version conflict between Remotion and OpenAI packages. Using `--legacy-peer-deps` resolves this.

---

### ✅ Issue 2: Video Playback Error (MEDIA_ELEMENT_ERROR)
**Error:**
```
The browser threw an error while playing the video: Code 4 - MEDIA_ELEMENT_ERROR
```

**Cause:** Missing or invalid video file path.

**Solution:**
1. Make sure you've uploaded a video first
2. The default composition uses empty videoUrl (which is fine for Remotion Studio)
3. For the main app, always upload a video before generating captions

**Prevention:** The code now handles empty videoUrl gracefully with a placeholder message.

---

### ✅ Issue 3: Port Already in Use
**Error:**
```
Port 3000 is in use by process XXXXX
```

**Solution:**
Next.js automatically uses the next available port (e.g., 3001, 3002).
Or kill the existing process:
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port explicitly
npm run dev -- -p 3001
```

---

### ✅ Issue 4: OpenAI API Key Not Configured
**Error:**
```
OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.
```

**Solution:**
1. Create `.env.local` file in project root
2. Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
3. Restart the dev server: `npm run dev`

**Get API Key:** https://platform.openai.com/api-keys

---

### ✅ Issue 5: Build Fails with TypeScript Errors
**Error:**
```
Failed to compile.
Type error: Cannot find module...
```

**Solution:**
```bash
# Clean build
rm -rf .next
npm run build -- --webpack
```

**If still fails:** Check import paths are correct relative to file location.

---

### ✅ Issue 6: File Upload Returns 500 Error
**Error:**
```
Failed to upload video
```

**Solutions:**
1. **Check file size:** Keep under 100MB for serverless
2. **Check file type:** Must be video/mp4
3. **Check directory:** Ensure `public/uploads/` exists
   ```bash
   mkdir -p public/uploads
   ```
4. **Check permissions:** Ensure write access
   ```bash
   chmod -R 755 public/uploads
   ```

---

### ✅ Issue 7: Captions Not Generating
**Error:**
```
Failed to generate captions
Caption generation error: Error: Connection error (ECONNRESET)
```

**Solutions:**
1. **API Key:** Verify OpenAI API key is correct and active
2. **Credits:** Check OpenAI account has sufficient credits
3. **Video Audio:** Ensure video has audio track
4. **File Path:** Video must be uploaded first
5. **Network:** Check internet connection is stable
6. **Video Size:** Try with a smaller/shorter video (< 25MB, < 2 minutes)
7. **API Status:** Check OpenAI API status at https://status.openai.com
8. **Retry:** Wait a moment and try again (API has auto-retry built in)

**Recent Fix:**
- Changed from file stream to File object for better compatibility
- Added timeout (2 minutes) and retry logic (2 retries)
- Improved error messages for connection issues

---

### ✅ Issue 8: Preview Player Not Loading
**Symptoms:**
- Black screen
- Spinner forever
- No video/captions

**Solutions:**
1. **Upload video first:** Preview needs a video URL
2. **Generate captions:** Click "Auto-generate Captions"
3. **Check browser console:** Look for errors
4. **Refresh page:** Sometimes helps
5. **Check video format:** Must be browser-compatible MP4

---

### ✅ Issue 9: Hinglish Text Not Rendering
**Symptoms:**
- Hindi characters show as boxes
- Mixed text looks wrong

**Solutions:**
1. **Fonts loading:** Check browser console for font errors
2. **Internet connection:** Fonts load from Google Fonts CDN
3. **Browser support:** Use modern browser (Chrome, Firefox, Safari, Edge)
4. **Font fallback:** Code includes fallback fonts

---

### ✅ Issue 10: Deployment Fails on Vercel
**Error:**
```
Build error occurred
```

**Solutions:**
1. **Environment variables:** Add `OPENAI_API_KEY` in Vercel dashboard
2. **Build command:** Ensure it's `next build` (should be auto-detected)
3. **Node version:** Vercel should use Node 20+ automatically
4. **Install command:** May need `npm install --legacy-peer-deps`
5. **Check logs:** View build logs in Vercel dashboard

**Vercel Config:**
Add to `package.json`:
```json
"engines": {
  "node": ">=20.0.0"
}
```

---

## Quick Fixes

### Reset Everything
```bash
# Clean slate
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
npm run build -- --webpack
npm run dev
```

### Check If Server Is Running
```bash
# macOS/Linux
lsof -i :3000

# Or check process
ps aux | grep next
```

### View Full Logs
```bash
# Development
npm run dev 2>&1 | tee dev.log

# Build
npm run build 2>&1 | tee build.log
```

### Test API Endpoints
```bash
# Upload test (replace with your video)
curl -X POST http://localhost:3000/api/upload \
  -F "video=@test.mp4"

# Caption generation test
curl -X POST http://localhost:3000/api/captions/generate \
  -H "Content-Type: application/json" \
  -d '{"videoPath":"/uploads/your-video.mp4"}'
```

---

## Performance Issues

### Slow Caption Generation
**Causes:**
- Large video file
- Long video duration
- OpenAI API response time

**Solutions:**
- Use shorter videos for testing
- Compress videos before upload
- Be patient (1-2 minutes for 10-minute video is normal)

### Slow Preview Loading
**Causes:**
- Large video file
- Many captions
- Browser performance

**Solutions:**
- Optimize video file size
- Use modern browser
- Close other tabs
- Check system resources

---

## Development Tips

### Hot Reload Not Working
```bash
# Restart dev server
pkill -f "next dev"
npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
```

### Check Environment Variables
```bash
# Print environment variables (be careful not to expose secrets)
node -e "console.log(process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET')"
```

### Test Without Frontend
Use Remotion Studio:
```bash
npm run remotion
```

---

## Getting Help

### Check Documentation
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup
- `SETUP.md` - Deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step verification

### Check Logs
1. **Browser Console:** Press F12 or Cmd+Option+I
2. **Server Logs:** Terminal where `npm run dev` is running
3. **Network Tab:** Check API requests/responses

### Community Resources
- [Remotion Discord](https://remotion.dev/discord)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [OpenAI Community](https://community.openai.com)

### Contact
**Email:** joshi.priyanshu999@gmail.com

---

## Preventive Measures

### Before Starting Development
- [ ] Node.js 20+ installed
- [ ] Valid OpenAI API key obtained
- [ ] Git installed (for version control)
- [ ] Modern browser installed

### Before Deployment
- [ ] All tests pass locally
- [ ] Production build succeeds
- [ ] Environment variables documented
- [ ] README updated with live URL

### Regular Maintenance
- Update dependencies: `npm update`
- Check security: `npm audit`
- Monitor API usage: OpenAI dashboard
- Backup important videos/captions

---

## Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| ENOENT | File not found | Check file path |
| EPERM | Permission denied | Check file permissions |
| 400 | Bad request | Check API parameters |
| 401 | Unauthorized | Check API key |
| 404 | Not found | Check endpoint URL |
| 413 | Payload too large | Reduce file size |
| 500 | Server error | Check server logs |

---

**Last Updated:** November 16, 2025  
**Version:** 1.0.0

---

💡 **Tip:** Most issues are solved by reinstalling dependencies with `--legacy-peer-deps` flag!

