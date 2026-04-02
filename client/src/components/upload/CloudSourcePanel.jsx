import React, { useState } from 'react';
import { Database, Folder, CheckCircle2 } from 'lucide-react';

export default function CloudSourcePanel({ onImageSelect }) {
  const [selectedSource, setSelectedSource] = useState(null);

  const sources = [
    { id: 'pacs', name: 'Hospital PACS', icon: Database },
    { id: 'drive', name: 'Shared Drive Vault', icon: Folder },
  ];

  const handleSelect = (e) => {
    e.preventDefault();
    const mockFileObj = {
      name: 'scan_archive_v2_104.dcm',
      source: 'cloud',
      previewUrl: 'https://placehold.co/600x400/0f172a/e2e8f0/png?text=Remote+Acquisition+Preview'
    };
    if (onImageSelect) onImageSelect(mockFileObj);
  };

  return (
    <div className="flex flex-col h-auto min-h-[16rem] border rounded-xl bg-white border-slate-200 shadow-sm p-4 transition-all">
      {!selectedSource ? (
        <div className="flex flex-col h-full w-full">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Remote Medical Storage</h3>
            <p className="text-[11px] text-slate-500">Select an approved clinical repository</p>
          </div>
          <div className="flex-1 space-y-2">
            {sources.map(source => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className="w-full flex items-center justify-between p-2.5 rounded border border-slate-200 hover:border-accent-clinical hover:bg-slate-50 transition-all text-left group"
              >
                <div className="flex items-center space-x-3">
                  <source.icon className="w-4 h-4 text-slate-400 group-hover:text-accent-clinical" />
                  <span className="font-medium text-slate-700 text-xs">{source.name}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-accent-clinical uppercase tracking-wider">Connect</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Connection Established</h3>
          <p className="text-[11px] text-slate-500 mb-6 text-center">Protocol secure. Directory mounted for acquisition.</p>
          
          <button 
            onClick={handleSelect}
            className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-50 transition-colors shadow-sm"
          >
            Import Sample Record
          </button>
          <button
            onClick={() => setSelectedSource(null)}
            className="mt-4 text-[10px] uppercase tracking-wider text-slate-400 hover:text-slate-600 font-semibold"
          >
            Terminate Session
          </button>
        </div>
      )}
    </div>
  );
}
