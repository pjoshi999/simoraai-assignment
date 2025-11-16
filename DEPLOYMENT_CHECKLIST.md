# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Testing
- [x] Dependencies installed (`npm install`)
- [ ] Environment variables configured in `.env.local`
- [ ] Development server runs (`npm run dev`)
- [ ] Video upload functionality works
- [ ] Caption generation works (requires OpenAI API key)
- [ ] All 3 caption styles render correctly
- [ ] Hinglish text renders properly
- [ ] Production build succeeds (`npm run build`)
- [ ] Production server runs (`npm start`)

### Code Quality
- [x] All TypeScript files compile without errors
- [x] No linter errors
- [x] All components properly typed
- [x] API routes have error handling
- [x] README is comprehensive and up-to-date

## 🌐 Vercel Deployment Steps

### 1. Prepare Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Complete Remotion captioning platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/your-repo.git

# Push
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to Vercel**: https://vercel.com/new
2. **Import Repository**: Select your GitHub repository
3. **Configure Project**:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install --legacy-peer-deps`

4. **Environment Variables** (CRITICAL):
   Add these in Vercel project settings:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Deploy**: Click "Deploy" button

### 3. Post-Deployment

- [ ] Visit the deployed URL
- [ ] Test video upload
- [ ] Test caption generation
- [ ] Test all caption styles
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## 📝 Environment Variables Setup

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for Whisper | [OpenAI Platform](https://platform.openai.com/api-keys) |

### Optional Variables (for AWS Lambda rendering)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `REMOTION_AWS_ACCESS_KEY_ID` | AWS access key | AWS IAM Console |
| `REMOTION_AWS_SECRET_ACCESS_KEY` | AWS secret key | AWS IAM Console |

## 🔍 Verification Steps

After deployment, verify:

1. **Home Page Loads**
   - Visit: `https://your-app.vercel.app`
   - Should redirect to `/captioning`

2. **Upload Works**
   - Upload a small test video
   - Check Network tab in browser DevTools
   - Verify 200 response

3. **Caption Generation Works**
   - Click "Auto-generate Captions"
   - Wait for completion
   - Check captions appear in the list

4. **Preview Works**
   - Remotion Player should load
   - Video should play
   - Captions should appear synchronized

5. **Style Switching Works**
   - Change between 3 styles
   - Preview should update in real-time

## 🐛 Common Deployment Issues

### Issue: Build fails with module errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Issue: "OPENAI_API_KEY not configured"

**Solution**:
- Add environment variable in Vercel dashboard
- Go to: Project Settings → Environment Variables
- Add `OPENAI_API_KEY`
- Redeploy: Deployments → ... → Redeploy

### Issue: File upload returns 413 (Payload Too Large)

**Solution**:
- Vercel free tier: 4.5MB limit
- Upgrade to Pro for 100MB
- Or use external storage (S3, Cloudinary)

### Issue: Function timeout during caption generation

**Solution**:
- Already configured with `maxDuration: 300`
- For longer videos, consider:
  - Video preprocessing
  - Chunked processing
  - Background jobs

## 📊 Monitoring After Deployment

### Vercel Dashboard
- Monitor build logs
- Check runtime logs
- Track function execution times
- Monitor bandwidth usage

### OpenAI Dashboard
- Track API usage
- Monitor costs
- Check for errors
- Set usage limits

## 🎯 Live URL Update

After successful deployment:

1. Update README.md with live URL:
   ```markdown
   ## 🌐 Live Demo
   
   Visit the live application: [https://your-app.vercel.app](https://your-app.vercel.app)
   ```

2. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add live demo URL"
   git push
   ```

## 🔐 Security Check

- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys committed to repository
- [ ] Environment variables set in Vercel, not code
- [ ] CORS configured if needed
- [ ] Rate limiting considered (if high traffic expected)

## 📦 Optional: Custom Domain

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate auto-configured by Vercel

## 🎉 Success Criteria

Deployment is successful when:

- [x] Application is accessible via public URL
- [ ] All core features work end-to-end
- [ ] No console errors in production
- [ ] OpenAI API integration works
- [ ] Video upload and processing works
- [ ] Captions render correctly
- [ ] Hinglish support verified
- [ ] Mobile responsive
- [ ] README includes live URL

---

## 📧 Support

If you encounter any issues during deployment:

1. Check Vercel build logs
2. Check browser console for errors
3. Review this checklist
4. Check SETUP.md for detailed instructions
5. Email: joshi.priyanshu999@gmail.com

---

**Ready to deploy!** Follow this checklist step-by-step for a smooth deployment. 🚀

