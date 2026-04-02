import React, { useState } from 'react';
import { Crosshair, ZoomIn, Scaling, Spline, EyeOff } from 'lucide-react';

export default function AnnotatedImageViewer({ imageUrl, detections }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded shadow-sm h-full overflow-hidden">
      {/* Header Toolbar */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <h3 className="text-xs font-bold text-slate-700 tracking-wide uppercase">Viewport Alpha</h3>
        </div>
        <div className="flex space-x-1">
          <button 
            className={`flex items-center space-x-1 px-2 py-1 text-[10px] uppercase font-semibold rounded transition-colors ${showOriginal ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200 bg-slate-100'}`}
            title="Toggle Overlays"
            onClick={() => setShowOriginal(!showOriginal)}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Raw</span>
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button className="p-1 px-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-1 px-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors">
            <Scaling className="w-4 h-4" />
          </button>
          <button className="p-1 px-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors">
            <Spline className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Microscopy Target" 
          className={`max-w-full max-h-full object-contain mix-blend-screen opacity-90 ${showOriginal ? '' : 'brightness-110 contrast-125'}`}
        />
        
        {/* Mock Overlays mapped theoretically */}
        {!showOriginal && detections?.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Crosshair className="absolute w-full h-full text-white opacity-5 scale-150" strokeWidth={0.5} />
            <div className="relative w-full h-full max-w-[400px] max-h-[300px]">
              <div className="absolute top-[25%] left-[35%] w-[45px] h-[55px] border border-sky-400 rounded-sm shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <span className="absolute -top-4 -left-px text-[9px] text-sky-400 bg-slate-900 px-1 border border-sky-400/50 font-mono tracking-widest rounded-sm">R1: 98%</span>
              </div>
              <div className="absolute top-[50%] left-[55%] w-[35px] h-[35px] border border-indigo-400 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                <span className="absolute -top-4 -left-px text-[9px] text-indigo-400 bg-slate-900 px-1 border border-indigo-400/50 font-mono tracking-widest rounded-sm">R2: 85%</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Meta */}
      <div className="px-3 py-1.5 bg-slate-800 text-[10px] font-mono text-slate-400 flex justify-between tracking-widest uppercase">
        <div className="flex space-x-4">
          <span>MAG: 100x</span>
          <span>FOV: 0.1mm</span>
        </div>
        <div>
          <span>Z: 0.0</span>
        </div>
      </div>
    </div>
  );
}
