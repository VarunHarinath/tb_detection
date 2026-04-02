import React from 'react';
import { Target, Info, AlertTriangle } from 'lucide-react';

export default function FindingsCard({ results }) {
  if (!results) return null;

  const total = results.total_detections || 0;
  const confs = (results.detections || []).map(d => d.confidence);
  const hasHigh = confs.some(c => c >= 90);
  const hasModerate = confs.some(c => c >= 70 && c < 90);

  const getSeverity = (conf) => {
    if (conf >= 90) return 'High Suspicion';
    if (conf >= 70) return 'Moderate Suspicion';
    return 'Low Suspicion';
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2">
          <Target className="w-5 h-5 text-slate-400" />
          <span>Findings Summary</span>
        </h3>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-md p-5 mb-8">
        <ul className="space-y-3 text-base text-slate-800 font-medium">
          <li className="flex items-start space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></div>
             <span>
               {total > 0 ? `${total} suspicious region${total !== 1 ? 's' : ''} identified` : 'No suspicious regions identified'}
             </span>
          </li>
          <li className="flex items-start space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></div>
             <span>
               {total === 0 
                 ? 'Review may still be required based on clinical context'
                 : hasHigh 
                   ? 'At least one high-suspicion region detected' 
                   : hasModerate
                     ? 'Moderate-level suspicious regions detected'
                     : 'Low-level suspicious regions detected'}
             </span>
          </li>
          {total > 0 && (
            <li className="flex items-start space-x-3 text-sky-800 font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2"></div>
               <span>Clinical review recommended</span>
            </li>
          )}
        </ul>
      </div>

      {total > 0 && (
        <div className="space-y-4 flex-1">
          <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Regional Breakdown</h4>
          {results.detections.map((detection, idx) => {
            const severity = getSeverity(detection.confidence);
            const isHigh = severity === 'High Suspicion';
            
            return (
              <div key={idx} className="flex flex-col p-4 rounded-md bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                {isHigh && <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>}
                
                <div className="mb-2">
                  <span className={`text-base font-bold uppercase tracking-wide ${isHigh ? 'text-slate-900' : 'text-slate-700'}`}>
                    Suspicious Area {idx + 1}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mt-1 mb-2 text-sm font-medium">
                   <span className="text-slate-500 w-20">Severity:</span>
                   <span className={isHigh ? 'text-slate-900 font-bold' : 'text-slate-700'}>{severity}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm font-medium">
                   <span className="text-slate-500 w-20">Status:</span>
                   <span className="text-slate-700">
                     {idx === 0 ? 'Requires clinical review' : 'Additional region for review'}
                   </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
