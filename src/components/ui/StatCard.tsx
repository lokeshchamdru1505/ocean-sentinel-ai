import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'blue';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  trend,
  color = 'cyan',
  subtitle,
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  );

  // Counter animation when numeric
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1200;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorThemes = {
    cyan: {
      border: 'border-cyan-500/25 hover:border-cyan-400/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
      glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      accent: 'text-cyan-400',
    },
    emerald: {
      border: 'border-emerald-500/25 hover:border-emerald-400/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      accent: 'text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/25 hover:border-amber-400/50',
      iconBg: 'bg-amber-500/10 text-amber-400',
      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      accent: 'text-amber-400',
    },
    rose: {
      border: 'border-rose-500/25 hover:border-rose-400/50',
      iconBg: 'bg-rose-500/10 text-rose-400',
      glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      accent: 'text-rose-400',
    },
    blue: {
      border: 'border-blue-500/25 hover:border-blue-400/50',
      iconBg: 'bg-blue-500/10 text-blue-400',
      glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      accent: 'text-blue-400',
    },
  }[color];

  return (
    <div
      className={`glass-panel relative overflow-hidden rounded-xl p-5 transition-all duration-300 ${colorThemes.border} ${colorThemes.glow}`}
    >
      {/* Subtle background gradient splash */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 font-mono">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              {displayValue}
            </span>
            {suffix && <span className={`text-xl font-bold ${colorThemes.accent}`}>{suffix}</span>}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-normal">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg border border-white/5 ${colorThemes.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
