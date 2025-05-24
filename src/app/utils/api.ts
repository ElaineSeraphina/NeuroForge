'use client';
import { ImageSettings } from '../types';

// FAL.ai API key
const FAL_KEY = "90e38282-0bc2-48df-aa2f-b66883982ad5:5b9c9f6d90bac5035bb314057b67ef7b";

export const generateImage = async (
  prompt: string,
  settings: ImageSettings
): Promise<{ url: string }> => {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization di-inject backend
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'fal.run',
        path: '/fal-ai/flux-pro/v1.1-ultra',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${FAL_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify({
          prompt: prompt,
          // Map OpenAI quality settings to FAL.ai settings
          raw: settings.quality === 'high' ? false : settings.quality === 'low' ? true : false,
          // Map OpenAI size settings to FAL.ai aspect_ratio
          aspect_ratio: settings.size === '1024x1024' ? '1:1' : 
                        settings.size === '1024x1536' ? '2:3' : 
                        '3:2',
          output_format: "jpeg",
          sync_mode: true
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', JSON.stringify(errorData));
      throw new Error(errorData.error?.message || `Failed to generate image: ${response.status} ${response.statusText}`);
    }

    const data = await response.json().catch(async () => {
      const text = await response.text();
      throw new Error('Non-JSON response: ' + text.slice(0, 200));
    });
    
    // Check if the response has the expected structure for FAL.ai
    if (!data || !data.data || !data.data.images || !Array.isArray(data.data.images) || !data.data.images[0] || !data.data.images[0].url) {
      console.error('Invalid API response format:', JSON.stringify(data));
      throw new Error('Invalid response format from API');
    }
    
    // Get the image URL from the response
    const imageUrl = data.data.images[0].url;
    
    return { url: imageUrl };
  } catch (error) {
    console.error('Error in generateImage:', error);
    throw error;
  }
};
