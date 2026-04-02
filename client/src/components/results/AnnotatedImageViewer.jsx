import React, { useState } from 'react';
import { ZoomIn, Scaling, Wand2, EyeOff, Download, RefreshCcw } from 'lucide-react';

export default function AnnotatedImageViewer({ originalUrl, annotatedUrl }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);

  const resetAll = () => {
    setIsZoomed(false);
    setIsFullscreen(false);
    setIsEnhanced(false);
    setZoomOrigin("center center");
    setShowOriginal(false);
  };

  const handleDownload = () => {
    const targetUrl = (showOriginal || !annotatedUrl) ? originalUrl : formatBase64Url(annotatedUrl);
    if (!targetUrl) return;
    const link = document.createElement("a");
    link.href = targetUrl;
    link.download = `tb_diagnostic_frame_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Normalize base64 to ensure it contains the data uri prefix if lacking it
  const formatBase64Url = (b64) => {
    if (!b64) return null;
    return b64.startsWith('data:image') ? b64 : `data:image/jpeg;base64,${b64}`;
  };

  const currentImageUrl = (showOriginal || !annotatedUrl) ? originalUrl : formatBase64Url(annotatedUrl);

  const containerClasses = isFullscreen 
    ? "fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden shadow-2xl" 
    : "flex flex-col bg-white border border-slate-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full overflow-hidden transition-all duration-300";

  return (
    <div className={containerClasses}>
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
          <button 
            onClick={resetAll}
            className="p-2 rounded-md transition-colors text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Reset All Tools"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={() => {
              setZoomOrigin("center center");
              setIsZoomed(!isZoomed);
            }}
            className={`p-2 rounded-md transition-colors ${isZoomed ? 'text-accent-clinical bg-slate-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            title="Toggle Center Zoom"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-md transition-colors ${isFullscreen ? 'text-accent-clinical bg-slate-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            title="Toggle Fullscreen"
          >
            <Scaling className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsEnhanced(!isEnhanced)}
            className={`p-2 rounded-md transition-colors ${isEnhanced ? 'text-accent-clinical bg-slate-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
            title="Toggle Contrast Enhancement"
          >
            <Wand2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-md transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-200"
            title="Export / Save Frame"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Area */}
      <div 
        className={`relative flex-1 bg-slate-900 flex items-center justify-center overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={(e) => {
          if (!isZoomed) {
            // Target specific coordinate
            const rect = e.target.getBoundingClientRect();
            // Prevent crash if clicking outside the exact img bounds
            if (e.target.tagName !== 'IMG') return;
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin(`${x}% ${y}%`);
            setIsZoomed(true);
          } else {
            setIsZoomed(false);
            // Wait for transition before snapping origin back to avoid jump
            setTimeout(() => setZoomOrigin("center center"), 300);
          }
        }}
      >
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Microscopy Target" 
            style={{ transformOrigin: zoomOrigin }}
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isZoomed ? 'scale-[2.5]' : 'scale-100'} ${isEnhanced ? 'contrast-[1.25] saturate-[1.1] brightness-110' : ''}`}
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
