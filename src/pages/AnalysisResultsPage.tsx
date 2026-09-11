import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { downloadJsonReport, downloadCsvReport } from '../services/exportService';
import { Detection } from '../types';
import { DetectionOverlay } from '../components/detection/DetectionOverlay';
import { SegmentationViewer } from '../components/detection/SegmentationViewer';
import { generateSonarCanvas } from '../utils/sonarImageGenerator';
import { DetectionDetailPanel } from '../components/detection/DetectionDetailModal';
import { DetectionTable } from '../components/detection/DetectionTable';
import { RiskBadge } from '../components/ui/RiskBadge';
import { ConfidenceGauge } from '../components/ui/ConfidenceGauge';
import {
  CheckCircle2,
  Sliders,
  FileCode,
  FileSpreadsheet,
  Layers,
  Eye,
  MapPin,
  Ruler,
  Compass,
  ArrowLeft,
  Info,
  Radio,
} from 'lucide-react';

export const AnalysisResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Active comparison tab: 'original' | 'preprocessed' | 'overlay' | 'segmentation'
  const [activeTab, setActiveTab] = useState<'overlay' | 'original' | 'preprocessed' | 'segmentation'>('overlay');
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  // Retrieve analysis
  const analysis = id ? analysisService.getResultById(id) : null;

  const fallbackCanvasUrl = useMemo(() => {
    if (!analysis) return '';
    const primaryClass = (analysis.detections?.[0]?.class ?? 'Shipwreck').toLowerCase();
    const canvasType: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris' =
      primaryClass.includes('ghost') || primaryClass.includes('net')
        ? 'ghostnet'
        : primaryClass.includes('pipe')
        ? 'pipeline'
        : primaryClass.includes('debris')
        ? 'debris'
        : 'shipwreck';
    return generateSonarCanvas(canvasType);
  }, [analysis]);

  const effectiveImageUrl = useMemo(() => {
    if (!analysis) return '';
    if (!analysis.originalImageUrl || analysis.originalImageUrl === '__DATA_URL__' || analysis.originalImageUrl.startsWith('blob:')) {
      return fallbackCanvasUrl;
    }
    return analysis.originalImageUrl;
  }, [analysis, fallbackCanvasUrl]);

  if (!analysis) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto my-12 space-y-4 border-rose-500/30">
        <Info className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white font-['Outfit']">Analysis Record Not Found</h3>
        <p className="text-xs text-slate-400">
          The requested sonar analysis identifier ({id}) was not found in local memory or has been purged.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const primaryDetection = analysis.detections[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Analysis Complete
            </span>
            <span className="text-xs font-mono text-cyan-400">
              ID: {analysis.id}
            </span>
            {analysis.modelName && (
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                {analysis.modelName}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
            Sonar Analysis Results
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            File: {analysis.metadata.fileName} • Date: {analysis.createdAt.replace('T', ' ').substring(0, 19)} UTC
          </p>
        </div>

        {/* Action Buttons: Downloads & Map Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => downloadJsonReport(analysis)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1.5"
            title="Download formatted JSON report"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>JSON Report</span>
          </button>

          <button
            onClick={() => downloadCsvReport(analysis)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono tracking-wide transition-all flex items-center gap-1.5"
            title="Download CSV table of detections"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV Report</span>
          </button>

          <Link
            to="/map"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <MapPin className="w-4 h-4" />
            <span>View On Map</span>
          </Link>
        </div>
      </div>

      {/* No Detection Banner if empty */}
      {analysis.detections.length === 0 && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{analysis.noDetectionReason || 'No anomaly detected with sufficient confidence (Threshold: ≥ 50%).'}</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400">Seafloor Clear</span>
        </div>
      )}

      {/* Summary Highlight Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border-cyan-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Detected Objects
          </span>
          <span className="text-xl font-extrabold text-white font-['Outfit'] mt-1 block">
            {analysis.detections.length} {analysis.detections.length === 1 ? 'Target' : 'Targets'}
          </span>
          <div className="mt-2">
            <RiskBadge level={analysis.highestRisk} size="sm" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-cyan-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Confidence
            </span>
            <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
              {analysis.averageConfidence}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {analysis.averageConfidence >= 85 ? 'Very High' : analysis.averageConfidence >= 70 ? 'High' : analysis.averageConfidence >= 50 ? 'Medium' : 'Low'}
            </span>
          </div>
          <ConfidenceGauge score={analysis.averageConfidence} size="sm" showLabel={false} />
        </div>

        <div className="glass-panel p-4 rounded-xl border-cyan-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Primary Target
          </span>
          <span className="text-sm font-bold text-slate-200 font-['Outfit'] mt-1 block truncate">
            {primaryDetection ? primaryDetection.class : 'Seafloor Clear'}
          </span>
          <span className="text-[10px] text-cyan-400/80 font-mono block mt-1">
            {primaryDetection ? `${primaryDetection.confidence}% Conf.` : 'Clean'}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border-cyan-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Processing Time
          </span>
          <span className="text-sm font-bold text-slate-200 font-mono mt-1 block">
            {analysis.executionTimeMs} ms
          </span>
          <span className="text-[10px] text-emerald-400 font-mono block mt-1">Status: Analyzed</span>
        </div>
      </div>

      {/* Interactive Sonar Visualizer & Comparison Tabs */}
      <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 space-y-4">
        {/* Comparison Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-cyan-500/20">
            {[
              { id: 'overlay', label: 'Detection Overlay', icon: Radio },
              { id: 'segmentation', label: 'Segmentation Mask', icon: Layers },
              { id: 'preprocessed', label: 'Preprocessed', icon: Sliders },
              { id: 'original', label: 'Original Sonar', icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span>Swath: {analysis.metadata.resolution}</span>
            <span>•</span>
            <span className="text-cyan-400">{analysis.detections.length} Targets Tagged</span>
          </div>
        </div>

        {/* Visual Swath Canvas Container */}
        <div className="rounded-xl overflow-hidden bg-black/90 border border-cyan-500/20 min-h-[460px] flex items-center justify-center p-2 relative">
          {activeTab === 'overlay' && (
            <DetectionOverlay
              imageUrl={effectiveImageUrl}
              detections={analysis.detections}
              selectedDetectionId={selectedDetection?.id}
              onSelectDetection={(det) => setSelectedDetection(det)}
            />
          )}

          {activeTab === 'segmentation' && (
            <SegmentationViewer
              imageUrl={effectiveImageUrl}
              detections={analysis.detections}
            />
          )}

          {activeTab === 'preprocessed' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={analysis.preprocessedImageUrl && analysis.preprocessedImageUrl !== '__DATA_URL__' && !analysis.preprocessedImageUrl.startsWith('blob:') ? analysis.preprocessedImageUrl : effectiveImageUrl}
                alt="Preprocessed Sonar"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackCanvasUrl; }}
                className="w-full h-full object-contain max-h-[580px]"
              />
              <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-lg bg-black/85 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 space-y-0.5">
                <div>✓ 2D-Adaptive Lee Filter Speckle Attenuation</div>
                <div>✓ CLAHE Dynamic Contrast Equalization Applied</div>
                <div>✓ Acoustic Water Column Nadir Normalized</div>
              </div>
            </div>
          )}

          {activeTab === 'original' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={effectiveImageUrl}
                alt="Original Sonar"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackCanvasUrl; }}
                className="w-full h-full object-contain max-h-[580px]"
              />
              <div className="absolute bottom-3 left-4 px-3 py-1 rounded bg-black/80 border border-white/20 text-[10px] font-mono text-slate-300">
                Raw Dual-Channel Acoustic Waterfall (450 kHz)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detections Tabular Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Detected Objects & Marine Hazards
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Click any row to open details
          </span>
        </div>

        <DetectionTable
          detections={analysis.detections}
          onSelectDetection={(det) => setSelectedDetection(det)}
          selectedId={selectedDetection?.id}
        />
      </div>

      {/* Physical Size Estimation */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
              <Ruler className="w-4 h-4 text-cyan-400" />
              Dimension & Scale Estimation
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Physical dimensions estimated from pixel bounding footprints and acoustic shadow geometry
            </p>
          </div>
          <div className="p-1.5 px-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            Scale Factor: 0.08 m/pixel
          </div>
        </div>

        {/* Summary Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase">Width Formula</span>
            <code className="text-cyan-300 block font-bold">width = pixel_width × m/pixel</code>
            <p className="text-[11px] text-slate-400 font-sans">
              Calculates lateral footprint based on acoustic resolution.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase">Height / Relief</span>
            <code className="text-cyan-300 block font-bold">height = (Altitude × Shadow) / Range</code>
            <p className="text-[11px] text-slate-400 font-sans">
              Estimates vertical relief from acoustic shadow projection.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-white/5 space-y-1.5">
            <span className="text-slate-400 block text-[10px] uppercase">Acoustic Disclaimer</span>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Measurements are estimated values based on standard towfish altitude and nominal slant-range geometry.
            </p>
          </div>
        </div>
      </div>

      {/* Geotagging & Survey Telemetry Section */}
      <div className="glass-panel p-5 rounded-xl border-cyan-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              Location & Survey Information
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {(analysis.metadata.location?.latitude ?? primaryDetection?.latitude) != null &&
            (analysis.metadata.location?.longitude ?? primaryDetection?.longitude) != null && (
              <Link
                to={`/map?lat=${analysis.metadata.location?.latitude ?? primaryDetection?.latitude}&lng=${analysis.metadata.location?.longitude ?? primaryDetection?.longitude}&id=${analysis.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Locate Target on Map →</span>
              </Link>
            )}
            {analysis.metadata.location?.available || primaryDetection?.location?.available ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                Geotagged (Scan Location)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                Location Unavailable
              </span>
            )}
          </div>
        </div>

        {analysis.metadata.location?.available || primaryDetection?.location?.available ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Latitude</span>
              <span className="text-cyan-300 font-bold">
                {analysis.metadata.location?.latitude ?? primaryDetection?.latitude}°
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Longitude</span>
              <span className="text-cyan-300 font-bold">
                {analysis.metadata.location?.longitude ?? primaryDetection?.longitude}°
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Location Source</span>
              <span className="text-slate-200 font-bold capitalize">
                {analysis.metadata.location?.source || primaryDetection?.locationSource || 'Scan Location'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Survey ID</span>
              <span className="text-slate-200 font-bold">{analysis.metadata.surveyId}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-slate-900/80 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center justify-between">
            <span>GPS/geospatial metadata was not found for this sonar scan. No fake location is displayed.</span>
            <span className="text-[10px] text-slate-400">Survey ID: {analysis.metadata.surveyId}</span>
          </div>
        )}
      </div>

      {/* Side Panel Telemetry Drawer for Selected Detection */}
      <DetectionDetailPanel
        detection={selectedDetection}
        onClose={() => setSelectedDetection(null)}
        analysisTime={analysis.createdAt}
      />
    </div>
  );
};
