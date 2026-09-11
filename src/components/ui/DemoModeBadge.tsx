import React from 'react';
import { Cpu, Info } from 'lucide-react';

interface DemoModeBadgeProps {
  variant?: 'compact' | 'detailed';
}

export const DemoModeBadge: React.FC<DemoModeBadgeProps> = ({ variant = 'compact' }) => {
  if (variant === 'detailed') {
    return (
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-white">DEMO ANALYSIS MODE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[11px] text-cyan-300/80">
            Simulated AI Pipeline • Production PyTorch Model Integration Pending
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      title="Demo Mode: Simulated AI Analysis results until PyTorch U-Net/YOLO models are hooked up."
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-[11px] font-medium text-cyan-300"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span className="font-semibold tracking-wider">DEMO MODE</span>
      <span className="text-cyan-400/60 text-[10px] hidden sm:inline">• AI model integration pending</span>
      <Info className="w-3 h-3 text-cyan-400/70" />
    </div>
  );
};
