
import React, { useState } from 'react';
import AssetBay from './components/AssetBay';
import DirectorDeck from './components/DirectorDeck';
import Lightbox from './components/Lightbox';
import { AspectRatio, CoreMode, Resolution, ReferenceAsset, GeneratedImage } from './types';
import { generateScene } from './services/geminiService';

// Utility for converting file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  // State
  const [assets, setAssets] = useState<ReferenceAsset[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  // Settings
  const [mode, setMode] = useState<CoreMode>(CoreMode.NARRATIVE_STORY);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.ANAMORPHIC);
  const [resolution, setResolution] = useState<Resolution>(Resolution.RES_2K);
  const [imageCount, setImageCount] = useState<number>(1);
  const [prompt, setPrompt] = useState<string>("");
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Asset Handlers
  const handleAssetUpload = async (file: File, type: 'main' | 'auxiliary') => {
    try {
      const base64 = await fileToBase64(file);
      const newAsset: ReferenceAsset = {
        id: crypto.randomUUID(),
        data: base64,
        mimeType: file.type,
        type
      };
      
      setAssets(prev => {
        if (type === 'main') {
          const others = prev.filter(a => a.type !== 'main');
          return [newAsset, ...others];
        } else {
          const currentAux = prev.filter(a => a.type === 'auxiliary');
          if (currentAux.length >= 3) {
             // FIFO replacement for aux slots
             const [, ...rest] = currentAux;
             return [...prev.filter(a => a.type === 'main'), ...rest, newAsset]; 
          }
          return [...prev, newAsset];
        }
      });
    } catch (e) {
      console.error("Asset upload failed", e);
    }
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // API Key Check Logic
  const checkApiKey = async (): Promise<boolean> => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          if (aistudio.openSelectKey) {
            await aistudio.openSelectKey();
            return true;
          }
          return false;
        }
        return true;
      }
      return true;
    } catch (e) {
      console.error("API Key check failed", e);
      return true; 
    }
  };

  // Generation Handler
  const handleGenerate = async () => {
    setError(null);
    
    const keyReady = await checkApiKey();
    if (!keyReady) {
      setError("API Key required.");
      return;
    }

    setIsGenerating(true);

    try {
      // Create an array of promises based on imageCount
      const promises = Array.from({ length: imageCount }, () => 
        generateScene({
          prompt,
          assets,
          aspectRatio,
          resolution,
          mode
        })
      );

      // Execute all requests concurrently
      const results = await Promise.allSettled(promises);

      const newImages: GeneratedImage[] = [];
      const errors: string[] = [];

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          newImages.push({
            id: crypto.randomUUID(),
            url: result.value,
            prompt: `[${mode}] ${prompt}`,
            timestamp: Date.now(),
            ratio: aspectRatio
          });
        } else {
          console.error("Single image generation failed", result.reason);
          errors.push(result.reason?.message || "Unknown error");
        }
      });

      if (newImages.length > 0) {
        setGeneratedImages(prev => [...newImages, ...prev]);
      }

      if (errors.length > 0 && newImages.length === 0) {
        // If all failed, show error
        throw new Error(errors[0]);
      }

    } catch (err: any) {
      console.error(err);
      setError("Generation failed. " + (err.message || ""));
      if (err.message?.includes("API key")) {
         const aistudio = (window as any).aistudio;
         if (aistudio?.openSelectKey) {
            aistudio.openSelectKey();
         }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-[#a0a0a0] font-sans selection:bg-[#d4b106] selection:text-black">
      
      {/* Left Sidebar - Controls */}
      <div className="w-[400px] flex-shrink-0 flex flex-col border-r border-gray-900 bg-[#060606] p-8 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
            <h1 className="text-sm font-bold tracking-[0.2em] text-white">CINEGEN <span className="text-[#d4b106]">DIRECTOR</span></h1>
            <div className="w-2 h-2 bg-[#d4b106] rounded-full animate-pulse"></div>
        </div>

        <AssetBay 
          assets={assets}
          onAssetUpload={handleAssetUpload}
          onAssetRemove={handleRemoveAsset}
        />

        <DirectorDeck 
          currentMode={mode}
          setMode={setMode}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          resolution={resolution}
          setResolution={setResolution}
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          imageCount={imageCount}
          setImageCount={setImageCount}
        />

        {/* Footer Info */}
        <div className="mt-8 pt-6 text-[9px] text-gray-800 font-mono border-t border-gray-900 flex justify-between">
          <p>GEMINI-3-PRO BUILD.8821</p>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>

      {/* Right Content - Visualization */}
      <div className="flex-1 bg-[#030303] p-8 relative flex flex-col">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 pointer-events-none opacity-5" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <Lightbox images={generatedImages} isGenerating={isGenerating} imageCount={imageCount} />
      </div>

    </div>
  );
};

export default App;
