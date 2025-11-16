# 🎬 Remotion Captioning Platform

A full-stack web application that allows users to upload MP4 videos, automatically generate captions using OpenAI Whisper API, and render those captions onto videos using Remotion with **Hinglish (Hindi + English) support**.

![Remotion Captioning Platform](https://img.shields.io/badge/Built%20with-Remotion-blue) ![Next.js](https://img.shields.io/badge/Next.js-16.0-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

---

## 🌟 Features

### ✅ Core Features

- **Video Upload**: Clean, drag-and-drop style UI for uploading .mp4 files
- **Auto-Caption Generation**: Uses AssemblyAI API for speech-to-text with word-level timestamps
- **Hinglish Support**: Properly renders mixed Hindi (Devanagari) and English text using `Noto Sans` and `Noto Sans Devanagari` fonts
- **3 Caption Style Presets**:
  1. **Bottom Centered**: Classic subtitle style at the bottom of the video
  2. **Top Bar**: News-style banner at the top
  3. **Karaoke**: Word-by-word highlighting effect with golden color
- **Real-time Preview**: Live preview using Remotion Player with caption overlay
- **Export Options**: 
  - Local rendering via CLI
  - Cloud rendering via AWS Lambda (optional)
- **Fully Deployed**: Hosted on Vercel with complete backend integration

### 🎨 Additional Features

- Modern, responsive UI with gradient backgrounds and smooth animations
- Real-time caption editing and preview updates
- Word-level timestamp support for karaoke effect
- Detailed caption segments display with timestamps
- Error handling and user feedback

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Caption Styles](#-caption-styles)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Sample Videos](#-sample-videos)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **OpenAI Whisper API** - Speech-to-text transcription
- **Remotion 4.0** - Programmatic video generation

### Video Processing
- **Remotion Player** - Real-time video preview
- **Remotion Renderer** - Video export
- **Remotion Lambda** - Cloud rendering (optional)

---

## 📦 Prerequisites

- **Node.js**: v20.x or higher (LTS recommended)
- **npm** or **yarn**: Latest version
- **AssemblyAI API Key**: For speech-to-text transcription ([Get one here](https://www.assemblyai.com/))
- **(Optional) AWS Account**: For Lambda rendering

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd simoraai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```

---

## 🔑 Environment Variables

Add the following to your `.env.local` file:

```env
# Required: AssemblyAI API Key for speech-to-text transcription
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Optional: AWS Credentials for Lambda rendering
REMOTION_AWS_ACCESS_KEY_ID=your_aws_access_key_id
REMOTION_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

### Getting AssemblyAI API Key

1. Go to [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for a free account (5 hours free monthly)
3. Navigate to your dashboard
4. Copy your API key from the API Keys section
5. Paste it into `.env.local`

**Note**: AssemblyAI offers a generous free tier of 5 hours per month, perfect for development and testing. Pricing: $0.00025 per minute (96% cheaper than alternatives!).

---

## 💻 Running Locally

### Development Mode

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Production Build

Build and start the production server:

```bash
npm run build
npm start
```

### Remotion Studio (for development)

Open Remotion Studio to preview compositions:

```bash
npm run remotion
```

---

## 📁 Project Structure

```
simoraai/
├── public/
│   ├── uploads/          # Uploaded videos stored here
│   └── rendered/         # Rendered videos with captions
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/              # Video upload endpoint
│   │   │   ├── captions/generate/   # Caption generation endpoint
│   │   │   ├── render/local/        # Local rendering endpoint
│   │   │   └── lambda/              # AWS Lambda rendering
│   │   ├── captioning/              # Main captioning UI page
│   │   └── page.tsx                 # Home page (redirects)
│   ├── components/       # Reusable UI components
│   ├── remotion/
│   │   ├── CaptionStyles/
│   │   │   ├── BottomCentered.tsx   # Bottom caption style
│   │   │   ├── TopBar.tsx           # Top bar caption style
│   │   │   └── Karaoke.tsx          # Karaoke caption style
│   │   ├── VideoWithCaptions/
│   │   │   └── VideoWithCaptions.tsx # Main video composition
│   │   └── Root.tsx                 # Remotion compositions registry
│   └── types/
│       ├── caption.ts               # Caption type definitions
│       └── constants.ts             # App constants
├── package.json
├── next.config.js
├── remotion.config.ts
└── README.md
```

---

## 🔌 API Endpoints

### 1. Upload Video
**POST** `/api/upload`

Upload an MP4 video file.

**Request**: `multipart/form-data`
```typescript
FormData {
  video: File
}
```

**Response**:
```json
{
  "success": true,
  "videoUrl": "/uploads/1234567890-video.mp4",
  "filename": "1234567890-video.mp4"
}
```

### 2. Generate Captions
**POST** `/api/captions/generate`

Generate captions using OpenAI Whisper API.

**Request**:
```json
{
  "videoPath": "/uploads/1234567890-video.mp4"
}
```

**Response**:
```json
{
  "success": true,
  "captions": [
    {
      "text": "Hello world",
      "start": 0.0,
      "end": 2.5,
      "words": [
        { "word": "Hello", "start": 0.0, "end": 1.0 },
        { "word": "world", "start": 1.5, "end": 2.5 }
      ]
    }
  ],
  "language": "en",
  "duration": 60.5
}
```

### 3. Render Video (Local)
**POST** `/api/render/local`

Render video with captions locally.

**Request**:
```json
{
  "compositionId": "VideoWithCaptions",
  "inputProps": {
    "videoUrl": "/uploads/video.mp4",
    "captions": [...],
    "style": "bottom-centered"
  },
  "outputFileName": "output.mp4"
}
```

**Response**:
```json
{
  "success": true,
  "videoUrl": "/rendered/output.mp4",
  "message": "Video rendered successfully"
}
```

---

## 🎨 Caption Styles

### 1. Bottom Centered
Classic subtitle style positioned at the bottom center of the video.

**Features**:
- Black semi-transparent background
- White text with shadow
- Fade in/out animations
- 80% max width

**Best for**: Standard subtitles, movies, tutorials

### 2. Top Bar
News-style banner at the top of the video.

**Features**:
- Full-width black banner
- Uppercase text with letter spacing
- Bold and prominent
- No rounded corners

**Best for**: News broadcasts, announcements, breaking news style

### 3. Karaoke
Word-by-word highlighting effect.

**Features**:
- Golden color (#FFD700) for active words
- Glow effect on highlighted words
- Word-level timestamp support
- Scale animation on active word

**Best for**: Music videos, sing-along content, educational videos

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure environment variables in Vercel dashboard

3. **Environment Variables in Vercel**:
   - Add `OPENAI_API_KEY` in Vercel project settings
   - (Optional) Add AWS credentials for Lambda rendering

4. **Deploy**:
   Vercel will automatically deploy your application.

### Deploy to Other Platforms

The application can also be deployed to:
- **Render**: Node.js web service
- **Railway**: Full-stack deployment
- **Netlify**: With Next.js support

**Note**: Ensure your hosting platform supports:
- Node.js 20+
- Next.js 16+
- File uploads (for video storage)

---

## 📖 Usage Guide

### Step 1: Upload Video

1. Click on the upload area or drag and drop an MP4 file
2. Click "Upload Video" button
3. Wait for the upload to complete

### Step 2: Generate Captions

1. Click "Auto-generate Captions" button
2. Wait for OpenAI Whisper to transcribe the audio
3. Captions will appear in the segments panel

**Note**: 
- Whisper automatically detects language (including Hinglish)
- Word-level timestamps are generated for karaoke effect
- Generation time depends on video length (~1 minute per 10 minutes of video)

### Step 3: Choose Caption Style

Select one of the three caption styles:
- **Bottom Centered**: Classic subtitles
- **Top Bar**: News-style banner
- **Karaoke**: Word highlighting

The preview updates in real-time.

### Step 4: Preview

- Use the Remotion Player controls to play/pause
- Scrub through the timeline to check different parts
- Captions will appear synchronized with the video

### Step 5: Export

**Option A: CLI Render (Local)**
```bash
npx remotion render VideoWithCaptions output.mp4
```

**Option B: Cloud Render (AWS Lambda)**
- Configure AWS credentials in `.env.local`
- Deploy Lambda function: `npm run deploy`
- Use the render endpoint

---

## 🎥 Sample Videos

### Included Sample

A sample captioned video is available in the `out/` directory for reference.

### Testing with Your Own Videos

Recommended test videos:
- **Short clips** (10-30 seconds) for quick testing
- **Hinglish content** to test mixed language support
- **Clear audio** for best transcription results

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "OpenAI API key not configured"

**Solution**: 
- Ensure `.env.local` file exists
- Check that `OPENAI_API_KEY` is set
- Restart the development server after adding environment variables

#### 2. Video upload fails

**Solution**:
- Check file size (keep under 100MB for serverless)
- Ensure file is a valid MP4 video
- Check `public/uploads/` directory exists and is writable

#### 3. Captions not appearing

**Solution**:
- Verify video has audio
- Check browser console for errors
- Ensure fonts are loading (Noto Sans, Noto Sans Devanagari)

#### 4. Hinglish text not rendering properly

**Solution**:
- Fonts are loaded automatically via `@remotion/google-fonts`
- Ensure internet connection for font CDN
- Check browser font rendering settings

#### 5. Render timeout

**Solution**:
- For long videos, increase `maxDuration` in API routes
- Use AWS Lambda for longer renders
- Split video into smaller segments

### Performance Tips

- **Optimize video size**: Compress videos before upload
- **Limit caption length**: Break long sentences into shorter segments
- **Use appropriate style**: Karaoke effect is more resource-intensive

---

## 🎯 Caption Generation Method

### Technology: AssemblyAI API

**Why AssemblyAI?**
- State-of-the-art speech recognition
- Multi-language support with excellent Hinglish handling
- Automatic language detection
- Word-level timestamps built-in
- Automatic punctuation and formatting
- 96% cheaper than alternatives
- 5 hours free monthly
- Faster processing (2-3x quicker)
- More stable connections

### Integration Details

1. **API Call**: Video uploaded to AssemblyAI, audio automatically extracted
2. **Response Format**: JSON with word-level timestamps and confidence scores
3. **Processing**: Words grouped into optimal caption segments (8 words each)
4. **Storage**: Captions stored in-memory and can be edited

### Pricing

- **Free Tier**: 5 hours per month
- **Pay-as-you-go**: $0.00025 per minute
- **Example**: 1 hour of video = $0.015 (vs $0.36 with alternatives)

### Alternative Options

The architecture supports swapping caption providers:
- **OpenAI Whisper**: Premium alternative with similar features
- **Google Cloud Speech-to-Text**: Enterprise-grade option
- **Azure Speech Services**: Microsoft's speech API
- **Local Whisper**: Use `whisper.cpp` for offline processing

To switch providers, modify `/src/app/api/captions/generate/route.ts`.

---

## 👨‍💻 Development

### Adding New Caption Styles

1. Create a new component in `src/remotion/CaptionStyles/`
2. Follow the pattern of existing styles
3. Add the style to the switch statement in `VideoWithCaptions.tsx`
4. Update the `CaptionStyle` enum in `types/caption.ts`

### Customizing Fonts

To add more fonts:

```typescript
import { loadFont } from "@remotion/google-fonts/YourFont";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
```

---

## 📄 License

This project uses Remotion, which requires a company license for certain entities. 
[Read the Remotion license terms](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

---

## 🙏 Acknowledgments

- **Remotion** - Programmatic video generation
- **OpenAI** - Whisper speech-to-text API
- **Vercel** - Hosting platform
- **Next.js** - React framework

---

## 📧 Support

For questions or issues:
- Email: joshi.priyanshu999@gmail.com
- Check the [Remotion Discord](https://remotion.dev/discord)
- Open an issue on GitHub

---

## 🚀 Future Enhancements

- [ ] Import/export SRT/VTT caption files
- [ ] Manual caption editing UI
- [ ] More caption style presets
- [ ] Batch video processing
- [ ] Caption translation
- [ ] Custom font selection
- [ ] Animation customization
- [ ] Cloud storage integration (S3, etc.)

---

**Built with ❤️ by Priyanshu Joshi**

**Version**: 1.0.0  
**Last Updated**: November 2025
