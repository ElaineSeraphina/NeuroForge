export interface ImageSettings {
  quality: 'low' | 'medium' | 'high';
  size: '1024x1024' | '1024x1536' | '1536x1024';
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: string;
  settings: ImageSettings;
}

export interface ApiResponse {
  data: {
    b64_json: string;
  }[];
}