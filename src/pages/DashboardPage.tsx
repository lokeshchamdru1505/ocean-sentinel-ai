import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { RiskBadge } from '../components/ui/RiskBadge';
import {
  Image,
  AlertOctagon,
  ShieldCheck,
  Percent,
  UploadCloud,
  MapPin,
  ArrowRight,
  Eye,
  Filter,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { analyses, resetAllData } = useApp();
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('all');

  // If user selected a specific analysis that was deleted, fallback to 'all'
  const activeSelectedId =
    selectedAnalysisId !== 'all' && !analyses.some((a) => a.id === selectedAnalysisId)
      ? 'all'
      : selectedAnalysisId;

  // Filter analyses based on dropdown choice ('all' or specific ID)
  const displayAnalyses =
    activeSelectedId === 'all'
      ? analyses
      : analyses.filter((a) => a.id === activeSelectedId);

  // Selected single analysis object if not 'all'
  const selectedAnalysis =
    activeSelectedId !== 'all'
      ? analyses.find((a) => a.id === activeSelectedId)
      : null;

  // Aggregate stats dynamically
  const totalAnalyzed = displayAnalyses.length;
  const allDetections = displayAnalyses.flatMap((a) => a.detections);
  const totalDetections = allDetections.length;
  const highRiskCount = allDetections.filter((d) => d.riskLevel === 'HIGH').length;

  // Dynamic average confidence calculation
  const avgConfidence =
    allDetections.length > 0
      ? Math.round(
          allDetections.reduce((acc, d) => acc + d.confidence, 0) / allDetections.length
        )
      : displayAnalyses.length > 0
      ? Math.round(
          displayAnalyses.reduce((acc, a) => acc + a.averageConfidence, 0) /
            displayAnalyses.length
        )
      : 0;

  // Category counts calculation dynamically from active detections
  let shipwreckCount = 0;
  let ghostNetCount = 0;
  let debrisCount = 0;
  let pipeCount = 0;
  let unknownCount = 0;

  allDetections.forEach((d) => {
    const cls = d.class.toLowerCase();
    if (cls.includes('shipwreck')) {
      shipwreckCount++;
    } else if (cls.includes('ghost') || cls.includes('net')) {
      ghostNetCount++;
    } else if (cls.includes('debris')) {
      debrisCount++;
    } else if (cls.includes('pipe') || cls.includes('pipeline')) {
      pipeCount++;
    } else {
      unknownCount++;
    }
  });

  const categoryData = [
    { name: 'Shipwreck', count: shipwreckCount, color: '#06b6d4' },
    { name: 'Ghost Net', count: ghostNetCount, color: '#f43f5e' },
    { name: 'Debris', count: debrisCount, color: '#f59e0b' },
    { name: 'Pipe', count: pipeCount, color: '#10b981' },
    { name: 'Unknown', count: unknownCount, color: '#8b5cf6' },
  ];

  // Dynamic Risk distribution calculation
  const highRiskVal = allDetections.filter((d) => d.riskLevel === 'HIGH').length;
  const medRiskVal = allDetections.filter((d) => d.riskLevel === 'MEDIUM').length;
  const lowRiskVal = allDetections.filter((d) => d.riskLevel === 'LOW').length;

  const rawRiskData = [
    { name: 'High Risk', value: highRiskVal, color: '#f43f5e' },
    { name: 'Medium Risk', value: medRiskVal, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRiskVal, color: '#10b981' },
  ];

  const pieChartData =
    totalDetections > 0
      ? rawRiskData
      : [{ name: 'No Detections', value: 1, color: 'rgba(255,255,255,0.08)' }];

  // Risk percentages calculation
  const highPct = totalDetections > 0 ? Math.round((highRiskVal / totalDetections) * 100) : 0;
  const medPct = totalDetections > 0 ? Math.round((medRiskVal / totalDetections) * 100) : 0;
  const lowPct = totalDetections > 0 ? Math.round((lowRiskVal / totalDetections) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header & Single/All Scope Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time overview of uploaded sonar scans and AI detection statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Analysis View Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 rounded-xl px-3 py-2 shadow-md">
            <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Scope:
            </span>
            <select
              value={activeSelectedId}
              onChange={(e) => setSelectedAnalysisId(e.target.value)}
              className="bg-transparent text-xs text-cyan-200 font-bold focus:outline-none cursor-pointer max-w-[220px] truncate"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                🌐 All Analyses (Aggregate - {analyses.length})
              </option>
              {analyses.map((item) => (
                <option key={item.id} value={item.id} className="bg-slate-900 text-cyan-300">
                  📷 {item.id} ({item.metadata.fileName})
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/upload"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_18px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>
          <Link
            to="/map"
            className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Anomaly Map</span>
          </Link>
        </div>
      </div>

      {/* Selected Single Analysis Active Banner */}
      {selectedAnalysis && (
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium">
              Single Analysis Active:{' '}
              <strong className="text-cyan-300 font-mono">{selectedAnalysis.id}</strong> (
              <span className="text-white font-semibold">{selectedAnalysis.metadata.fileName}</span>)
              — Showing isolated metrics for this scan.
            </span>
          </div>
          <button
            onClick={() => setSelectedAnalysisId('all')}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all shrink-0 self-start sm:self-auto"
          >
            Show All Analyses
          </button>
        </div>
      )}

      {/* Empty Database Banner */}
      {analyses.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">History dataset is currently empty</div>
              <div className="text-slate-400 text-[11px]">
                All dashboard metrics have reset to 0. Upload a sonar image or restore seed data to populate charts.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetAllData}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all text-xs"
            >
              Restore Seed Data
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Images Analyzed"
          value={totalAnalyzed}
          icon={Image}
          color="cyan"
          subtitle={selectedAnalysis ? '1 scan in active view' : `${totalAnalyzed} total scan(s)`}
          trend={analyses.length > 0 ? 'Live database record' : 'No images in history'}
        />
        <StatCard
          title="Anomalies Detected"
          value={totalDetections}
          icon={AlertOctagon}
          color="amber"
          subtitle={selectedAnalysis ? 'Detections in this image' : 'Across active scope'}
          trend={totalDetections > 0 ? `${totalDetections} confirmed targets` : '0 detections'}
        />
        <StatCard
          title="High Risk Objects"
          value={highRiskCount}
          icon={ShieldCheck}
          color="rose"
          subtitle="Navigation & environmental hazards"
          trend={highRiskCount > 0 ? `${highRiskCount} high risk alert(s)` : 'No high risk objects'}
        />
        <StatCard
          title="Average Confidence"
          value={avgConfidence}
          suffix="%"
          icon={Percent}
          color="emerald"
          subtitle="Model accuracy score"
          trend={totalDetections > 0 ? 'Dynamic AI confidence' : 'N/A'}
        />
      </div>

      {/* Dynamic Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Bar Chart: Detection Categories */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">Detection Categories</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAnalysis
                  ? `Object classes found in ${selectedAnalysis.id}`
                  : 'Object types found across active surveys'}
              </p>
            </div>
            {selectedAnalysis && (
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Single Analysis
              </span>
            )}
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -25, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071226',
                    borderColor: 'rgba(6,182,212,0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Risk Distribution */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">Risk Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedAnalysis
                  ? `Hazard severity in ${selectedAnalysis.id}`
                  : 'Hazard severity across active detections'}
              </p>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071226',
                    borderColor: 'rgba(6,182,212,0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center font-mono text-xs">
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/15">
              <span className="text-rose-400 font-bold block text-sm">{highPct}%</span>
              <span className="text-[10px] text-slate-500">High ({highRiskVal})</span>
            </div>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/15">
              <span className="text-amber-400 font-bold block text-sm">{medPct}%</span>
              <span className="text-[10px] text-slate-500">Medium ({medRiskVal})</span>
            </div>
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/15">
              <span className="text-emerald-400 font-bold block text-sm">{lowPct}%</span>
              <span className="text-[10px] text-slate-500">Low ({lowRiskVal})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Analyses List */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white font-['Outfit']">
              {selectedAnalysis ? 'Selected Analysis Item' : 'Recent Analyses'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedAnalysis
                ? `Showing active selection (${selectedAnalysis.id})`
                : 'Latest sonar scans and detection results'}
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {displayAnalyses.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-xs">
            No analyses found in active scope.{' '}
            <Link to="/upload" className="text-cyan-400 hover:underline font-bold">
              Upload your first sonar image.
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {displayAnalyses.slice(0, 5).map((item) => {
              const primaryDetection = item.detections[0];
              const isSelected = item.id === activeSelectedId;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-900/50 border-white/5 hover:border-cyan-500/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.originalImageUrl}
                      alt="Sonar thumbnail"
                      className="w-14 h-10 object-cover rounded bg-black border border-cyan-500/15 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-cyan-300">{item.id}</span>
                        <span className="text-xs text-white font-medium">
                          {primaryDetection ? primaryDetection.class : 'No Detection'}
                        </span>
                        {item.detections.length > 1 && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                            +{item.detections.length - 1} more
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-[280px]">
                        {item.metadata.fileName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                    <button
                      onClick={() => setSelectedAnalysisId(isSelected ? 'all' : item.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-800 text-slate-300 border-white/10 hover:border-cyan-500/30'
                      }`}
                    >
                      {isSelected ? 'Active Scope' : 'Filter View'}
                    </button>
                    <span className="text-emerald-400 font-bold">{item.averageConfidence}%</span>
                    <RiskBadge level={item.highestRisk} size="sm" />
                    <Link
                      to={`/results/${item.id}`}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 transition-colors"
                      title="View Detailed Results"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
