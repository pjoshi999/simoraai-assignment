import { Composition } from "remotion";
import { Main } from "./MyComp/Main";
import { VideoWithCaptions } from "./VideoWithCaptions/VideoWithCaptions";
import {
  COMP_NAME,
  VIDEO_CAPTION_COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { NextLogo } from "./MyComp/NextLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id={VIDEO_CAPTION_COMP_NAME}
        component={VideoWithCaptions}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          videoUrl: "",
          captions: [
            {
              text: "Welcome to Remotion Captioning Platform",
              start: 0,
              end: 3,
              words: [],
            },
            {
              text: "Upload your video to get started",
              start: 3,
              end: 6,
              words: [],
            },
          ],
          style: "bottom-centered" as const,
        }}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
    </>
  );
};
