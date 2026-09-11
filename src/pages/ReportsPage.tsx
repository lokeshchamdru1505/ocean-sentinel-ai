import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AnalysisResult } from '../types';
import { downloadJsonReport, downloadCsvReport, downloadAllAnalysesCsv } from '../services/exportService';
import { RiskBadge } from '../components/ui/RiskBadge';
import { DemoModeBadge } from '../components/ui/DemoModeBadge';
import {
  FileSpreadsheet,
  FileCode,
  Download,
  MapPin,
  Search,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { analyses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<AnalysisResult | null>(analyses[0] || null);

  const filtered = analyses.filter(
    (a) =>
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.metadata.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.metadata.surveyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-cyan-400" />
            Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            View, preview, and download analysis reports in JSON and CSV formats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoModeBadge />
          <button
            onClick={() => downloadAllAnalysesCsv(analyses)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Master Mission CSV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Report Selector on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report Index List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-xl border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit']">
                Available Mission Reports ({analyses.length})
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Select to Preview</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by analysis or survey ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-cyan-500/25 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((item) => {
                const isSelected = selectedReport?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedReport(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/60 border-white/5 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-cyan-300">
                        {item.id}
                      </span>
                      <RiskBadge level={item.highestRisk} size="sm" />
                    </div>

                    <div className="text-xs font-medium text-white truncate" title={item.metadata.fileName}>
                      {item.metadata.fileName}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-white/5 pt-1.5">
                      <span>{item.detections.length} Detections</span>
                      <span className="text-emerald-400 font-bold">{item.averageConfidence}% Conf.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Report Dossier Preview */}
        <div className="lg:col-span-7 space-y-4">
          {selectedReport ? (
            <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">
                      Survey: {selectedReport.metadata.surveyId}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">
                    {selectedReport.id}
                  </h3>
                </div>

                {/* Instant Download Buttons for Selected Report */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadJsonReport(selectedReport)}
                    className="px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    title="Download complete JSON document"
                  >
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>Download JSON</span>
                  </button>

                  <button
                    onClick={() => downloadCsvReport(selectedReport)}
                    className="px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    title="Download structured CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Core Telemetry Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Project Title</span>
                  <span className="text-slate-200 font-bold">Ocean Sentinel AI</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Analysis Date</span>
                  <span className="text-slate-200">{selectedReport.createdAt.replace('T', ' ').substring(0, 16)} UTC</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Source Image</span>
                  <span className="text-slate-200 truncate block">{selectedReport.metadata.fileName}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Total Detections</span>
                  <span className="text-cyan-300 font-bold">{selectedReport.detections.length} Targets</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Average Confidence</span>
                  <span className="text-emerald-400 font-bold">{selectedReport.averageConfidence}%</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Highest Risk Level</span>
                  <span className="text-rose-400 font-bold">{selectedReport.highestRisk}</span>
                </div>
              </div>

              {/* Geotagging Summary */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Survey Location:
                  </span>
                  {selectedReport.metadata.location?.available ? (
                    <span className="text-emerald-400 text-[10px] uppercase">
                      Geotagged ({selectedReport.metadata.location.source})
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[10px] uppercase">
                      Location Unavailable
                    </span>
                  )}
                </div>
                {selectedReport.metadata.location?.available ? (
                  <div className="flex flex-wrap gap-4 text-slate-300 pt-1">
                    <span>Lat: {selectedReport.metadata.location.latitude}° N</span>
                    <span>Lon: {selectedReport.metadata.location.longitude}° E</span>
                    <span className="text-slate-400">{selectedReport.metadata.location.locationName || 'Scan Location'}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 text-[11px] pt-0.5">
                    No GPS/geospatial metadata found for this sonar scan.
                  </div>
                )}
              </div>

              {/* Individual Target Table Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-['Outfit'] block">
                  Cataloged Target Detections
                </span>

                <div className="border border-white/5 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Object</th>
                        <th className="p-2.5">Conf.</th>
                        <th className="p-2.5">Risk</th>
                        <th className="p-2.5">Width × Height</th>
                        <th className="p-2.5">Area</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedReport.detections.map((det) => (
                        <tr key={det.id} className="hover:bg-slate-800/30">
                          <td className="p-2.5 font-bold text-cyan-300">{det.id}</td>
                          <td className="p-2.5 text-white">{det.class}</td>
                          <td className="p-2.5 text-emerald-400">{det.confidence}%</td>
                          <td className="p-2.5">
                            <span className="text-[10px] font-bold text-rose-400">{det.riskLevel}</span>
                          </td>
                          <td className="p-2.5 text-slate-300">
                            {det.estimatedWidthMeters}m × {det.estimatedHeightMeters}m
                          </td>
                          <td className="p-2.5 text-slate-300">{det.estimatedAreaSqMeters} m²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View Complete Dossier Link */}
              <div className="pt-2 flex justify-end">
                <Link
                  to={`/results/${selectedReport.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold font-mono"
                >
                  <span>Open Full Visual Results Page</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-xl text-center text-slate-400 text-xs">
              No report selected. Choose an analysis on the left to view and download reports.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
