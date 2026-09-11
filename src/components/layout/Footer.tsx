import React from 'react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-cyan-500/15 bg-[#030713] text-slate-500 text-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" />
          <p className="text-[11px] text-slate-600">
            © 2026 Ocean Sentinel AI • Ministry of Earth Sciences & National Institute of Ocean Technology
          </p>
        </div>
      </div>
    </footer>
  );
};
