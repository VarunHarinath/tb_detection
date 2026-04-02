import React, { useState } from 'react';
import { UploadCloud, Cloud, Microscope } from 'lucide-react';
import FileUploader from './FileUploader';
import CloudSourcePanel from './CloudSourcePanel';
import MicroscopePanel from './MicroscopePanel';

export default function UploadSourceTabs({ onImageSelect }) {
  const [activeTab, setActiveTab] = useState('file');

  const tabs = [
    { id: 'file', label: 'Local File', icon: UploadCloud },
    { id: 'cloud', label: 'PACS / Cloud', icon: Cloud },
    { id: 'microscope', label: 'Microscope', icon: Microscope },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Segmented Control Navigation */}
      <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center space-x-2 rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'file' && <FileUploader onImageSelect={onImageSelect} />}
        {activeTab === 'cloud' && <CloudSourcePanel onImageSelect={onImageSelect} />}
        {activeTab === 'microscope' && <MicroscopePanel onImageSelect={onImageSelect} />}
      </div>
    </div>
  );
}
