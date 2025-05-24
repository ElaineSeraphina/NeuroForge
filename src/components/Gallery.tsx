'use client';
import { useState } from 'react';
import { GeneratedImage } from '../types/types';

interface GalleryProps {
  images: GeneratedImage[];
  onRemove: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onRemove }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    if (isConfirmingDelete === id) {
      onRemove(id);
      setIsConfirmingDelete(null);
      if (selectedImage && selectedImage.id === id) {
        setSelectedImage(null);
      }
    } else {
      setIsConfirmingDelete(id);
      setTimeout(() => {
        setIsConfirmingDelete(null);
      }, 3000);
    }
  };

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `cyberpunk-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-pink-900/50 p-8 shadow-lg min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-pink-400 text-lg font-bold mb-2">Gallery Empty</h3>
        <p className="text-gray-400 max-w-md">
          Generate some images to build your cyberpunk collection.
        </p>
      </div>
    );
  }

  if (selectedImage) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-pink-900/50 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"></div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="text-pink-400 hover:text-pink-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              BACK TO GALLERY
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="text-cyan-400 hover:text-cyan-300 p-1 rounded"
                title="Download Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => handleRemove(selectedImage.id)}
                className={`
                  p-1 rounded
                  ${isConfirmingDelete === selectedImage.id 
                    ? 'text-red-500 hover:text-red-400 animate-pulse' 
                    : 'text-pink-400 hover:text-pink-300'
                  }
                `}
                title={isConfirmingDelete === selectedImage.id ? "Confirm Delete" : "Delete Image"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.prompt} 
              className="w-full h-auto rounded border border-gray-800 shadow-lg"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-pink-400 text-sm uppercase tracking-wider font-bold mb-2">PROMPT</h3>
            <p className="text-white text-sm italic bg-gray-800/50 p-3 rounded border border-gray-700">
              "{selectedImage.prompt}"
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <h4 className="text-xs text-gray-400 uppercase mb-1">Generated</h4>
                <p className="text-white text-sm">
                  {new Date(selectedImage.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <h4 className="text-xs text-gray-400 uppercase mb-1">Quality</h4>
                <p className="text-white text-sm">
                  {selectedImage.settings.quality}
                </p>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <h4 className="text-xs text-gray-400 uppercase mb-1">Size</h4>
                <p className="text-white text-sm">
                  {selectedImage.settings.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-pink-900/50 p-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"></div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-pink-400 text-sm uppercase tracking-wider font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          IMAGE GALLERY ({images.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div 
            key={image.id}
            className="group relative bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img 
                src={image.url} 
                alt={image.prompt} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                onClick={() => setSelectedImage(image)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-xs line-clamp-2 mb-2">
                "{image.prompt.length > 60 ? image.prompt.substring(0, 60) + '...' : image.prompt}"
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <span className="text-xs bg-cyan-900/50 text-cyan-400 px-1.5 py-0.5 rounded">
                    {image.settings.quality}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 p-1 rounded bg-gray-800/70"
                    title="Download Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(image.id);
                    }}
                    className={`
                      p-1 rounded bg-gray-800/70
                      ${isConfirmingDelete === image.id 
                        ? 'text-red-500 hover:text-red-400 animate-pulse' 
                        : 'text-pink-400 hover:text-pink-300'
                      }
                    `}
                    title={isConfirmingDelete === image.id ? "Confirm Delete" : "Delete Image"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Cyberpunk corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-pink-500/70"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/70"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/70"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pink-500/70"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;