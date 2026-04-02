import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ExplanationCard({ explanation }) {
  if (!explanation) return null;

  // Format raw AI text in case JSON serialization stripped newlines
  const processedMarkdown = explanation
    .replace(/(\s+)?(\d+\.\s+\*\*)/g, '\n\n$2')
    .replace(/(\s+)?(\d+\.\s+[A-Za-z])/g, '\n\n$2')
    .replace(/(\s+)?(\*\s+[A-Za-z])/g, '\n$2');

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
        <Bot className="w-5 h-5 text-accent-clinical" />
        <span>Review</span>
      </h3>
      
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
      </div>
    </div>
  );
}
