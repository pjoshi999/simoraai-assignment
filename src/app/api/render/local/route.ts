import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const { inputProps, compositionId, outputFileName } = await req.json();

    if (!inputProps || !compositionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Note: Local rendering requires CLI usage
    // This endpoint is a placeholder for future implementation
    return NextResponse.json({
      success: false,
      message: "Local rendering is available via CLI. Use: npx remotion render " + compositionId + " output.mp4",
      instructions: {
        command: `npx remotion render ${compositionId} ${outputFileName || 'output.mp4'}`,
        note: "Run this command in your terminal to render the video locally"
      }
    });
  } catch (error: any) {
    console.error("Render error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to render video" },
      { status: 500 }
    );
  }
}
