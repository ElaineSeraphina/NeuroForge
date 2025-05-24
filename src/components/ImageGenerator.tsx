
'use client';
import { useState, useEffect } from 'react';
import PromptInput from './PromptInput';
import SettingsPanel from './SettingsPanel';
import ImageDisplay from './ImageDisplay';
import Gallery from './Gallery';
import LoadingAnimation from './LoadingAnimation';
import { generateImage } from '../utils/api';
import { ImageSettings, GeneratedImage } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [settings, setSettings] = useState<ImageSettings>({
    quality: 'medium',
    size: '1024x1024'
  });
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generator' | 'gallery'>('generator');
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null);
  
  // Load gallery from localStorage on component mount
  useEffect(() => {
    try {
      const savedGallery = localStorage.getItem('imageGallery');
      if (savedGallery) {
        const parsedGallery = JSON.parse(savedGallery);
        if (Array.isArray(parsedGallery)) {
          setGallery(parsedGallery);
        } else {
          console.error('Saved gallery is not an array, resetting');
          localStorage.removeItem('imageGallery');
        }
      }
    } catch (err) {
      console.error('Error loading gallery from localStorage:', err);
      localStorage.removeItem('imageGallery');
    }
  }, []);
  
  // Save gallery to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('imageGallery', JSON.stringify(gallery));
    } catch (err) {
      console.error('Error saving gallery to localStorage:', err);
    }
  }, [gallery]);
  
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setError(null);
    setIsLoading(true);
    
    try {
      const imageData = await generateImage(prompt, settings);
      
      if (!imageData || !imageData.url) {
        throw new Error('Failed to generate image');
      }
      
      const newImage: GeneratedImage = {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        url: imageData.url,
        prompt,
        timestamp: new Date().toISOString(),
        settings: { ...settings }
      };
      
      setCurrentImage(newImage);
      
      // Add to gallery with a new array reference to ensure state update
      const newGallery = [...gallery, newImage];
      setGallery(newGallery);
      
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearImage = () => {
    setCurrentImage(null);
    setPrompt('');
  };
  
  const handleRemoveFromGallery = (id: string) => {
    const newGallery = gallery.filter(img => img.id !== id);
    setGallery(newGallery);
    
    // If the current image is being removed, clear it
    if (currentImage && currentImage.id === id) {
      setCurrentImage(null);
    }
    
    // If the fullscreen image is being removed, close fullscreen
    if (fullscreenImage && fullscreenImage.id === id) {
      setShowFullscreen(false);
      setFullscreenImage(null);
    }
  };
  
  const handleViewImage = (image: GeneratedImage) => {
    setCurrentImage(image);
    setPrompt(image.prompt);
    setSettings(image.settings);
    setActiveTab('generator');
  };
  
  const handleFullscreen = (image: GeneratedImage) => {
    setFullscreenImage(image);
    setShowFullscreen(true);
  };
  
  const closeFullscreen = () => {
    setShowFullscreen(false);
  };
  
  return (
    <div className="relative">
      {/* Cyberpunk-style tabs */}
      <div className="flex mb-6 border-b border-cyan-500/30 relative">
        {/* Animated tab highlight */}
        <div 
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 ease-in-out"
          style={{ 
            left: activeTab === 'generator' ? '0' : '50%', 
            width: '50%',
            transform: activeTab === 'generator' ? 'translateX(0)' : 'translateX(0)'
          }}
        ></div>
        
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center px-6 py-3 uppercase tracking-wider text-sm font-bold relative overflow-hidden w-1/2 justify-center ${
            activeTab === 'generator'
              ? 'text-cyan-400'
              : 'text-gray-400 hover:text-cyan-300'
          }`}
        >
          <span className="mr-2 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {activeTab === 'generator' && (
              <span className="absolute inset-0 text-pink-400 blur-sm opacity-70 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            )}
          </span>
          <span className="relative">
            GENERATOR
            {activeTab === 'generator' && (
              <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></span>
            )}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center px-6 py-3 uppercase tracking-wider text-sm font-bold relative overflow-hidden w-1/2 justify-center ${
            activeTab === 'gallery'
              ? 'text-pink-400'
              : 'text-gray-400 hover:text-pink-300'
          }`}
        >
          <span className="mr-2 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {activeTab === 'gallery' && (
              <span className="absolute inset-0 text-cyan-400 blur-sm opacity-70 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            )}
          </span>
          <span className="relative">
            GALLERY ({gallery.length})
            {activeTab === 'gallery' && (
              <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-pink-500/0 via-pink-500/70 to-pink-500/0"></span>
            )}
          </span>
        </button>
      </div>
      
      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
              
              {/* Holographic corners */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-cyan-500/70 rounded-tl-md"></div>
                <div className="absolute top-1 left-1 w-full h-full border-t-2 border-l-2 border-pink-500/50 rounded-tl-md"></div>
                <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-purple-500/30 rounded-tl-md"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-pink-500/70 rounded-tr-md"></div>
                <div className="absolute top-1 right-1 w-full h-full border-t-2 border-r-2 border-cyan-500/50 rounded-tr-md"></div>
                <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-purple-500/30 rounded-tr-md"></div>
              </div>
              
              {/* Neural network background */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 text-cyan-300 uppercase tracking-wider flex items-center relative">
                <div className="relative mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <div className="absolute inset-0 blur-sm text-pink-400 opacity-70 animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
                <span className="relative">
                  PROMPT INPUT
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0"></span>
                </span>
              </h2>
              
              <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerateImage}
                isLoading={isLoading}
              />
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500"></div>
              
              {/* Holographic corners */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-pink-500/70 rounded-tl-md"></div>
                <div className="absolute top-1 left-1 w-full h-full border-t-2 border-l-2 border-cyan-500/50 rounded-tl-md"></div>
                <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-purple-500/30 rounded-tl-md"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-cyan-500/70 rounded-tr-md"></div>
                <div className="absolute top-1 right-1 w-full h-full border-t-2 border-r-2 border-pink-500/50 rounded-tr-md"></div>
                <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-purple-500/30 rounded-tr-md"></div>
              </div>
              
              {/* Neural network background */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 text-pink-300 uppercase tracking-wider flex items-center relative">
                <div className="relative mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="absolute inset-0 blur-sm text-cyan-400 opacity-70 animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <span className="relative">
                  SETTINGS
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-pink-500/0 via-pink-500/70 to-pink-500/0"></span>
                </span>
              </h2>
              
              <SettingsPanel 
                settings={settings} 
                onSettingsChange={setSettings} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-pink-500"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-pink-500"></div>
              
              {/* Holographic corners */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-purple-500/70 rounded-tl-md"></div>
                <div className="absolute top-1 left-1 w-full h-full border-t-2 border-l-2 border-cyan-500/50 rounded-tl-md"></div>
                <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-pink-500/30 rounded-tl-md"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-cyan-500/70 rounded-tr-md"></div>
                <div className="absolute top-1 right-1 w-full h-full border-t-2 border-r-2 border-purple-500/50 rounded-tr-md"></div>
                <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-pink-500/30 rounded-tr-md"></div>
              </div>
              
              {/* Neural network background */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
              </div>
              
              <h2 className="text-xl font-bold mb-4 text-purple-300 uppercase tracking-wider flex items-center relative">
                <div className="relative mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="absolute inset-0 blur-sm text-cyan-400 opacity-70 animate-pulse-slow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <span className="relative">
                  IMAGE OUTPUT
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0"></span>
                </span>
              </h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px]">
                  <LoadingAnimation />
                  <p className="mt-4 text-cyan-300 animate-pulse uppercase tracking-wider relative">
                    <span className="relative z-10">GENERATING IMAGE...</span>
                    <span className="absolute inset-0 text-pink-300 blur-sm opacity-70">GENERATING IMAGE...</span>
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-24 h-24 mb-4 relative">
                    <div className="absolute inset-0 text-pink-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 text-cyan-500/30 flex items-center justify-center animate-pulse-slow" style={{ animationDuration: '3s' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    
                    {/* Orbiting particles */}
                    <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute w-2 h-2 bg-pink-500 rounded-full animate-orbit" style={{ animationDuration: '3s' }}></div>
                      <div className="absolute w-2 h-2 bg-cyan-500 rounded-full animate-orbit" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
                      <div className="absolute w-2 h-2 bg-purple-500 rounded-full animate-orbit" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
                    </div>
                  </div>
                  
                  <p className="text-pink-500 font-bold text-lg mb-2 uppercase relative">
                    <span className="relative z-10">ERROR</span>
                    <span className="absolute inset-0 text-cyan-500/50 blur-sm opacity-70">ERROR</span>
                  </p>
                  
                  <p className="text-white/80 relative">
                    <span className="relative z-10">{error}</span>
                    <span className="absolute -inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></span>
                    <span className="absolute -inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></span>
                  </p>
                  
                  <button 
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-pink-500/20 border border-pink-500 text-pink-300 rounded-md hover:bg-pink-500/30 transition-all uppercase tracking-wider text-sm font-bold relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-pink-500/0 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity"></span>
                    <span className="relative z-10">Dismiss</span>
                  </button>
                </div>
              ) : (
                <ImageDisplay 
                  image={currentImage} 
                  onClear={handleClearImage}
                  onFullscreen={handleFullscreen}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Gallery 
          images={gallery} 
          onRemove={handleRemoveFromGallery} 
          onView={handleViewImage}
          onFullscreen={handleFullscreen}
        />
      )}
      
      {/* Fullscreen image view */}
      {showFullscreen && fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={closeFullscreen}>
          <div className="absolute inset-0 pointer-events-none">
            {/* Neural network grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-24 h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={`col-${i}`} className="border-r border-cyan-500/10"></div>
                ))}
              </div>
              <div className="grid grid-rows-24 w-full h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={`row-${i}`} className="border-b border-cyan-500/10"></div>
                ))}
              </div>
            </div>
            
            {/* Scan lines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-30" style={{ backgroundSize: '100% 8px', backgroundRepeat: 'repeat', animation: 'scanline 8s linear infinite' }}></div>
            
            {/* Quantum particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={`quantum-${i}`} 
                  className="absolute rounded-full bg-cyan-500/30 blur-md"
                  style={{
                    width: `${Math.random() * 10 + 5}px`,
                    height: `${Math.random() * 10 + 5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 10 + 10}s infinite linear`,
                    animationDelay: `${Math.random() * 10}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex space-x-4">
              <button 
                onClick={closeFullscreen}
                className="p-2 bg-pink-500/20 border border-pink-500 text-pink-300 rounded-md hover:bg-pink-500/30 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-pink-500/0 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
              
              {/* Holographic corners */}
              <div className="absolute top-0 left-0 w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-cyan-500/70 rounded-tl-md"></div>
                <div className="absolute top-1 left-1 w-full h-full border-t-2 border-l-2 border-pink-500/50 rounded-tl-md"></div>
                <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-purple-500/30 rounded-tl-md"></div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20">
                <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-pink-500/70 rounded-tr-md"></div>
                <div className="absolute top-1 right-1 w-full h-full border-t-2 border-r-2 border-cyan-500/50 rounded-tr-md"></div>
                <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-purple-500/30 rounded-tr-md"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-20 h-20">
                <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-pink-500/70 rounded-bl-md"></div>
                <div className="absolute bottom-1 left-1 w-full h-full border-b-2 border-l-2 border-cyan-500/50 rounded-bl-md"></div>
                <div className="absolute bottom-2 left-2 w-full h-full border-b-2 border-l-2 border-purple-500/30 rounded-bl-md"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20">
                <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-cyan-500/70 rounded-br-md"></div>
                <div className="absolute bottom-1 right-1 w-full h-full border-b-2 border-r-2 border-pink-500/50 rounded-br-md"></div>
                <div className="absolute bottom-2 right-2 w-full h-full border-b-2 border-r-2 border-purple-500/30 rounded-br-md"></div>
              </div>
              
              <div className="relative">
                <div className="relative">
                  {/* Holographic frame */}
                  <div className="absolute -inset-0.5 rounded-md overflow-hidden">
                    <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-md"></div>
                    <div className="absolute inset-0 border-2 border-pink-500/20 rounded-md" style={{ transform: 'scale(0.99)' }}></div>
                    <div className="absolute inset-0 border-2 border-purple-500/10 rounded-md" style={{ transform: 'scale(0.98)' }}></div>
                    
                    {/* Animated energy flow */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0 animate-flow-right"></div>
                      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-pink-500/0 via-pink-500/70 to-pink-500/0 animate-flow-left"></div>
                      <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500/0 via-purple-500/70 to-purple-500/0 animate-flow-down"></div>
                      <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/70 to-cyan-500/0 animate-flow-up"></div>
                    </div>
                  </div>
                  
                  <img 
                    src={fullscreenImage.url} 
                    alt={fullscreenImage.prompt} 
                    className="w-full h-auto rounded-md border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] relative z-10"
                  />
                  
                  {/* Holographic corner accents */}
                  <div className="absolute top-0 left-0 w-10 h-10 z-20">
                    <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-cyan-500/70 rounded-tl-md"></div>
                    <div className="absolute top-1 left-1 w-full h-full border-t-2 border-l-2 border-pink-500/50 rounded-tl-md"></div>
                    <div className="absolute top-2 left-2 w-full h-full border-t-2 border-l-2 border-purple-500/30 rounded-tl-md"></div>
                  </div>
                  <div className="absolute top-0 right-0 w-10 h-10 z-20">
                    <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-pink-500/70 rounded-tr-md"></div>
                    <div className="absolute top-1 right-1 w-full h-full border-t-2 border-r-2 border-cyan-500/50 rounded-tr-md"></div>
                    <div className="absolute top-2 right-2 w-full h-full border-t-2 border-r-2 border-purple-500/30 rounded-tr-md"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 z-20">
                    <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-pink-500/70 rounded-bl-md"></div>
                    <div className="absolute bottom-1 left-1 w-full h-full border-b-2 border-l-2 border-cyan-500/50 rounded-bl-md"></div>
                    <div className="absolute bottom-2 left-2 w-full h-full border-b-2 border-l-2 border-purple-500/30 rounded-bl-md"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 z-20">
                    <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-cyan-500/70 rounded-br-md"></div>
                    <div className="absolute bottom-1 right-1 w-full h-full border-b-2 border-r-2 border-pink-500/50 rounded-br-md"></div>
                    <div className="absolute bottom-2 right-2 w-full h-full border-b-2 border-r-2 border-purple-500/30 rounded-br-md"></div>
                  </div>
                  
                  {/* Scan line effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-30 z-20" style={{ backgroundSize: '100% 8px', backgroundRepeat: 'repeat', animation: 'scanline 8s linear infinite' }}></div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-bold text-cyan-300 uppercase tracking-wider relative inline-block">
                    <span className="relative z-10">PROMPT:</span>
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-cyan-500/70 to-cyan-500/0"></span>
                  </h3>
                  
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-md blur-sm"></div>
                    <p className="text-white/80 bg-black/40 p-3 rounded border border-purple-500/30 relative">
                      {fullscreenImage.prompt}
                      
                      {/* Holographic corners */}
                      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/50"></span>
                      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-pink-500/50"></span>
                      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-pink-500/50"></span>
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/50"></span>
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="relative group/stat">
                      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-pink-500/0 rounded-md opacity-0 group-hover/stat:opacity-100 transition-opacity blur-sm"></div>
                      <div className="relative">
                        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          QUALITY:
                        </h4>
                        <p className="text-white/80 flex items-center">
                          <span className="relative">
                            {fullscreenImage.settings.quality}
                            <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-pink-500/50 to-pink-500/0"></span>
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative group/stat">
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-cyan-500/0 rounded-md opacity-0 group-hover/stat:opacity-100 transition-opacity blur-sm"></div>
                      <div className="relative">
                        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          SIZE:
                        </h4>
                        <p className="text-white/80 flex items-center">
                          <span className="relative">
                            {fullscreenImage.settings.size}
                            <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-cyan-500/50 to-cyan-500/0"></span>
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative group/stat">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-purple-500/0 rounded-md opacity-0 group-hover/stat:opacity-100 transition-opacity blur-sm"></div>
                      <div className="relative">
                        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          CREATED:
                        </h4>
                        <p className="text-white/80 flex items-center">
                          <span className="relative">
                            {new Date(fullscreenImage.timestamp).toLocaleString()}
                            <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-purple-500/50 to-purple-500/0"></span>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <a 
                      href={fullscreenImage.url} 
                      download={`image-${fullscreenImage.id}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-md hover:bg-cyan-500/30 transition-all uppercase tracking-wider text-sm font-bold flex items-center relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="relative z-10">Download</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
      