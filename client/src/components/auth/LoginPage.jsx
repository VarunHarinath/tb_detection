import React, { useState } from 'react';
import { Microscope, Lock } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(doctorId.trim()) {
      onLogin(doctorId.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200 p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-slate-800 p-3.5 rounded shadow-sm mb-5">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 text-center tracking-tight">TB Detection System</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Clinical AI Workstation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Clinician ID</label>
            <input 
              type="text" 
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-clinical focus:border-transparent transition-shadow" 
              placeholder="e.g. DR-1042" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Secure Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-clinical focus:border-transparent transition-shadow" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-8 flex justify-center items-center py-3.5 px-4 rounded shadow-sm text-base font-bold text-white bg-accent-clinical hover:bg-sky-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-200 flex items-start space-x-3 text-slate-500 bg-slate-50 p-4 rounded-b-xl -mx-10 -mb-10">
          <Lock className="w-5 h-5 flex-shrink-0 text-slate-400" />
          <p className="text-sm font-semibold leading-snug">
            AUTHORIZED CLINICAL PERSONNEL ONLY. Interactions are recorded and securely monitored under medical access compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
