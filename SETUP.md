# 🚀 Deployment & Setup Guide

## Quick Setup (5 minutes)

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for AWS Lambda rendering)
REMOTION_AWS_ACCESS_KEY_ID=your_aws_access_key_id
REMOTION_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📦 Vercel Deployment (Recommended)

### Prerequisites
- GitHub repository
- Vercel account (free)
- OpenAI API key

### Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   In Vercel project settings, add:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - (Optional) AWS credentials for Lambda rendering

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a live URL: `https://your-app.vercel.app`

### Important Vercel Settings

- **Node.js Version**: 20.x (auto-detected)
- **Build Command**: `next build` (auto-configured)
- **Output Directory**: `.next` (auto-configured)
- **Install Command**: `npm install` (auto-configured)

---

## 🌐 Other Deployment Options

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables in Render dashboard
5. Deploy

### Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Railway auto-detects Next.js
4. Add environment variables
5. Deploy automatically

### Deploy to Netlify

1. Install Next.js plugin:
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```
2. Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
3. Connect to Netlify and deploy

---

## 🔑 Getting OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (you won't see it again!)
6. Add to `.env.local` or hosting platform

**Pricing**: 
- Whisper API: $0.006 per minute of audio
- Example: 1 hour of video = $0.36

---

## 📊 Testing Before Deployment

### Test Locally

1. **Upload Test**:
   - Upload a short video (10-30 seconds)
   - Verify it appears in `public/uploads/`

2. **Caption Generation**:
   - Click "Auto-generate Captions"
   - Check browser console for errors
   - Verify captions appear

3. **Preview**:
   - Change caption styles
   - Verify preview updates
   - Check Hinglish rendering

4. **Build Test**:
   ```bash
   npm run build
   npm start
   ```
   - Ensure production build works
   - Test all features in production mode

---

## 🐛 Deployment Troubleshooting

### Issue: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment variables not working

**Solution**:
- Vercel: Add in project settings, not in code
- Ensure no spaces around `=` in `.env.local`
- Restart dev server after adding variables

### Issue: File upload fails in production

**Solution**:
- Vercel has a 4.5MB file size limit for serverless
- For larger files, use:
  - Vercel Blob Storage
  - AWS S3
  - Cloudinary

### Issue: Build timeout on Vercel

**Solution**:
- Upgrade to Vercel Pro (longer build times)
- Optimize dependencies
- Use `output: 'standalone'` in `next.config.js`

### Issue: Render fails with "OPENAI_API_KEY not configured"

**Solution**:
- API routes need explicit `maxDuration` export
- Already configured in the code
- Ensure environment variable is set in hosting platform

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] OpenAI API key tested and working
- [ ] Video upload working
- [ ] Caption generation working
- [ ] All 3 caption styles working
- [ ] Hinglish text rendering correctly
- [ ] Preview player working
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in production
- [ ] README updated with live URL
- [ ] GitHub repository is public/accessible

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in .gitignore
2. **Use environment variables** - For all sensitive data
3. **Rotate API keys regularly** - Especially if exposed
4. **Limit API key permissions** - OpenAI allows restrictions
5. **Monitor usage** - Check OpenAI dashboard for unexpected usage

---

## 📈 Scaling Considerations

### For Production Use

1. **File Storage**:
   - Use cloud storage (S3, Cloudinary)
   - Clean up old uploads automatically

2. **Database**:
   - Store caption data in DB (PostgreSQL, MongoDB)
   - Track user sessions and render history

3. **Queue System**:
   - Use job queue for long renders (Bull, BullMQ)
   - Background processing for large files

4. **CDN**:
   - Serve rendered videos via CDN
   - Use Vercel Edge Network

5. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API usage and costs

---

## 🎥 Sample Video for Testing

Download a sample Hinglish video for testing:
- Use any YouTube video with mixed Hindi/English
- Keep it short (30 seconds) for quick testing
- Ensure clear audio for best results

---

## 📧 Support

For deployment issues:
- Check Vercel/hosting platform logs
- Review browser console errors
- Email: joshi.priyanshu999@gmail.com

---

**Ready to Deploy!** 🚀

Follow this guide step-by-step, and you'll have your app live in minutes.

