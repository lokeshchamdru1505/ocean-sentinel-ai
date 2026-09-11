import React from 'react';
import { Link } from 'react-router-dom';
import { Detection } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { Eye, MapPin, AlertTriangle } from 'lucide-react';

interface DetectionTableProps {
  detections: Detection[];
  onSelectDetection: (det: Detection) => void;
  selectedId?: string | null;
}

export const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  onSelectDetection,
  selectedId,
}) => {
  if (detections.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-xl text-center">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-70" />
        <p className="text-slate-300 font-medium">No acoustic anomalies detected in this swath.</p>
        <p className="text-xs text-slate-500 mt-1">Seafloor appears clear of synthetic anthropogenic debris.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden border-cyan-500/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-cyan-500/20 font-mono">
            <tr>
              <th className="py-3.5 px-4 font-semibold">ID</th>
              <th className="py-3.5 px-4 font-semibold">Object Type</th>
              <th className="py-3.5 px-4 font-semibold">Confidence</th>
              <th className="py-3.5 px-4 font-semibold">Risk</th>
              <th className="py-3.5 px-4 font-semibold">Size</th>
              <th className="py-3.5 px-4 font-semibold">Location</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {detections.map((det) => {
              const isSelected = selectedId === det.id;

              return (
                <tr
                  key={det.id}
                  onClick={() => onSelectDetection(det)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-cyan-500/15' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                    {det.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                    {det.class}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{det.confidence}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            det.confidence >= 90
                              ? 'bg-emerald-400'
                              : det.confidence >= 75
                              ? 'bg-cyan-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${det.confidence}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <RiskBadge level={det.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {det.estimatedWidthMeters}m × {det.estimatedHeightMeters}m
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {det.latitude != null && det.longitude != null ? (
                      <Link
                        to={`/map?lat=${det.latitude}&lng=${det.longitude}&id=${det.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 font-mono text-[11px] text-cyan-300 hover:text-cyan-100 transition-colors shadow-sm group"
                        title="Focus and view exact location on Hydrographic Map"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                        <span>{det.latitude.toFixed(4)}°, {det.longitude.toFixed(4)}°</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 italic">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span>No GPS data</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDetection(det);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
