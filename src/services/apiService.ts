'use client';
import { ImageSettings } from '../types/types';

// OpenAI API key
const OPENAI_API_KEY = "secret_cman6xaoj0000356m2g74p4wt";

export const generateImage = async (prompt: string, settings: ImageSettings) => {
  try {
    console.log('Generating image with prompt:', prompt);
    console.log('Settings:', settings);
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'api.openai.com',
        path: '/v1/images/generations',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          quality: settings.quality,
          size: settings.size,
          n: 1,
        }),
      }),
    });

    // Cek response content-type sebelum parse JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      let errorText = '';
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } else {
        errorText = await response.text();
      }
      console.error('API Error Response:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('API Response:', data);
      if (data && data.data && Array.isArray(data.data) && data.data.length > 0 && data.data[0].b64_json) {
        return { b64_json: data.data[0].b64_json };
      } else {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid response format from API');
      }
    } else {
      const text = await response.text();
      console.error('API did not return JSON:', text);
      throw new Error('API did not return JSON');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};