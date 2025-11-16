import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { CaptionSegmentType } from "../../../types/caption";

interface TopBarCaptionsProps {
  captions: CaptionSegmentType[];
}

export const TopBarCaptions: React.FC<TopBarCaptionsProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the current caption to display
  const currentCaption = captions.find(
    (caption) => currentTime >= caption.start && currentTime <= caption.end
  );

  if (!currentCaption) {
    return null;
  }

  // Calculate fade in/out animation
  const captionStartFrame = currentCaption.start * fps;
  const captionEndFrame = currentCaption.end * fps;
  const fadeInDuration = 5; // frames
  const fadeOutDuration = 5; // frames

  const opacity = interpolate(
    frame,
    [
      captionStartFrame,
      captionStartFrame + fadeInDuration,
      captionEndFrame - fadeOutDuration,
      captionEndFrame,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          padding: "30px 40px",
          opacity,
        }}
      >
        <div
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: "42px",
            fontWeight: "700",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.3",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {currentCaption.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

