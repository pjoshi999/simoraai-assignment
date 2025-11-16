"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { Player } from "@remotion/player";
import type { CaptionSegmentType, CaptionStyleType } from "../../types/caption";
import {
  VIDEO_CAPTION_COMP_NAME,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { VideoWithCaptions } from "../remotion/VideoWithCaptions/VideoWithCaptions";
import { api } from "../lib/api";

export default function CaptioningPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploadedVideoPath, setUploadedVideoPath] = useState<string>("");
  const [captions, setCaptions] = useState<CaptionSegmentType[]>([]);
  const [captionStyle, setCaptionStyle] =
    useState<CaptionStyleType>("bottom-centered");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // handle video file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("video")) {
        toast.error("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      setCaptions([]);
      setUploadedVideoPath(""); // Reset uploaded path
      setVideoUrl(""); // Reset video URL

      // auto-upload the file to backend
      uploadFile(file);
    }
  };

  // handle video upload
  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      // Upload to Node.js backend
      const data = await api.uploadVideo(file);
      
      setUploadedVideoPath(data.videoUrl);

      // Update preview with backend video URL
      const backendVideoUrl = api.getVideoUrl(data.videoUrl);
      setVideoUrl(backendVideoUrl);

      toast.success(
        "Video uploaded successfully! You can now generate captions.",
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  // handle auto-caption generation
  const handleGenerateCaptions = async () => {
    if (!uploadedVideoPath) {
      toast.error("Please wait for video upload to complete first");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate captions from Node.js backend
      const data = await api.generateCaptions(uploadedVideoPath);

      setCaptions(data.captions);
      setVideoDuration(data.duration);
      toast.success(
        `Captions generated successfully! (${data.captions.length} segments, Language: ${data.language || "auto-detected"})`,
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to generate captions");
    } finally {
      setIsGenerating(false);
    }
  };

  const durationInFrames = useMemo(() => {
    if (videoDuration > 0) {
      return Math.ceil(videoDuration * VIDEO_FPS);
    }
    return 300; // default 10 seconds
  }, [videoDuration]);

  const inputProps = useMemo(() => {
    return {
      videoUrl: videoUrl || "",
      captions,
      style: captionStyle,
    };
  }, [videoUrl, captions, captionStyle]);

  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="bottom-right" richColors />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 py-3 bg-white bg-clip-text text-transparent">
            Remotion Captioning Platform
          </h1>
          <p className="text-gray-400 text-lg">
            Upload videos, auto-generate captions with Hinglish support, and
            render with stunning styles
          </p>
        </div>

        {/* main content grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* left column - upload & controls */}
          <div className="space-y-6">
            {/* upload section */}
            <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                Upload Video
              </h2>

              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-white transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-gray-400">
                    {videoFile
                      ? videoFile.name
                      : "Click to select video file (.mp4)"}
                  </p>
                  {isUploading && (
                    <p className="text-blue-400 mt-2 text-sm">Uploading...</p>
                  )}
                  {uploadedVideoPath && !isUploading && (
                    <p className="text-green-400 mt-2 text-sm">✓ Uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* caption generation */}
            {videoUrl && (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  Generate Captions
                </h2>

                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGenerating || isUploading || !uploadedVideoPath}
                  className="w-full bg-white disabled:bg-white text-black font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Uploading Video...
                    </span>
                  ) : isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating Captions..
                    </span>
                  ) : (
                    "Auto-generate Captions (AssemblyAI)"
                  )}
                </button>

                <p className="text-sm text-gray-400 mt-3 text-center">
                  Supports Hinglish (Hindi + English) with word-level timestamps
                </p>
              </div>
            )}

            {/* caption style selection */}
            {captions.length > 0 && (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  Caption Style
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      value: "bottom-centered",
                      label: "Bottom Centered",
                      desc: "Classic subtitle style",
                    },
                    {
                      value: "top-bar",
                      label: "Top Bar",
                      desc: "News-style banner",
                    },
                    {
                      value: "karaoke",
                      label: "Karaoke",
                      desc: "Word-by-word highlighting",
                    },
                  ].map((style) => (
                    <label
                      key={style.value}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${
                        captionStyle === style.value
                          ? "bg-white text-black"
                          : "bg-[#1f1f1f] border-2 border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name="captionStyle"
                        value={style.value}
                        checked={captionStyle === style.value}
                        onChange={(e) =>
                          setCaptionStyle(e.target.value as CaptionStyleType)
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">{style.label}</div>
                        <div className="text-sm text-[#666666]">
                          {style.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* captions info */}
            {captions.length > 0 && (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h3 className="text-lg font-semibold mb-3">Caption Segments</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {captions.map((caption, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1f1f1f] p-3 rounded-lg text-sm"
                    >
                      <div className="text-gray-400 text-xs mb-1">
                        {caption.start.toFixed(2)}s - {caption.end.toFixed(2)}s
                      </div>
                      <div>{caption.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right column - preview */}
          <div className="space-y-6">
            {videoUrl && captions.length > 0 ? (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  Preview with Captions
                </h2>

                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <Player
                    component={VideoWithCaptions}
                    inputProps={inputProps}
                    durationInFrames={durationInFrames}
                    fps={VIDEO_FPS}
                    compositionHeight={VIDEO_HEIGHT}
                    compositionWidth={VIDEO_WIDTH}
                    style={{ width: "100%" }}
                    controls
                    loop
                  />
                </div>

                <div className="mt-4 p-4 bg-[#1f1f1f] rounded-xl">
                  <p className="text-sm text-gray-300">
                    Preview updates in real-time. Change caption style to see
                    different layouts.
                  </p>
                </div>
              </div>
            ) : videoUrl ? (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h2 className="text-2xl font-semibold mb-4">Video Preview</h2>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full rounded-xl"
                  onLoadedMetadata={handleVideoLoaded}
                />
              </div>
            ) : (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f] h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-lg">Upload a video to get started</p>
                </div>
              </div>
            )}

            {/* export section */}
            {captions.length > 0 && (
              <div className="bg-[#171717] rounded-2xl p-6 shadow-xl border border-[#1f1f1f]">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  Export Options
                </h2>

                <div className="space-y-3">
                  <div className="p-4 bg-[#1f1f1f] rounded-xl">
                    <h3 className="font-semibold mb-2">Local Render (CLI)</h3>
                    <p className="text-sm text-gray-300 mb-2">
                      To render locally, use the Remotion CLI:
                    </p>
                    <code className="block bg-black p-3 rounded text-xs overflow-x-auto">
                      npx remotion render {VIDEO_CAPTION_COMP_NAME}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
