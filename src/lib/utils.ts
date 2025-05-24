import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { mnemonicToAccount } from 'viem/accounts';
import { APP_BUTTON_TEXT, APP_DESCRIPTION, APP_ICON_URL, APP_NAME, APP_OG_IMAGE_URL, APP_PRIMARY_CATEGORY, APP_SPLASH_BACKGROUND_COLOR, APP_TAGS, APP_URL, APP_WEBHOOK_URL } from './constants';
import { APP_SPLASH_URL } from './constants';

interface FrameMetadata {
  version: string;
  name: string;
  iconUrl: string;
  homeUrl: string;
  imageUrl?: string;
  buttonTitle?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
  webhookUrl?: string;
  description?: string;
  primaryCategory?: string;
  tags?: string[];
};

interface FrameManifest {
  accountAssociation?: {
    header: string;
    payload: string;
    signature: string;
  };
  frame: FrameMetadata;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSecretEnvVars() {
  const seedPhrase = process.env.SEED_PHRASE;
  const fid = process.env.FID;
  
  if (!seedPhrase || !fid) {
    return null;
  }

  return { seedPhrase, fid };
}

export function getFrameEmbedMetadata(ogImageUrl?: string) {
  return {
    version: "next",
    imageUrl: ogImageUrl ?? APP_OG_IMAGE_URL,
    button: {
      title: APP_BUTTON_TEXT,
      action: {
        type: "launch_frame",
        name: APP_NAME,
        url: APP_URL,
        splashImageUrl: APP_SPLASH_URL,
        iconUrl: APP_ICON_URL,
        splashBackgroundColor: APP_SPLASH_BACKGROUND_COLOR,
        description: APP_DESCRIPTION,
        primaryCategory: APP_PRIMARY_CATEGORY,
        tags: APP_TAGS,
      },
    },
  };
}

export function getFarcasterMetadata() {
  return {
    frame: {
      version: "1",
      name: "NeuroForge",
      iconUrl: "https://dark-ads-send.loca.lt/icon.png", // ← update ke tunnel aktif
      homeUrl: "https://dark-ads-send.loca.lt",
      imageUrl: "https://dark-ads-send.loca.lt/api/opengraph-image",
      buttonTitle: "Start Creating",
      splashImageUrl: "https://dark-ads-send.loca.lt/splash.png", // ← update ke tunnel aktif
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: "https://api.neynar.com/f/app/b8ef3593-7d21-4e7e-8e37-17adfec955d8/event",
      description: "A modern text-to-image generator using OpenAI GPT-Image-1. Futuristic UI, glass morphism, animated transitions, and a gallery for your creations.",
      primaryCategory: "art-creativity",
      tags: [
        "Farcaster",
        "creativity",
        "AI",
        "art",
        "Warpcast",
        "image-generation",
        "onchain",
        "community"
      ]
    }
  };
}
