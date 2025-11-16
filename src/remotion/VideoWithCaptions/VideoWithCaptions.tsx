import React from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSans";
import { loadFont as loadFontDevanagari } from "@remotion/google-fonts/NotoSansDevanagari";
import type { VideoCaptionPropsType } from "../../../types/caption";
import { BottomCenteredCaptions } from "../CaptionStyles/BottomCentered";
import { TopBarCaptions } from "../CaptionStyles/TopBar";
import { KaraokeCaptions } from "../CaptionStyles/Karaoke";

// Load fonts for Hinglish support
const { fontFamily: notoSansFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700", "800"],
});

const { fontFamily: notoSansDevanagariFamily } = loadFontDevanagari("normal", {
  subsets: ["devanagari"],
  weights: ["400", "700", "800"],
});

export const VideoWithCaptions: React.FC<VideoCaptionPropsType> = ({
  videoUrl,
  captions,
  style,
}) => {
  // Ensure fonts are loaded
  const fontFamilies = `${notoSansFamily}, ${notoSansDevanagariFamily}, sans-serif`;

  // Determine video source - only load if videoUrl is provided
  const videoSrc = videoUrl ? (videoUrl.startsWith("/") ? staticFile(videoUrl) : videoUrl) : null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: fontFamilies,
      }}
    >
      {/* Video Layer - only render if video URL exists */}
      {videoSrc && (
        <AbsoluteFill>
          <Video src={videoSrc} style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
      )}

      {/* Placeholder if no video */}
      {!videoSrc && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: "48px",
              textAlign: "center",
              fontFamily: fontFamilies,
            }}
          >
            Upload a video to preview
          </div>
        </AbsoluteFill>
      )}

      {/* Caption Layer */}
      {style === "bottom-centered" && (
        <BottomCenteredCaptions captions={captions} />
      )}
      {style === "top-bar" && <TopBarCaptions captions={captions} />}
      {style === "karaoke" && <KaraokeCaptions captions={captions} />}
    </AbsoluteFill>
  );
};

