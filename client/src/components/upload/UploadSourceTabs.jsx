import React, { useState } from 'react';
import { UploadCloud, Cloud, Microscope } from 'lucide-react';
import FileUploader from './FileUploader';
import CloudSourcePanel from './CloudSourcePanel';
import MicroscopePanel from './MicroscopePanel';

export default function UploadSourceTabs({ onImageSelect }) {
  const [activeTab, setActiveTab] = useState('file');

  const tabs = [
    { id: 'file', label: 'Local Archive', icon: UploadCloud },
    { id: 'cloud', label: 'PACS Relay', icon: Cloud },
    { id: 'microscope', label: 'Live Optical', icon: Microscope },
  ];

  return (
    <div className="flex flex-col w-full h-auto">
      {/* Segmented Control Navigation */}
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-100 rounded-lg border border-slate-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 px-1 rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300/50 ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/70 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 flex-shrink-0 ${isActive ? 'text-accent-clinical' : 'text-slate-400'}`} />
              <span className="text-xs font-bold leading-tight text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col h-auto">
        {activeTab === 'file' && <FileUploader onImageSelect={onImageSelect} />}
        {activeTab === 'cloud' && <CloudSourcePanel onImageSelect={onImageSelect} />}
        {activeTab === 'microscope' && <MicroscopePanel onImageSelect={onImageSelect} />}
      </div>
    </div>
  );
}
