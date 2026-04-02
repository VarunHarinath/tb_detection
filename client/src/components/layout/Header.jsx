import React from 'react';
import { Microscope, Info } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 p-1.5 rounded shadow-sm">
            <Microscope className="w-5 h-5 text-slate-100" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-900 leading-tight tracking-tight">TB Detection System</h1>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Clinical AI Workstation</span>
          </div>
        </div>

        {/* Status / Actions */}
        <div className="flex items-center space-x-5">
          <div className="text-[11px] font-medium text-slate-400 hidden sm:block border-r border-slate-200 pr-5">
            Workstation ID: <span className="text-slate-600">TB-DX-01</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-600">System Online</span>
          </div>
          
          <button className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="System Info">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
