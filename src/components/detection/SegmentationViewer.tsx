import React, { useState, useEffect } from 'react';
import { Detection } from '../../types';
import { Sliders, Layers, Eye } from 'lucide-react';
import { generateSonarCanvas } from '../../utils/sonarImageGenerator';

interface SegmentationViewerProps {
  imageUrl: string;
  detections: Detection[];
}

export const SegmentationViewer: React.FC<SegmentationViewerProps> = ({
  imageUrl,
  detections,
}) => {
  const [opacity, setOpacity] = useState<number>(0.65);
  const [maskColor, setMaskColor] = useState<'cyan' | 'magenta' | 'amber'>('cyan');
  const [showMask, setShowMask] = useState<boolean>(true);
  const [displayUrl, setDisplayUrl] = useState(imageUrl);

  useEffect(() => {
    setDisplayUrl(imageUrl);
  }, [imageUrl]);

  const handleImageError = () => {
    const primaryClass = (detections?.[0]?.class ?? 'Shipwreck').toLowerCase();
    const canvasType: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris' =
      primaryClass.includes('ghost') || primaryClass.includes('net')
        ? 'ghostnet'
        : primaryClass.includes('pipe')
        ? 'pipeline'
        : primaryClass.includes('debris')
        ? 'debris'
        : 'shipwreck';
    setDisplayUrl(generateSonarCanvas(canvasType));
  };

  const colors = {
    cyan: { fill: 'rgba(6, 182, 212, ', stroke: '#22d3ee' },
    magenta: { fill: 'rgba(236, 72, 153, ', stroke: '#f472b6' },
    amber: { fill: 'rgba(245, 158, 11, ', stroke: '#fbbf24' },
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Mask Opacity:</span>
            <span className="font-mono text-cyan-300 font-bold">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Palette:</span>
          </div>
          <div className="flex gap-1.5">
            {(['cyan', 'magenta', 'amber'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setMaskColor(col)}
                className={`px-2 py-0.5 rounded capitalize text-[11px] font-mono border transition-all ${
                  maskColor === col
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowMask(!showMask)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
              showMask
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/80 border-white/10 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showMask ? 'Mask Visible' : 'Mask Hidden'}
          </button>
        </div>
      </div>

      {/* Interactive Canvas / SVG Image Overlay */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center border border-cyan-500/20">
        <img
          src={displayUrl}
          alt="Original Sonar"
          onError={handleImageError}
          className="w-full h-full object-contain max-h-[580px] block"
        />

        {/* SVG Semantic Segmentation Polygon Masks */}
        {showMask && (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200"
            style={{ opacity }}
          >
            {detections.map((det) => {
              // Convert segmentation points or fallback to rounded bounding polygon
              const pointsString = det.segmentationPoints
                ? det.segmentationPoints.map((pt) => `${pt[0]},${pt[1]}`).join(' ')
                : `${det.x},${det.y} ${det.x + det.width},${det.y} ${det.x + det.width},${
                    det.y + det.height
                  } ${det.x},${det.y + det.height}`;

              return (
                <g key={`mask-${det.id}`}>
                  {/* Semantic polygon filled mask */}
                  <polygon
                    points={pointsString}
                    fill={`${colors[maskColor].fill}${opacity})`}
                    stroke={colors[maskColor].stroke}
                    strokeWidth="0.8"
                    strokeDasharray="1.5 1"
                  />
                  {/* Class Text Tag */}
                  <text
                    x={det.x + 1}
                    y={Math.max(4, det.y - 1.5)}
                    fill="#ffffff"
                    fontSize="2.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {det.class} (U-Net Mask)
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-cyan-400/60 inline-block border border-cyan-300" />
          <span>U-Net Anomaly Semantic Segment Boundary</span>
        </div>
        <span>Model Target: Pixel-Level Ground Truth Mask (AI4Shipwrecks Specs)</span>
      </div>
    </div>
  );
};
