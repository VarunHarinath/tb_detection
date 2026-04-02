import React from 'react';

export default function StatusCards({ metadata }) {
  if (!metadata) return null;

  const items = [
    { label: 'Latency', value: metadata.processingTime },
    { label: 'Model', value: metadata.modelVersion.replace('Clinical-Build-', '') },
    { label: 'Ingestion', value: metadata.source }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            {item.label}
          </span>
          <span className="text-base font-bold text-slate-800 tracking-wide truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
