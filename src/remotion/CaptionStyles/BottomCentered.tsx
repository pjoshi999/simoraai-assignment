import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { CaptionSegmentType } from "../../../types/caption";

interface BottomCenteredCaptionsProps {
  captions: CaptionSegmentType[];
}

export const BottomCenteredCaptions: React.FC<BottomCenteredCaptionsProps> = ({
  captions,
}) => {
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
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "10%",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "20px 40px",
          borderRadius: "12px",
          maxWidth: "80%",
          opacity,
        }}
      >
        <div
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: "48px",
            fontWeight: "700",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: "1.4",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          {currentCaption.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

