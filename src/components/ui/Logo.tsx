import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-base font-extrabold tracking-wider',
    lg: 'text-xl font-extrabold tracking-wider',
  };

  return (
    <Link to="/" className="flex items-center gap-3 group select-none">
      {/* Ocean wave + AI circuit + Sonar scanning emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-sky-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] transition-all duration-300`}>
        {/* Radar ping ring */}
        <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-ping opacity-25" />
        
        <svg viewBox="0 0 40 40" className="w-4/5 h-4/5 fill-none" stroke="currentColor">
          {/* Sonar outer ring */}
          <circle cx="20" cy="20" r="16" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" strokeDasharray="2 3" />
          <circle cx="20" cy="20" r="10" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1" />
          
          {/* Ocean wave crest */}
          <path
            d="M8 22 C 12 18, 16 26, 20 22 C 24 18, 28 26, 32 22"
            stroke="#38bdf8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          
          {/* AI Circuit node lines */}
          <path
            d="M20 6 L 20 12 M 20 28 L 20 34 M 6 20 L 12 20 M 28 20 L 34 20"
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Center sonar transducer node */}
          <circle cx="20" cy="20" r="3" fill="#06b6d4" className="animate-pulse" />
          <circle cx="20" cy="20" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} text-white font-['Outfit'] font-black uppercase tracking-wider`}>
            OCEAN <span className="text-cyan-400">SENTINEL</span> <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">AI</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
            Intelligent Underwater Hazard Detection
          </span>
        )}
      </div>
    </Link>
  );
};
