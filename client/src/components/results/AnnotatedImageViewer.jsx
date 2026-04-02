import React, { useState } from 'react';
import { ZoomIn, Scaling, Spline, EyeOff } from 'lucide-react';

export default function AnnotatedImageViewer({ originalUrl, annotatedUrl }) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Normalize base64 to ensure it contains the data uri prefix if lacking it
  const formatBase64Url = (b64) => {
    if (!b64) return null;
    return b64.startsWith('data:image') ? b64 : `data:image/jpeg;base64,${b64}`;
  };

  const currentImageUrl = (showOriginal || !annotatedUrl) ? originalUrl : formatBase64Url(annotatedUrl);

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full overflow-hidden">
      {/* Header Toolbar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">Viewport Feed</h3>
        </div>
        <div className="flex space-x-2">
          {annotatedUrl && (
            <button 
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs uppercase font-bold rounded-md transition-colors ${showOriginal ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200 bg-white border border-slate-300 shadow-sm'}`}
              title="Toggle Overlays"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              <EyeOff className="w-4 h-4" />
              <span>Raw Output</span>
            </button>
          )}
          <div className="w-px h-8 bg-slate-300 mx-2"></div>
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
            <Scaling className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors">
            <Spline className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div className="relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Microscopy Target" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-slate-500 text-sm font-bold tracking-widest uppercase">No Visual Feed</div>
        )}
      </div>
      
      {/* Footer Meta */}
      <div className="px-4 py-2 bg-slate-800 text-xs font-bold font-mono text-slate-400 flex justify-between tracking-widest uppercase">
        <div className="flex space-x-6">
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
