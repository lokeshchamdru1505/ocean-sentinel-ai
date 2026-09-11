import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/ui/RiskBadge';
import {
  History,
  Trash2,
  Eye,
  Search,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  FileCode,
} from 'lucide-react';
import { downloadJsonReport, downloadCsvReport } from '../services/exportService';
import { generateSonarCanvas } from '../utils/sonarImageGenerator';

/** Thumbnail that falls back to a generated sonar canvas when the stored URL is invalid */
function SonarThumbnail({ src, detectionClass }: { src: string; detectionClass?: string }) {
  const [imgSrc, setImgSrc] = useState(() => {
    // If URL is already a placeholder or obviously invalid, skip directly to fallback
    if (!src || src === '__DATA_URL__' || src.startsWith('blob:')) {
      const cls = (detectionClass ?? 'Shipwreck').toLowerCase();
      const type: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris' =
        cls.includes('ghost') || cls.includes('net')
          ? 'ghostnet'
          : cls.includes('pipe')
          ? 'pipeline'
          : cls.includes('debris')
          ? 'debris'
          : 'shipwreck';
      return generateSonarCanvas(type);
    }
    return src;
  });

  const handleError = () => {
    const cls = (detectionClass ?? 'Shipwreck').toLowerCase();
    const type: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris' =
      cls.includes('ghost') || cls.includes('net')
        ? 'ghostnet'
        : cls.includes('pipe')
        ? 'pipeline'
        : cls.includes('debris')
        ? 'debris'
        : 'shipwreck';
    setImgSrc(generateSonarCanvas(type));
  };

  return (
    <img
      src={imgSrc}
      alt="Sonar Thumbnail"
      onError={handleError}
      className="w-14 h-9 object-cover rounded bg-black border border-cyan-500/20"
    />
  );
}

export const AnalysisHistoryPage: React.FC = () => {
  const { analyses, deleteAnalysis, resetAllData, clearAllAnalyses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter analyses
  const filteredAnalyses = analyses.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.surveyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detections.some((d) => d.class.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmId(null);
    // Brief delay for fade-out animation, then delete
    setTimeout(() => {
      deleteAnalysis(id);
      setDeletingId(null);
    }, 200);
  };

  const handleClearAll = () => {
    clearAllAnalyses();
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            Analysis History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All sonar scans and analysis results stored locally.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/upload"
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Scan</span>
          </Link>

          {showClearConfirm ? (
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-rose-300 font-bold">Delete all?</span>
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Delete all analysis records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={resetAllData}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-medium transition-colors"
            title="Reset history to official SIH ground truth dataset"
          >
            Reset Seed Data
          </button>
        </div>
      </div>

      {/* Search & Statistics Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, filename, or object type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="font-mono text-[11px] text-slate-500 flex items-center gap-3">
          <span>Total: <strong className="text-cyan-300">{analyses.length}</strong></span>
          <span>•</span>
          <span>Showing: <strong className="text-white">{filteredAnalyses.length}</strong></span>
        </div>
      </div>

      {/* History Table */}
      {filteredAnalyses.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto my-8">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto opacity-80" />
          <h3 className="text-lg font-bold text-white font-['Outfit']">No Analyses Found</h3>
          <p className="text-xs text-slate-400">
            {searchTerm
              ? `No results matching "${searchTerm}".`
              : 'Your history is empty. Upload a sonar image to get started.'}
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Sonar Scan</span>
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden border-cyan-500/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-cyan-500/20 font-mono">
                <tr>
          <th className="py-3.5 px-4 font-semibold">Preview</th>
                  <th className="py-3.5 px-4 font-semibold">Analysis ID</th>
                  <th className="py-3.5 px-4 font-semibold">Image Name</th>
                  <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                  <th className="py-3.5 px-4 font-semibold">Detections</th>
                  <th className="py-3.5 px-4 font-semibold">Avg. Confidence</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Rating</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAnalyses.map((item) => {
                  const isConfirmingDelete = deleteConfirmId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-all duration-200 group ${
                        deletingId === item.id
                          ? 'opacity-0 scale-95 pointer-events-none'
                          : 'opacity-100'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <SonarThumbnail
                          src={item.originalImageUrl}
                          detectionClass={item.detections?.[0]?.class}
                        />
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                        <Link
                          to={`/results/${item.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {item.id}
                        </Link>
                      </td>

                      <td className="py-3 px-4 text-white font-medium whitespace-nowrap max-w-[180px] truncate" title={item.metadata.fileName}>
                        {item.metadata.fileName}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {item.createdAt.replace('T', ' ').substring(0, 16)} UTC
                      </td>

                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                          {item.detections.length} Anomaly
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {item.averageConfidence}%
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <RiskBadge level={item.highestRisk} size="sm" />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isConfirmingDelete ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-[11px] text-rose-400 font-bold">Confirm?</span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-bold uppercase"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/results/${item.id}`}
                              className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                              title="View Results"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => downloadJsonReport(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-white/10 transition-colors"
                              title="Download JSON Report"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => downloadCsvReport(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-white/10 transition-colors"
                              title="Download CSV Detections"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                              title="Delete from History"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
