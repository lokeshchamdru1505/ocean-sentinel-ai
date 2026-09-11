import React from 'react';
import { Detection } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { ConfidenceGauge } from '../ui/ConfidenceGauge';
import { DIMENSION_DISCLAIMER_TOOLTIP } from '../../utils/sizeEstimator';
import {
  X,
  MapPin,
  Maximize2,
  Calendar,
  Compass,
  FileCheck,
  Ruler,
  AlertCircle,
  Hash,
} from 'lucide-react';

interface DetectionDetailPanelProps {
  detection: Detection | null;
  onClose: () => void;
  analysisTime?: string;
}

export const DetectionDetailPanel: React.FC<DetectionDetailPanelProps> = ({
  detection,
  onClose,
  analysisTime = new Date().toISOString(),
}) => {
  if (!detection) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#071126]/95 border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col transition-all duration-300 animate-slideLeft">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase">
              Detection Details
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">{detection.id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content scroll area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Classification and Risk Summary */}
        <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-cyan-500/20">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Classified Target
            </span>
            <h4 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
              {detection.class}
            </h4>
            <div className="mt-2">
              <RiskBadge level={detection.riskLevel} />
            </div>
          </div>
          <div>
            <ConfidenceGauge score={detection.confidence} size="md" />
          </div>
        </div>

        {/* AI Confidence & Inference Status */}
        <div className="glass-panel p-4 rounded-xl space-y-3 border-cyan-500/20 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
              AI Status:
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
              {detection.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              Survey Reference:
            </span>
            <span className="font-mono text-slate-200">{detection.surveyId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Analysis Timestamp:
            </span>
            <span className="font-mono text-slate-200">{analysisTime.replace('T', ' ').substring(0, 19)} UTC</span>
          </div>
        </div>

        {/* Physical Dimension Estimations */}
        <div className="glass-panel p-4 rounded-xl space-y-3 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              Object Size Estimations
            </h5>
            <span className="text-[10px] font-mono text-slate-400">Scale: {detection.metersPerPixel} m/px</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Est. Width</span>
              <span className="text-sm font-bold text-white font-mono">{detection.estimatedWidthMeters} m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Est. Height</span>
              <span className="text-sm font-bold text-white font-mono">{detection.estimatedHeightMeters} m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block font-mono">Footprint Area</span>
              <span className="text-sm font-bold text-white font-mono">{detection.estimatedAreaSqMeters} m²</span>
            </div>
          </div>

          <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p title={DIMENSION_DISCLAIMER_TOOLTIP} className="leading-tight">
              {DIMENSION_DISCLAIMER_TOOLTIP}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 font-mono space-y-1">
            <p>Pixel Footprint: {detection.pixelWidth}px × {detection.pixelHeight}px</p>
            <p>Acoustic Shadow Length: {detection.acousticShadowLengthMeters} meters</p>
          </div>
        </div>

        {/* Geolocation & Coordinates */}
        <div className="glass-panel p-4 rounded-xl space-y-3 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Location
            </h5>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
              Demo Location
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Latitude:
              </span>
              <span className="text-cyan-300 font-bold">{detection.latitude}° N</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Longitude:
              </span>
              <span className="text-cyan-300 font-bold">{detection.longitude}° E</span>
            </div>
          </div>
        </div>

        {/* Acoustic Signature Description */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Target Description
          </span>
          <p className="text-slate-200 leading-relaxed">
            {detection.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cyan-500/20 bg-slate-900/80 flex gap-2">
        <button
          onClick={onClose}
          className="w-full py-2 px-4 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
