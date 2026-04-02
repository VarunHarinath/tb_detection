import React from 'react';
import { ActivitySquare } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-full min-h-[500px]">
      <div className="mb-6 flex space-x-2">
        <div className="w-1.5 h-12 bg-slate-200 rounded-full"></div>
        <div className="w-1.5 h-16 bg-slate-200 rounded-full"></div>
        <div className="w-1.5 h-12 bg-slate-200 rounded-full"></div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-2">Diagnostic Workspace</h3>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">Awaiting Input Source</p>
      
      <div className="max-w-sm text-center">
        <p className="text-sm text-slate-500 leading-relaxed">
          Initialize the analysis module by acquiring a sample from the connected local library, PACS relay, or direct optical feed.
        </p>
      </div>

      <div className="mt-12 flex items-center space-x-2 text-[10px] text-slate-400 font-mono uppercase tracking-widest px-4 py-2 bg-slate-50 rounded border border-slate-100">
        <ActivitySquare className="w-3.5 h-3.5 text-slate-300" />
        <span>System Ready &middot; TB-Det-v4.2</span>
      </div>
    </div>
  );
}
