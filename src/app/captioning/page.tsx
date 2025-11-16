"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Player } from "@remotion/player";
import type { CaptionSegmentType, CaptionStyleType } from "../../../types/caption";
import {
  VIDEO_CAPTION_COMP_NAME,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";
import { VideoWithCaptions } from "../../remotion/VideoWithCaptions/VideoWithCaptions";

export default function CaptioningPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(""); // Blob URL for preview
  const [uploadedVideoPath, setUploadedVideoPath] = useState<string>(""); // Server path for API
  const [captions, setCaptions] = useState<CaptionSegmentType[]>([]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyleType>("bottom-centered");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("video")) {
        setError("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      setError("");
      setSuccessMessage("");
      setCaptions([]);
      setUploadedVideoPath(""); // Reset uploaded path
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Auto-upload the file
      uploadFile(file);
    }
  };

  // Handle video upload
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedVideoPath(data.videoUrl); // Store server path
      setSuccessMessage("Video uploaded successfully! You can now generate captions.");
    } catch (err: any) {
      setError(err.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  // Legacy upload handler (kept for compatibility)
  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file first");
      return;
    }
    await uploadFile(videoFile);
  };

  // Handle auto-caption generation
  const handleGenerateCaptions = async () => {
    if (!uploadedVideoPath) {
      setError("Please wait for video upload to complete first");
      return;
    }

    setIsGenerating(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/captions/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoPath: uploadedVideoPath }), // Use server path
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Caption generation failed");
      }

      setCaptions(data.captions);
      setVideoDuration(data.duration);
      setSuccessMessage(
        `Captions generated successfully! (${data.captions.length} segments, Language: ${data.language || "auto-detected"})`
      );
    } catch (err: any) {
      setError(err.message || "Failed to generate captions");
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate duration in frames
  const durationInFrames = useMemo(() => {
    if (videoDuration > 0) {
      return Math.ceil(videoDuration * VIDEO_FPS);
    }
    return 300; // Default 10 seconds
  }, [videoDuration]);

  // Prepare input props for Remotion
  const inputProps = useMemo(() => {
    return {
      videoUrl: videoUrl || "",
      captions,
      style: captionStyle,
    };
  }, [videoUrl, captions, captionStyle]);

  // Handle video metadata loaded
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Remotion Captioning Platform
          </h1>
          <p className="text-gray-400 text-lg">
            Upload videos, auto-generate captions with Hinglish support, and render with stunning styles
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📹</span> Upload Video
              </h2>
              
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
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
                    {videoFile ? videoFile.name : "Click to select video file (.mp4)"}
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

            {/* Caption Generation */}
            {videoUrl && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">💬</span> Generate Captions
                </h2>
                
                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGenerating || isUploading || !uploadedVideoPath}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                      Generating Captions...
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

            {/* Caption Style Selection */}
            {captions.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">🎨</span> Caption Style
                </h2>
                
                <div className="space-y-3">
                  {[
                    { value: "bottom-centered", label: "Bottom Centered", desc: "Classic subtitle style" },
                    { value: "top-bar", label: "Top Bar", desc: "News-style banner" },
                    { value: "karaoke", label: "Karaoke", desc: "Word-by-word highlighting" },
                  ].map((style) => (
                    <label
                      key={style.value}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${
                        captionStyle === style.value
                          ? "bg-blue-600 border-2 border-blue-400"
                          : "bg-gray-700 border-2 border-transparent hover:bg-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="captionStyle"
                        value={style.value}
                        checked={captionStyle === style.value}
                        onChange={(e) => setCaptionStyle(e.target.value as CaptionStyleType)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">{style.label}</div>
                        <div className="text-sm text-gray-300">{style.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Captions Info */}
            {captions.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">📝 Caption Segments</h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {captions.map((caption, idx) => (
                    <div key={idx} className="bg-gray-700 p-3 rounded-lg text-sm">
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

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {videoUrl && captions.length > 0 ? (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">👁️</span> Preview with Captions
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

                <div className="mt-4 p-4 bg-gray-700 rounded-xl">
                  <p className="text-sm text-gray-300">
                    ℹ️ Preview updates in real-time. Change caption style to see different layouts.
                  </p>
                </div>
              </div>
            ) : videoUrl ? (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
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
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-lg">Upload a video to get started</p>
                </div>
              </div>
            )}

            {/* Export Section */}
            {captions.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="mr-2">📥</span> Export Options
                </h2>
                
                <div className="space-y-3">
                  <div className="p-4 bg-gray-700 rounded-xl">
                    <h3 className="font-semibold mb-2">🖥️ Local Render (CLI)</h3>
                    <p className="text-sm text-gray-300 mb-2">
                      To render locally, use the Remotion CLI:
                    </p>
                    <code className="block bg-black p-3 rounded text-xs overflow-x-auto">
                      npx remotion render {VIDEO_CAPTION_COMP_NAME}
                    </code>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-xl">
                    <h3 className="font-semibold mb-2">☁️ Cloud Render (AWS Lambda)</h3>
                    <p className="text-sm text-gray-300">
                      Configure AWS Lambda in <code>.env</code> for cloud rendering.
                      See README for setup instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg max-w-md">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg max-w-md">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

