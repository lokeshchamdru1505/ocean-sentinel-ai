import React from 'react';
import { RiskLevel } from '../../types';
import { getRiskBadgeColor } from '../../utils/riskCalculator';
import { AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const styles = getRiskBadgeColor(level);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold',
  };

  const icons = {
    HIGH: <AlertOctagon className="w-3.5 h-3.5" />,
    MEDIUM: <AlertTriangle className="w-3.5 h-3.5" />,
    LOW: <ShieldCheck className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border uppercase tracking-wider ${styles.bg} ${styles.text} ${styles.border} ${styles.glow} ${sizeClasses[size]}`}
    >
      {showIcon && icons[level]}
      {level} RISK
    </span>
  );
};
