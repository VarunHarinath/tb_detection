import React, { useState, useEffect } from 'react';
import { Microscope, LogOut, Info } from 'lucide-react';
import { api } from '../../services/api';

export default function Header({ metadata, onLogout }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      const res = await api.healthCheck();
      if (mounted) {
        setIsOnline(res.status === 'ok');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000); // Check every 15 seconds
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);
  return (
    <header className="bg-white border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Section */}
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800 p-2 rounded shadow-sm">
            <Microscope className="w-6 h-6 text-slate-100" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight">TB Detection System</h1>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Clinical AI Workstation</span>
          </div>
        </div>

        {/* Global Metadata / Actions */}
        <div className="flex items-center space-x-6">
          {metadata && (
            <div className="hidden md:flex items-center space-x-4 border-r border-slate-200 pr-6 h-8">
              <div className="flex flex-col text-right justify-center">
                <span className="text-sm font-bold text-slate-800 uppercase leading-none">{metadata.doctorId}</span>
                <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mt-1">Provider ID</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            <span className={`text-xs font-bold tracking-wide uppercase ${isOnline ? 'text-slate-600' : 'text-red-600'}`}>
              {isOnline ? 'System Online' : 'System Offline'}
            </span>
          </div>
          
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1" aria-label="System Info">
            <Info className="w-5 h-5" />
          </button>

          {onLogout && (
            <button 
              onClick={onLogout}
              className="flex items-center space-x-1.5 text-slate-500 hover:text-red-600 transition-colors border-l border-slate-200 pl-6 h-8"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wide">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
