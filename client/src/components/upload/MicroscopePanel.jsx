import React, { useState } from 'react';
import { Camera, RefreshCcw, Usb } from 'lucide-react';

export default function MicroscopePanel({ onImageSelect }) {
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, ready
  const [capturing, setCapturing] = useState(false);

  const connect = () => {
    setStatus('connecting');
    setTimeout(() => setStatus('ready'), 1500);
  };

  const capture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      const mockFileObj = {
        name: 'live_acquisition_frame.tiff',
        source: 'microscope',
        previewUrl: 'https://placehold.co/600x400/0f172a/e2e8f0/png?text=Microscope+Feed+Capture'
      };
      if (onImageSelect) onImageSelect(mockFileObj);
    }, 600);
  };

  return (
    <div className="flex flex-col h-auto min-h-[16rem] py-4 border rounded-xl bg-white border-slate-200 shadow-sm px-4 justify-center transition-all">
      {status === 'disconnected' && (
        <div className="flex flex-col items-center">
          <Usb className="w-6 h-6 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Local Instrument</h3>
          <p className="text-[11px] text-slate-500 mb-6 text-center">Initialize USB microscopy feed for real-time analysis</p>
          <button 
            onClick={connect}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 transition-colors shadow-sm"
          >
            Initialize Device
          </button>
        </div>
      )}

      {status === 'connecting' && (
        <div className="flex flex-col items-center text-slate-500">
          <RefreshCcw className="w-5 h-5 animate-spin mb-3 text-slate-400" />
          <p className="text-[11px] font-medium tracking-wide uppercase">Mounting Sensor...</p>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex flex-col items-center w-full">
          {/* Clinical Mock Viewer */}
          <div className="w-full h-36 bg-slate-900 rounded overflow-hidden mb-4 relative flex items-center justify-center border border-slate-300">
            <span className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">Live Optical Feed</span>
            {capturing && <div className="absolute inset-0 bg-white opacity-90 animate-pulse"></div>}
            
            <div className="absolute top-2 left-2 flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              <span className="text-[9px] text-slate-300 font-mono uppercase tracking-wider">Active</span>
            </div>
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
               <div className="w-16 h-16 border border-white rounded-full"></div>
               <div className="absolute w-full h-[1px] bg-white"></div>
               <div className="absolute h-full w-[1px] bg-white"></div>
            </div>
          </div>
          
          <div className="flex w-full items-center justify-between">
            <button 
              onClick={() => setStatus('disconnected')}
              className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider"
            >
              Release
            </button>
            <button 
              onClick={capture}
              disabled={capturing}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-70"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Acquire Frame</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
