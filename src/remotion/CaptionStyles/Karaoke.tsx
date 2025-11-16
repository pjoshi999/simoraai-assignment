import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionSegmentType } from "../../../types/caption";

interface KaraokeCaptionsProps {
  captions: CaptionSegmentType[];
}

export const KaraokeCaptions: React.FC<KaraokeCaptionsProps> = ({
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

  // If word-level timestamps are available, use them
  const hasWordTimestamps = currentCaption.words && currentCaption.words.length > 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "12%",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "25px 50px",
          borderRadius: "16px",
          maxWidth: "85%",
        }}
      >
        <div
          style={{
            fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
            fontSize: "52px",
            fontWeight: "800",
            textAlign: "center",
            lineHeight: "1.5",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {hasWordTimestamps ? (
            // Render with word-level highlighting
            currentCaption.words!.map((word, index) => {
              const isActive =
                currentTime >= word.start && currentTime <= word.end;
              return (
                <span
                  key={index}
                  style={{
                    color: isActive ? "#FFD700" : "#ffffff",
                    textShadow: isActive
                      ? "0 0 20px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)"
                      : "2px 2px 4px rgba(0, 0, 0, 0.8)",
                    transition: "all 0.1s ease",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    display: "inline-block",
                  }}
                >
                  {word.word}
                </span>
              );
            })
          ) : (
            // Fallback: render entire text without word-level highlighting
            <span
              style={{
                color: "#FFD700",
                textShadow:
                  "0 0 20px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              {currentCaption.text}
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

