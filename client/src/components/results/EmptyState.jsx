import React from 'react';
import { ActivitySquare } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm h-full min-h-[500px]">
      <div className="mb-8 flex space-x-3">
        <div className="w-2 h-14 bg-slate-200 rounded-full"></div>
        <div className="w-2 h-20 bg-slate-200 rounded-full"></div>
        <div className="w-2 h-14 bg-slate-200 rounded-full"></div>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-3">Diagnostic Workspace</h3>
      <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Awaiting Input Source</p>
      
      <div className="max-w-md text-center">
        <p className="text-base text-slate-600 leading-relaxed font-medium">
          Initialize the analysis module by acquiring a sample from the connected local library, PACS relay, or direct optical feed.
        </p>
      </div>

      <div className="mt-14 flex items-center space-x-3 text-sm text-slate-500 font-mono uppercase tracking-widest px-5 py-3 bg-slate-100 rounded-md border border-slate-200">
        <ActivitySquare className="w-5 h-5 text-slate-400" />
        <span className="font-bold">System Ready &middot; Core-v4.2</span>
      </div>
    </div>
  );
}
