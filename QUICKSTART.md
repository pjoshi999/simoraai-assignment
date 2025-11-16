# ⚡ Quick Start Guide

Get the Remotion Captioning Platform running in **5 minutes**!

## Step 1: Install Dependencies (1 minute)

```bash
npm install --legacy-peer-deps
```

## Step 2: Set Up Environment Variables (2 minutes)

Create a file named `.env.local` in the root directory:

```bash
# Copy this content to .env.local

# Required: OpenAI API Key for Whisper transcription
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: AWS credentials (for Lambda rendering)
# REMOTION_AWS_ACCESS_KEY_ID=your_aws_key
# REMOTION_AWS_SECRET_ACCESS_KEY=your_aws_secret
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and paste it above

## Step 3: Run Development Server (1 minute)

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Step 4: Test the Application (1 minute)

1. **Upload a Video**:
   - Click the upload area
   - Select any .mp4 video file (keep it short, 10-30 seconds for testing)
   - Click "Upload Video"

2. **Generate Captions**:
   - Click "Auto-generate Captions (OpenAI Whisper)"
   - Wait for processing (usually takes a few seconds)
   - Captions will appear in the segments panel

3. **Preview with Different Styles**:
   - Select "Bottom Centered" style
   - Select "Top Bar" style
   - Select "Karaoke" style
   - Watch the preview update in real-time

## 🎯 That's it! You're ready to go!

---

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Open Remotion Studio
npm run remotion

# Render video (CLI)
npx remotion render VideoWithCaptions output.mp4
```

---

## Need Help?

- **No OpenAI API Key?** Get one free at https://platform.openai.com
- **Build errors?** Run `rm -rf node_modules && npm install --legacy-peer-deps`
- **Video upload fails?** Check file size (keep under 100MB)
- **Captions not generating?** Verify API key in `.env.local`

For detailed documentation, see **README.md**.

---

## Next Steps

1. ✅ Application running locally
2. 📖 Read SETUP.md for deployment
3. 🚀 Deploy to Vercel (see DEPLOYMENT_CHECKLIST.md)
4. 🎉 Share your live URL!

**Happy captioning!** 🎬

