import { z } from "zod";
import { VideoCaptionProps } from "./caption";

export const COMP_NAME = "MyComp";
export const VIDEO_CAPTION_COMP_NAME = "VideoWithCaptions";

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

export { VideoCaptionProps };
export type { VideoCaptionPropsType } from "./caption";
