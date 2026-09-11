import React, { useState } from 'react';
import { Target, Radio } from 'lucide-react';

interface RadarTarget {
  id: string;
  x: number; // percentage from center
  y: number;
  label: string;
  type: string;
  depth: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const SonarRadarHero: React.FC = () => {
  const [activeTarget, setActiveTarget] = useState<RadarTarget | null>(null);

  const targets: RadarTarget[] = [
    { id: 'T-1', x: 28, y: -35, label: 'Shipwreck Echo', type: 'Hull Structure', depth: '44m', risk: 'HIGH' },
    { id: 'T-2', x: -45, y: 22, label: 'Ghost Net Clump', type: 'Synthetic Mesh', depth: '28m', risk: 'HIGH' },
    { id: 'T-3', x: -15, y: -55, label: 'Subsea Conduit', type: 'Pipeline Collar', depth: '62m', risk: 'MEDIUM' },
    { id: 'T-4', x: 50, y: 30, label: 'Debris Cluster', type: 'Metallic Anomaly', depth: '35m', risk: 'LOW' },
  ];

  return (
    <div className="relative w-full max-w-[480px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-sky-600/10 to-teal-500/10 blur-3xl pointer-events-none" />

      {/* Main Sonar Scope Container */}
      <div className="relative w-full h-full rounded-full border-2 border-cyan-500/30 bg-[#061026]/90 p-4 shadow-[0_0_50px_rgba(6,182,212,0.25),inset_0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
        
        {/* Underwater Grid Lines */}
        <div className="absolute inset-0 sonar-grid-bg opacity-30 pointer-events-none" />

        {/* Concentric Sonar Distance Rings */}
        <div className="absolute inset-[10%] rounded-full border border-cyan-500/20" />
        <div className="absolute inset-[25%] rounded-full border border-cyan-500/25" />
        <div className="absolute inset-[40%] rounded-full border border-cyan-500/30" />
        <div className="absolute inset-[55%] rounded-full border border-cyan-500/20" />

        {/* Sonar Ping Wave (Expanding) */}
        <div className="absolute inset-[40%] rounded-full border-2 border-cyan-400 animate-sonar-ping pointer-events-none" />

        {/* Compass Crosshairs */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-cyan-500/20" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-cyan-500/20" />
        
        {/* Slant-range angle lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-cyan-500/10 rotate-45" />
          <div className="w-full h-[1px] bg-cyan-500/10 -rotate-45" />
        </div>

        {/* Radar Rotating Sweep Cone */}
        <div className="absolute inset-0 animate-radar-sweep pointer-events-none">
          <div
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background: 'conic-gradient(from 0deg at 100% 100%, rgba(6, 182, 212, 0.45) 0deg, rgba(6, 182, 212, 0.15) 35deg, transparent 75deg)',
            }}
          />
        </div>

        {/* Center Transducer Vessel Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_#22d3ee] animate-pulse" />
          <div className="absolute -top-6 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
            SURVEY VESSEL
          </div>
        </div>

        {/* Interactive Acoustic Target Blips */}
        {targets.map((tgt) => {
          // calculate px positions relative to center
          const leftPct = 50 + tgt.x;
          const topPct = 50 + tgt.y;

          return (
            <div
              key={tgt.id}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              onMouseEnter={() => setActiveTarget(tgt)}
              onMouseLeave={() => setActiveTarget(null)}
              onClick={() => setActiveTarget(tgt)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
            >
              {/* Target pulse */}
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-150 ${
                  tgt.risk === 'HIGH'
                    ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                    : tgt.risk === 'MEDIUM'
                    ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]'
                    : 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
              </div>

              {/* Quick Label */}
              <div className="absolute left-4 -top-2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/80 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 pointer-events-none group-hover:border-cyan-400">
                {tgt.id}: {tgt.label}
              </div>
            </div>
          );
        })}

        {/* Hover / Active Telemetry Card */}
        {activeTarget && (
          <div className="absolute bottom-4 left-4 right-4 z-40 p-2.5 rounded-lg bg-slate-950/95 border border-cyan-400/50 shadow-2xl backdrop-blur-md animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white">{activeTarget.label}</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  activeTarget.risk === 'HIGH'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {activeTarget.risk} RISK
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Type: {activeTarget.type}</span>
              <span>Seafloor Depth: {activeTarget.depth}</span>
              <span>Acoustic Echo: Verified</span>
            </div>
          </div>
        )}

        {/* Sonar Scope Outer Telemetry Ticks */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/70 font-semibold">
          000° N
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-400/70 font-semibold">
          090° E
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/70 font-semibold">
          180° S
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-400/70 font-semibold">
          270° W
        </div>
      </div>

      {/* Floating Status Indicator */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-lg whitespace-nowrap">
        <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
        <span>SSS CHIRP SCANNER: 450 kHz ACTIVE</span>
      </div>
    </div>
  );
};
