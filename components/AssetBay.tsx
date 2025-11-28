
import React, { useRef } from 'react';
import { ReferenceAsset } from '../types';

interface AssetBayProps {
  assets: ReferenceAsset[];
  onAssetUpload: (file: File, type: 'main' | 'auxiliary') => void;
  onAssetRemove: (id: string) => void;
}

const AssetBay: React.FC<AssetBayProps> = ({ assets, onAssetUpload, onAssetRemove }) => {
  const mainInputRef = useRef<HTMLInputElement>(null);
  const auxInputRef = useRef<HTMLInputElement>(null);

  const mainAsset = assets.find(a => a.type === 'main');
  const auxAssets = assets.filter(a => a.type === 'auxiliary');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'auxiliary') => {
    if (e.target.files && e.target.files[0]) {
      onAssetUpload(e.target.files[0], type);
      e.target.value = ''; // Reset
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 border-l-2 border-[#d4b106] pl-3">
        <h2 className="text-[#e5e5e5] text-xs font-mono uppercase tracking-widest">01. Asset Bay (Visual Ref)</h2>
        <span className="text-gray-600 text-[9px] font-mono tracking-tighter">DATA LINKED</span>
      </div>

      <div className="p-0 relative">
        {/* Main Reference Slot */}
        <div 
          className={`w-full aspect-video mb-3 relative flex items-center justify-center cursor-pointer group transition-all duration-300
            ${mainAsset 
              ? 'border-2 border-[#d4b106] bg-[#0a0a0a]' 
              : 'border-2 border-dashed border-gray-700 hover:border-gray-500 bg-[#080808]'
            }`}
          onClick={() => !mainAsset && mainInputRef.current?.click()}
        >
          {mainAsset ? (
            <div className="relative w-full h-full p-1">
              <img src={`data:${mainAsset.mimeType};base64,${mainAsset.data}`} alt="Main Ref" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); onAssetRemove(mainAsset.id); }}
                className="absolute top-2 right-2 bg-black/90 text-white w-5 h-5 flex items-center justify-center text-xs hover:text-[#d4b106]"
              >
                ×
              </button>
              {/* Active Indicator dot */}
              <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-[#d4b106] rounded-full shadow-[0_0_8px_#d4b106]"></div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center space-y-2 opacity-50 group-hover:opacity-80 transition-opacity">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4"></path></svg>
                <p className="text-gray-500 text-[10px] font-mono tracking-wider">MAIN SUBJECT</p>
             </div>
          )}
          <input 
            type="file" 
            ref={mainInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'main')}
          />
        </div>

        {/* Auxiliary Slots */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((idx) => {
            const asset = auxAssets[idx];
            return (
              <div 
                key={idx}
                className={`aspect-[3/4] flex items-center justify-center cursor-pointer group transition-all relative
                 ${asset ? 'border border-gray-600' : 'border border-dashed border-gray-800 hover:border-gray-600 bg-[#080808]'}`}
                onClick={() => !asset && auxInputRef.current?.click()}
              >
                {asset ? (
                   <div className="relative w-full h-full p-[2px]">
                    <img src={`data:${asset.mimeType};base64,${asset.data}`} alt="Aux Ref" className="w-full h-full object-cover opacity-90" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAssetRemove(asset.id); }}
                      className="absolute top-1 right-1 bg-black/90 text-white w-4 h-4 text-[10px] flex items-center justify-center hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-700 text-[10px] group-hover:text-gray-500">AUX {idx + 1}</span>
                )}
              </div>
            );
          })}
        </div>
         <input 
            type="file" 
            ref={auxInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'auxiliary')}
          />
        
        <p className="mt-3 text-[9px] text-gray-600 font-mono leading-tight">
          * Upload main subject to lock character consistency. Use Aux slots for style or details.
        </p>
      </div>
    </div>
  );
};

export default AssetBay;
