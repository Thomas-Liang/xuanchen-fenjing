
import React from 'react';
import { AspectRatio, CoreMode, Resolution } from '../types';

interface DirectorDeckProps {
  currentMode: CoreMode;
  setMode: (m: CoreMode) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  resolution: Resolution;
  setResolution: (r: Resolution) => void;
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  imageCount: number;
  setImageCount: (c: number) => void;
}

const DirectorDeck: React.FC<DirectorDeckProps> = ({
  currentMode,
  setMode,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  imageCount,
  setImageCount
}) => {
  
  // Icon mapping for modes based on screenshot vibes
  const getModeIcon = (m: CoreMode) => {
    switch(m) {
      case CoreMode.SPACE_EXPLORATION: return "🛰️";
      case CoreMode.NARRATIVE_STORY: return "🗣️";
      case CoreMode.CYBERPUNK: return "🌆";
      case CoreMode.NATURE_DOC: return "🌿";
      default: return "🎬";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 border-t border-gray-900 pt-6">
         <div className="flex justify-between items-center mb-4 border-l-2 border-gray-700 pl-3">
            <h2 className="text-[#e5e5e5] text-xs font-mono uppercase tracking-widest">02. Director Deck</h2>
            <div className="flex space-x-1">
               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            </div>
         </div>
      </div>

      {/* Core Mode */}
      <div className="mb-6">
        <label className="text-gray-600 text-[9px] font-mono uppercase mb-2 block tracking-wider">Core Mode (Style Fusion)</label>
        <div className="grid grid-cols-2 gap-2">
          {[CoreMode.SPACE_EXPLORATION, CoreMode.NARRATIVE_STORY, CoreMode.CYBERPUNK, CoreMode.NATURE_DOC].map((mode) => (
            <button
              key={mode}
              onClick={() => setMode(mode)}
              className={`text-xs p-3 text-left border transition-all duration-200 flex items-center space-x-2
                ${currentMode === mode 
                  ? 'border-[#d4b106] text-[#d4b106] bg-[#d4b106]/5' 
                  : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400'
                }`}
            >
              <span className="text-sm">{getModeIcon(mode)}</span>
              <span className="font-mono text-[10px] uppercase">{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="text-gray-600 text-[9px] font-mono uppercase mb-2 block tracking-wider">Scene Description</label>
        <div className="relative group">
            <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="// Describe the shot composition, lighting, and action..."
            className="w-full bg-[#080808] border border-gray-800 text-gray-300 text-xs p-3 font-mono focus:outline-none focus:border-[#d4b106] focus:bg-[#0a0a0a] h-28 resize-none transition-colors"
            />
            <div className="absolute bottom-2 right-2 text-[9px] text-gray-700 pointer-events-none">
                {prompt.length} CHARS
            </div>
        </div>
        {/* Fusion Hint */}
        <div className="mt-2 flex items-center space-x-2 px-1">
            <div className="w-1 h-1 bg-[#d4b106] rounded-full"></div>
            <p className="text-[9px] text-gray-500 font-mono">
                System will fuse main character into scene using {currentMode} style.
            </p>
         </div>
      </div>

      {/* Controls Row - Separated into distinct blocks */}
      <div className="mb-6 space-y-5">
        
        {/* Aspect Ratio */}
        <div>
            <label className="text-gray-600 text-[9px] font-mono uppercase mb-2 block tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-1 bg-[#080808] p-1 border border-gray-800">
            {[AspectRatio.ANAMORPHIC, AspectRatio.WIDESCREEN, AspectRatio.HD, AspectRatio.PORTRAIT, AspectRatio.SQUARE].map((ratio) => (
                <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-2 text-[9px] font-mono transition-colors border border-transparent truncate px-1
                    ${aspectRatio === ratio 
                    ? 'bg-[#1a1a1a] text-[#d4b106] border-gray-700' 
                    : 'bg-transparent text-gray-600 hover:text-gray-400'
                    }`}
                title={ratio}
                >
                {ratio}
                </button>
            ))}
            </div>
        </div>

        {/* Batch Size */}
        <div>
            <label className="text-gray-600 text-[9px] font-mono uppercase mb-2 block tracking-wider">Batch Size (Count)</label>
            <div className="flex gap-2 bg-[#080808] p-1 border border-gray-800">
            {[1, 2, 3, 4].map((count) => (
                <button
                key={count}
                onClick={() => setImageCount(count)}
                className={`flex-1 py-2 text-[10px] font-mono border transition-all uppercase
                    ${imageCount === count 
                    ? 'bg-[#d4b106] border-[#d4b106] text-black font-bold' 
                    : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                    }`}
                >
                {count}
                </button>
            ))}
            </div>
        </div>

        {/* Resolution */}
        <div>
            <label className="text-gray-600 text-[9px] font-mono uppercase mb-2 block tracking-wider">Output Resolution</label>
            <div className="flex gap-2 bg-[#080808] p-1 border border-gray-800">
            {[Resolution.RES_1K, Resolution.RES_2K, Resolution.RES_4K].map((res) => (
                <button
                key={res}
                onClick={() => setResolution(res)}
                className={`flex-1 py-2 text-[10px] font-mono border transition-all uppercase
                    ${resolution === res 
                    ? 'bg-[#d4b106] border-[#d4b106] text-black font-bold' 
                    : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
                    }`}
                >
                {res}
                </button>
            ))}
            </div>
        </div>

      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !prompt}
        className={`w-full py-4 mt-auto uppercase font-mono font-bold tracking-[0.2em] text-xs transition-all duration-300 border relative overflow-hidden group
          ${isGenerating 
            ? 'bg-transparent border-gray-800 text-gray-600 cursor-not-allowed' 
            : 'bg-[#d4b106] border-[#d4b106] text-black hover:bg-[#ffe033] hover:border-[#ffe033]'
          }`}
      >
        <span className="relative z-10">{isGenerating ? `Rendering ${imageCount} Frames...` : 'Render Sequence'}</span>
      </button>

    </div>
  );
};

export default DirectorDeck;
