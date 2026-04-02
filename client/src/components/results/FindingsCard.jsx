import React from 'react';
import { Target, Info } from 'lucide-react';

export default function FindingsCard({ results }) {
  if (!results) return null;

  return (
    <div className="bg-white rounded border border-slate-200 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center space-x-2">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <span>Detections Summary</span>
        </h3>
        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 tracking-wider">
          {results.detections.length} Suspicious Regions
        </span>
      </div>

      <div className="space-y-2">
        {results.detections.map((detection, idx) => (
          <div key={idx} className="flex flex-col p-3 rounded bg-slate-50 border border-slate-100 group hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-xs font-semibold text-slate-800">{detection.label}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 tracking-wider">
                CONF: {detection.confidence}%
              </span>
            </div>
            <div className="flex items-start space-x-1.5">
              <Info className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-500 leading-snug">{detection.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
