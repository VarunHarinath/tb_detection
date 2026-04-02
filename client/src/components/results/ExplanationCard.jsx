import React from 'react';
import { Bot, ShieldAlert } from 'lucide-react';

export default function ExplanationCard({ explanation }) {
  if (!explanation) return null;

  return (
    <div className="bg-white rounded border border-slate-200 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2 mb-4">
        <Bot className="w-4 h-4 text-accent-clinical" />
        <span>AI-Assisted Review</span>
      </h3>
      
      <div className="prose prose-sm max-w-none text-slate-700 space-y-4 mb-6 leading-relaxed flex-1">
        <p className="text-sm border-l-2 border-slate-200 pl-4">{explanation}</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded p-4 flex items-start space-x-3 mt-auto">
        <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Clinical Disclaimer</h4>
          <p className="text-[10px] text-slate-500 leading-tight">
            This interpretation provides quantitative decision support. It does not independently establish a patient diagnosis. Pathological confirmation is strictly required by a qualified specialist.
          </p>
        </div>
      </div>
    </div>
  );
}
