import { ImageSettings } from '../types';

export async function generateImage(prompt: string, settings: ImageSettings): Promise<{ url: string }> {
  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      protocol: 'https',
      origin: 'api.openai.com',
      path: '/v1/images/generations',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        quality: settings.quality,
        size: settings.size,
        n: 1,
      }),
    }),
  });

  // Cek status HTTP
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  // Debug log
  console.log('OpenAI image response:', data);

  if (!data.data || !data.data[0]?.url) {
    throw new Error(data.error?.message || 'Failed to generate image');
  }
  return { url: data.data[0].url };
}