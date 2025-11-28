
import React, { useState } from 'react';
import { GeneratedImage } from '../types';

interface LightboxProps {
  images: GeneratedImage[];
  isGenerating?: boolean;
  imageCount?: number;
}

const Lightbox: React.FC<LightboxProps> = ({ images, isGenerating = false, imageCount = 1 }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `CineGen_${img.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 px-1">
        <div className="flex flex-col">
             <h2 className="text-[#e5e5e5] text-sm font-mono uppercase tracking-widest mb-1">03. Immersive Lightbox</h2>
             <span className="text-gray-600 text-[10px] font-mono tracking-wider">REAL-TIME RENDER STREAM</span>
        </div>
        <div className="text-right">
            <span className="text-[#d4b106] text-xs font-mono">{images.length} / ∞</span>
            <span className="text-gray-600 text-[10px] font-mono ml-2 uppercase">Rendered</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pb-10 custom-scrollbar">
        {images.length === 0 && !isGenerating ? (
           <div className="h-full flex flex-col items-center justify-center text-gray-800 border border-dashed border-gray-900 mx-1 bg-[#080808]/50 min-h-[300px]">
            <div className="w-16 h-16 border border-gray-800 flex items-center justify-center mb-4 rounded-full">
              <div className="w-12 h-12 bg-gray-900 rounded-full animate-pulse"></div>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600">Awaiting Render Data</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {/* Loading Skeletons */}
            {isGenerating && Array.from({ length: imageCount }).map((_, idx) => (
               <div key={`skeleton-${idx}`} className="w-full aspect-video bg-[#0a0a0a] border border-gray-800 animate-pulse relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
                  
                  {/* Loading Spinner */}
                  <div className="z-10 flex flex-col items-center space-y-3">
                      <svg className="animate-spin h-8 w-8 text-[#d4b106]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-[10px] text-[#d4b106] font-mono uppercase tracking-widest">Rendering...</span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-4 w-full opacity-30">
                      <div className="h-2 w-1/3 bg-gray-800 mb-2 rounded"></div>
                      <div className="h-2 w-2/3 bg-gray-800 rounded"></div>
                  </div>
               </div>
            ))}

            {/* Generated Images */}
            {images.map((img) => (
              <div 
                key={img.id} 
                className="group relative bg-[#0a0a0a] border border-gray-900 hover:border-[#d4b106] transition-colors duration-300 w-full"
              >
                {/* Image Container */}
                <div className="w-full aspect-video overflow-hidden relative cursor-pointer" onClick={() => setSelectedImage(img)}>
                    <img 
                    src={img.url} 
                    alt={img.prompt} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    
                    {/* Dark Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Top Right Controls */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 z-10">
                         <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                            className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-gray-700 hover:border-[#d4b106] hover:text-[#d4b106] text-white flex items-center justify-center rounded-sm transition-all"
                            title="Fullscreen"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(img); }}
                            className="w-8 h-8 bg-black/50 backdrop-blur-sm border border-gray-700 hover:border-[#d4b106] hover:text-[#d4b106] text-white flex items-center justify-center rounded-sm transition-all"
                            title="Download"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                         </button>
                    </div>

                    {/* Bottom Left Info */}
                    <div className="absolute bottom-0 left-0 p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[9px] bg-[#d4b106] text-black px-1 font-bold">RAW</span>
                            <span className="text-[9px] text-gray-400 font-mono">GEMINI-3-PRO</span>
                        </div>
                        <p className="text-[10px] text-gray-300 line-clamp-2 font-mono leading-relaxed border-l border-[#d4b106] pl-2">
                        {img.prompt}
                        </p>
                    </div>
                </div>
                
                {/* Status Bar under image */}
                <div className="h-1 w-full bg-[#111] flex">
                    <div className="h-full bg-[#d4b106] w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-8 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
           <button 
             onClick={() => setSelectedImage(null)}
             className="absolute top-6 right-6 text-white/50 hover:text-[#d4b106] transition-colors"
           >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
           
           <div className="max-w-full max-h-full relative group" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl border border-gray-800"
              />
              <div className="mt-4 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 font-mono max-w-2xl">{selectedImage.prompt}</p>
                    <div className="flex gap-2 mt-2">
                        <span className="text-[9px] bg-[#222] text-gray-400 px-2 py-0.5 rounded font-mono">{selectedImage.ratio}</span>
                    </div>
                  </div>
                  <button 
                     onClick={() => handleDownload(selectedImage)}
                     className="flex items-center gap-2 bg-[#d4b106] hover:bg-[#ffe033] text-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                     <span>Download</span>
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Lightbox;
