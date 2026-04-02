import React from 'react';

export default function StatusCards({ metadata }) {
  if (!metadata) return null;

  const items = [
    { label: 'Inference Latency', value: metadata.processingTime },
    { label: 'Model Version', value: metadata.modelVersion },
    { label: 'Ingestion Source', value: metadata.source }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded border border-slate-200 p-3 flex flex-col shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {item.label}
          </span>
          <span className="text-xs font-semibold text-slate-800 font-mono tracking-tight truncate">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
