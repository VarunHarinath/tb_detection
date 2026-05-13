import React, { useState } from 'react';
import { Bot, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ExplanationCard({ summary, totalDetections, rawDetections = [] }) {
  const [showMetrics, setShowMetrics] = useState(false);

  if (!summary) return null;

  // Format raw AI text in case JSON serialization stripped newlines
  const processedMarkdown = summary
    .replace(/(\s+)?(\d+\.\s+\*\*)/g, '\n\n$2')
    .replace(/(\s+)?(\d+\.\s+[A-Za-z])/g, '\n\n$2')
    .replace(/(\s+)?(\*\s+[A-Za-z])/g, '\n$2');

  let severity = "Negative";
  let severityColor = "bg-green-100 text-green-800 border-green-200";

  if (totalDetections >= 100) {
    severity = "2+ / 3+ (Severe)";
    severityColor = "bg-red-100 text-red-800 border-red-200";
  } else if (totalDetections >= 10) {
    severity = "1+ (Moderate)";
    severityColor = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (totalDetections >= 1) {
    severity = "Scanty (Mild)";
    severityColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2">
          <Bot className="w-5 h-5 text-accent-clinical" />
          <span>Review</span>
        </h3>
      </div>

      <div className={`mb-6 p-4 rounded-lg border ${severityColor} flex flex-col items-center justify-center text-center`}>
        <div className="flex items-center space-x-2 mb-1">
          <AlertCircle className="w-5 h-5" />
          <span className="text-lg font-bold uppercase tracking-wide">{severity}</span>
        </div>
        <p className="text-xs font-semibold opacity-80 uppercase tracking-widest mt-1">
          DEV REFERENCE: {totalDetections} BACILLI DETECTED
        </p>
      </div>
      
      <div className="text-slate-800 leading-relaxed flex-1 overflow-y-auto pr-2">
        <ReactMarkdown
          components={{
            p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-3 space-y-1.5" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 mt-2 font-semibold space-y-1" {...props} />,
            li: ({node, ...props}) => <li className="text-slate-700 font-normal leading-relaxed" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />
          }}
        >
          {processedMarkdown}
        </ReactMarkdown>

        <div className="mt-8 border-t border-slate-200 pt-4">
          <button 
            onClick={() => setShowMetrics(!showMetrics)}
            className="flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            {showMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>View Segmentation Metrics</span>
          </button>
          
          {showMetrics && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm font-mono">
              <h4 className="font-bold uppercase tracking-widest text-slate-700 mb-3 border-b border-slate-200 pb-2">Clustered ROI Breakdown</h4>
              {rawDetections.filter(d => d.count > 1).length === 0 ? (
                <p className="text-slate-500 italic">No clusters required ML segmentation.</p>
              ) : (
                <ul className="space-y-2">
                  {rawDetections.filter(d => d.count > 1).map((d, idx) => (
                    <li key={idx} className="flex flex-col bg-white p-2 border border-slate-200 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-600">Box Coordinates: [{d.bbox.map(n => Math.round(n)).join(', ')}]</span>
                        <span className="font-bold text-accent-clinical bg-blue-50 px-2 py-1 rounded">Extracted Bacilli: {d.count}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex justify-between">
                        <span>Method Used:</span>
                        <span className={`${d.segmentation_method === 'Paper-Based Sauvola' ? 'text-emerald-500' : 'text-orange-400'}`}>
                          {d.segmentation_method || 'Unknown'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
