'use client';
import { useState } from 'react';
import { GeneratedImage } from '../types/types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  onSave: () => void;
  onClear: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  image, 
  onSave, 
  onClear 
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = () => {
    if (!image) return;
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `cyberpunk-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  if (!image) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-cyan-900/50 p-6 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-cyan-400 text-lg font-bold mb-2">No Image Generated</h3>
        <p className="text-gray-400 max-w-md">
          Enter a prompt and click "Generate Image" to create your cyberpunk masterpiece.
        </p>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleDownload}
            className="bg-gray-800/80 hover:bg-gray-700/80 text-cyan-400 p-2 rounded-full"
            title="Download Image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-gray-800/80 hover:bg-gray-700/80 text-pink-400 p-2 rounded-full"
            title="Close Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-w-full max-h-[80vh] relative">
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
          />
        </div>
        
        <div className="mt-4 max-w-2xl text-center">
          <p className="text-gray-300 text-sm italic">"{image.prompt}"</p>
          <div className="mt-2 text-xs text-gray-500">
            Generated on {new Date(image.timestamp).toLocaleString()} • 
            Quality: {image.settings.quality} • 
            Size: {image.settings.size}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-cyan-900/50 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-pink-500 opacity-70"></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-cyan-400 text-sm uppercase tracking-wider font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            GENERATED IMAGE
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className={`
                text-cyan-400 hover:text-cyan-300 p-1 rounded
                ${isDownloading ? 'animate-pulse' : ''}
              `}
              title="Download Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="text-cyan-400 hover:text-cyan-300 p-1 rounded"
              title="View Fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button
              onClick={onClear}
              className="text-pink-400 hover:text-pink-300 p-1 rounded"
              title="Clear Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="w-full h-auto rounded border border-gray-800 shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-white text-sm italic mb-2">"{image.prompt}"</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded">
                Quality: {image.settings.quality}
              </span>
              <span className="text-xs bg-pink-900/50 text-pink-400 px-2 py-1 rounded">
                Size: {image.settings.size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
