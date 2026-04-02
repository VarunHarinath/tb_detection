import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AnalysisControls({ selectedImage, isAnalyzing, onRunAnalysis, error }) {
  if (!selectedImage) return null;

  return (
    <div className="mt-6 w-full flex flex-col items-center">
      {error && (
        <div className="mb-4 w-full p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium text-center">
          {error}
        </div>
      )}
      
      <button
        onClick={onRunAnalysis}
        disabled={isAnalyzing}
        className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded shadow-sm text-sm font-semibold text-white bg-accent-clinical hover:bg-sky-700 disabled:opacity-80 transition-colors"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-sky-200" />
            <span className="tracking-wide">Processing Sample...</span>
          </>
        ) : (
          <>
            <span className="tracking-wide">Initiate Analysis</span>
          </>
        )}
      </button>
      
      <div className="mt-4 flex items-center space-x-1.5 text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase font-semibold tracking-wider">Clinical Model Protocol</span>
      </div>
    </div>
  );
}
