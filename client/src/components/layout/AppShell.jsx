import React from 'react';
import Header from './Header';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base font-sans text-primary-navy selection:bg-accent-clinical selection:text-white">
      <Header />
      <main className="flex-1 flex flex-col w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
