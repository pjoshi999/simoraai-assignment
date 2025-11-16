import { z } from "zod";

export const CaptionSegment = z.object({
  text: z.string(),
  start: z.number(), // seconds
  end: z.number(), // seconds
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ).optional(),
});

export type CaptionSegmentType = z.infer<typeof CaptionSegment>;

export const CaptionStyle = z.enum(["bottom-centered", "top-bar", "karaoke"]);

export type CaptionStyleType = z.infer<typeof CaptionStyle>;

export const VideoCaptionProps = z.object({
  videoUrl: z.string(),
  captions: z.array(CaptionSegment),
  style: CaptionStyle,
});

export type VideoCaptionPropsType = z.infer<typeof VideoCaptionProps>;

