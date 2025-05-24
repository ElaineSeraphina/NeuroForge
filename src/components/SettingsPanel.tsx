'use client';
import React, { useState } from 'react';
import { ImageSettings } from '../types';

interface SettingsPanelProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

const qualityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const sizeOptions = [
  { value: '1024x1024', label: 'SQUARE (1:1) 1024x1024' },
  { value: '1024x1536', label: 'PORTRAIT (2:3) 1024x1536' },
  { value: '1536x1024', label: 'LANDSCAPE (3:2) 1536x1024' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg border border-pink-900/50 p-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500 opacity-70"></div>
      <div className="absolute top-1 left-1 w-2 h-2 bg-pink-400 rounded-full"></div>
      <div className="absolute top-1 left-5 w-2 h-2 bg-purple-400 rounded-full"></div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-pink-400 text-sm uppercase tracking-wider font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          IMAGE SETTINGS
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-pink-400 hover:text-pink-300"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
              IMAGE QUALITY
            </label>
            <div className="grid grid-cols-3 gap-2">
              {qualityOptions.map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => onSettingsChange({ ...settings, quality: quality.value as ImageSettings['quality'] })}
                  className={`
                    py-2 px-3 text-xs uppercase font-medium rounded border transition-all
                    ${settings.quality === quality.value
                      ? 'bg-pink-900/30 border-pink-500/50 text-pink-400'
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-pink-500/30 hover:text-pink-300'
                    }
                  `}
                >
                  {quality.label}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {settings.quality === 'low' && 'Faster generation, lower detail'}
              {settings.quality === 'medium' && 'Balanced quality and speed'}
              {settings.quality === 'high' && 'Highest detail, slower generation'}
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-2 block">
              IMAGE SIZE
            </label>
            <div className="grid grid-cols-1 gap-2">
              {sizeOptions.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onSettingsChange({ ...settings, size: size.value as ImageSettings['size'] })}
                  className={`
                    py-2 px-3 text-xs uppercase font-medium rounded border transition-all flex justify-between items-center
                    ${settings.size === size.value
                      ? 'bg-pink-900/30 border-pink-500/50 text-pink-400'
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-pink-500/30 hover:text-pink-300'
                    }
                  `}
                >
                  <span>{size.label}</span>
                  <span className="text-xs opacity-70">{size.value}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                Higher quality and larger sizes may take longer to generate.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;