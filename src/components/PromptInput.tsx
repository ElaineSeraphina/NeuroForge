'use client';
import { useState, useEffect } from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isLoading
}) => {
  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onGenerate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="mb-1 flex justify-between items-center">
        <label htmlFor="prompt" className="text-cyan-400 text-xs uppercase tracking-wider font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          PROMPT DESCRIPTION
        </label>
        <span className={`text-xs ${charCount > 0 ? 'text-cyan-400' : 'text-gray-500'}`}>
          {charCount} CHARS
        </span>
      </div>
      
      <div className="relative">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to generate..."
          className="w-full h-32 bg-gray-800/50 text-white border border-cyan-900/50 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-gray-500 resize-none"
          disabled={isLoading}
        />
        
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Press Ctrl+Enter to generate
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`
            px-6 py-3 rounded-md font-bold uppercase tracking-wider text-sm
            relative overflow-hidden transition-all duration-300
            ${isLoading || !prompt.trim() 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:from-cyan-400 hover:to-pink-400 shadow-lg hover:shadow-cyan-500/20'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              GENERATING...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              GENERATE IMAGE
            </span>
          )}
          
          {/* Animated border effect */}
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500"></span>
        </button>
      </div>
    </form>
  );
};

export default PromptInput;