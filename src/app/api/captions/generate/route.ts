import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";
import path from "path";
import { existsSync } from "fs";
import type { CaptionSegmentType } from "../../../../../types/caption";

export const maxDuration = 300; // 5 minutes max for serverless function
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { videoPath } = await req.json();

    if (!videoPath) {
      return NextResponse.json(
        { error: "No video path provided" },
        { status: 400 }
      );
    }

    // Check for AssemblyAI API key
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AssemblyAI API key not configured. Please set ASSEMBLYAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // Initialize AssemblyAI client
    const client = new AssemblyAI({
      apiKey: apiKey,
    });

    // Get absolute path to video file
    const absolutePath = path.join(process.cwd(), "public", videoPath);

    if (!existsSync(absolutePath)) {
      return NextResponse.json(
        { error: "Video file not found at path: " + videoPath },
        { status: 404 }
      );
    }

    console.log("Uploading video to AssemblyAI:", absolutePath);

    // Upload the file to AssemblyAI
    const uploadUrl = await client.files.upload(absolutePath);

    console.log("Creating transcription job...");

    // Create transcription with word-level timestamps
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      language_detection: true, // Auto-detect language (supports Hinglish)
      word_boost: [], // Can add custom vocabulary here
      format_text: true, // Format text with punctuation
    });

    if (transcript.status === "error") {
      throw new Error(transcript.error || "Transcription failed");
    }

    console.log("Transcription completed, processing words...");

    // Get word-level details
    const words = transcript.words || [];
    
    if (words.length === 0) {
      return NextResponse.json(
        { error: "No speech detected in the video. Please ensure the video has audio." },
        { status: 400 }
      );
    }

    // Group words into caption segments (approximately 5-10 words per segment)
    const captions: CaptionSegmentType[] = [];
    const wordsPerSegment = 8;
    
    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const segmentWords = words.slice(i, i + wordsPerSegment);
      
      if (segmentWords.length === 0) continue;
      
      const captionSegment: CaptionSegmentType = {
        text: segmentWords.map((w: any) => w.text).join(" "),
        start: segmentWords[0].start / 1000, // Convert ms to seconds
        end: segmentWords[segmentWords.length - 1].end / 1000,
        words: segmentWords.map((w: any) => ({
          word: w.text,
          start: w.start / 1000,
          end: w.end / 1000,
        })),
      };
      
      captions.push(captionSegment);
    }

    console.log(`Generated ${captions.length} caption segments`);

    // Calculate total duration
    const duration = words[words.length - 1]?.end / 1000 || 0;

    return NextResponse.json({
      success: true,
      captions,
      language: transcript.language_code || "auto-detected",
      duration: duration,
      confidence: transcript.confidence,
    });
  } catch (error: any) {
    console.error("Caption generation error:", error);
    
    // Handle specific AssemblyAI errors
    if (error?.response?.status === 401) {
      return NextResponse.json(
        { error: "Invalid AssemblyAI API key. Please check your API key." },
        { status: 401 }
      );
    }

    if (error?.response?.status === 429) {
      return NextResponse.json(
        { error: "AssemblyAI rate limit exceeded. Please wait and try again." },
        { status: 429 }
      );
    }

    // Handle connection errors
    if (error?.code === "ECONNRESET" || error?.type === "system") {
      return NextResponse.json(
        { 
          error: "Connection to AssemblyAI API failed. Please check your internet connection and try again.",
          details: "Network timeout or connection reset"
        },
        { status: 503 }
      );
    }

    // Handle timeout errors
    if (error?.message?.includes("timeout")) {
      return NextResponse.json(
        { 
          error: "Request timeout. Video file might be too large. Try with a shorter video.",
          details: error.message
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { 
        error: error?.message || "Failed to generate captions",
        details: "Check server logs for more information"
      },
      { status: 500 }
    );
  }
}
