import React from 'react';
import Header from './Header';

export default function AppShell({ children, metadata, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base font-sans text-primary-navy selection:bg-accent-clinical selection:text-white print:bg-white print:text-black">
      <div className="print:hidden">
        <Header metadata={metadata} onLogout={onLogout} />
      </div>
      <main className="flex-1 flex flex-col w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none print:w-full">
        {children}
      </main>
    </div>
  );
}
