// API Configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://video-captioning-backend.onrender.com';

interface UploadResponse {
  success: boolean;
  videoUrl: string;
  filename: string;
  size: number;
  path: string;
}

interface CaptionResponse {
  success: boolean;
  captions: Array<{
    text: string;
    start: number;
    end: number;
    words: Array<{
      word: string;
      start: number;
      end: number;
    }>;
  }>;
  language: string;
  duration: number;
  confidence?: number;
}

export const api = {
  /**
   * Upload a video file to the backend
   */
  uploadVideo: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch(`${BACKEND_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  /**
   * Generate captions for an uploaded video
   */
  generateCaptions: async (videoPath: string): Promise<CaptionResponse> => {
    const response = await fetch(`${BACKEND_URL}/api/captions/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoPath }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Caption generation failed');
    }

    return response.json();
  },

  /**
   * Health check endpoint
   */
  healthCheck: async (): Promise<{ status: string; message: string }> => {
    const response = await fetch(`${BACKEND_URL}/health`);
    
    if (!response.ok) {
      throw new Error('Backend is not responding');
    }

    return response.json();
  },

  /**
   * Get full URL for a video file
   */
  getVideoUrl: (videoPath: string): string => {
    return `${BACKEND_URL}${videoPath}`;
  },
};

export const BACKEND_API_URL = BACKEND_URL;

