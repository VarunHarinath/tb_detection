import React, { useState, useEffect } from 'react';
import { Microscope, LogOut, Info } from 'lucide-react';
import { api } from '../../services/api';

export default function Header({ metadata, onLogout }) {
  const [isOnline, setIsOnline] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      const res = await api.healthCheck();
      if (mounted) {
        setIsOnline(res.status === 'ok');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 3000); // Check every 3 seconds
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
          
          <div className="relative">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`transition-colors p-1 rounded ${showInfo ? 'text-slate-800 bg-slate-100' : 'text-slate-400 hover:text-slate-600'}`} 
              aria-label="System Info"
            >
              <Info className="w-5 h-5" />
            </button>

            {showInfo && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-md shadow-lg border border-slate-200 z-[100] p-4 flex flex-col space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">System Diagnostics</h4>
                <div className="flex flex-col space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold uppercase tracking-wide">Backend URI:</span>
                    <span className="font-mono text-slate-800">127.0.0.1:8000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold uppercase tracking-wide">Inference:</span>
                    <span className="font-mono text-slate-800">/predict</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold uppercase tracking-wide">Polling Rate:</span>
                    <span className="font-mono text-slate-800">3s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-semibold uppercase tracking-wide">Connection:</span>
                    <span className={`font-mono font-bold ${isOnline ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isOnline ? 'ESTABLISHED' : 'DISCONNECTED'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

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
