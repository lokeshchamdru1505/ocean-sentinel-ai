import React from 'react';
import { getConfidenceLevel, getConfidenceBadgeColor } from '../../utils/riskCalculator';

interface ConfidenceGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const level = getConfidenceLevel(score);
  const badgeClass = getConfidenceBadgeColor(level);

  // SVG dimensions
  const dims = {
    sm: { size: 54, stroke: 4, font: 'text-xs' },
    md: { size: 84, stroke: 6, font: 'text-lg' },
    lg: { size: 120, stroke: 8, font: 'text-2xl' },
  }[size];

  const radius = (dims.size - dims.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Arc stroke color
  const strokeColor =
    score >= 90
      ? '#10b981' // emerald
      : score >= 75
      ? '#06b6d4' // cyan
      : score >= 50
      ? '#f59e0b' // amber
      : '#f43f5e'; // rose

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: dims.size, height: dims.size }}>
        <svg className="transform -rotate-90" width={dims.size} height={dims.size}>
          {/* Background track */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={dims.stroke}
            fill="transparent"
          />
          {/* Progress stroke */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`font-mono font-bold text-white ${dims.font}`}>
            {score}%
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass}`}
          >
            {level} Confidence
          </span>
        </div>
      )}
    </div>
  );
};
