import React, { useState, useRef, useEffect } from 'react';
import { Detection } from '../../types';
import { getRiskBadgeColor } from '../../utils/riskCalculator';
import { generateSonarCanvas } from '../../utils/sonarImageGenerator';

interface DetectionOverlayProps {
  imageUrl: string;
  detections: Detection[];
  selectedDetectionId?: string | null;
  onSelectDetection?: (detection: Detection) => void;
  showLabels?: boolean;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({
  imageUrl,
  detections,
  selectedDetectionId,
  onSelectDetection,
  showLabels = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [displayUrl, setDisplayUrl] = useState(imageUrl);
  const [renderedRect, setRenderedRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

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

  // Calculate actual rendered image area inside the container (handling object-fit: contain & max-h constraints)
  const updateRenderedRect = () => {
    if (!containerRef.current || !imgRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgElement = imgRef.current;
    const imgRect = imgElement.getBoundingClientRect();
    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;

    if (
      !naturalWidth ||
      !naturalHeight ||
      imgRect.width === 0 ||
      imgRect.height === 0 ||
      containerRect.width === 0 ||
      containerRect.height === 0
    ) {
      return;
    }

    const imgRatio = naturalWidth / naturalHeight;
    const elementRatio = imgRect.width / imgRect.height;

    let contentWidth = imgRect.width;
    let contentHeight = imgRect.height;
    let contentX = imgRect.left - containerRect.left;
    let contentY = imgRect.top - containerRect.top;

    if (imgRatio > elementRatio) {
      // Letterboxed vertically inside img element box
      contentWidth = imgRect.width;
      contentHeight = imgRect.width / imgRatio;
      contentY += (imgRect.height - contentHeight) / 2;
    } else {
      // Pillarboxed horizontally inside img element box
      contentHeight = imgRect.height;
      contentWidth = imgRect.height * imgRatio;
      contentX += (imgRect.width - contentWidth) / 2;
    }

    setRenderedRect({ x: contentX, y: contentY, width: contentWidth, height: contentHeight });
  };

  useEffect(() => {
    updateRenderedRect();
    const resizeObserver = new ResizeObserver(() => {
      updateRenderedRect();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (imgRef.current) {
      resizeObserver.observe(imgRef.current);
    }
    window.addEventListener('resize', updateRenderedRect);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRenderedRect);
    };
  }, [displayUrl]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] overflow-hidden select-none bg-slate-950 flex items-center justify-center rounded-lg"
    >
      {/* Base Sonar Image */}
      <img
        ref={imgRef}
        src={displayUrl}
        alt="Side-Scan Sonar Acoustic Swath"
        onLoad={updateRenderedRect}
        onError={handleImageError}
        className="w-full h-full object-contain max-h-[640px] block"
      />

      {/* Rendered Image Bounding Box Overlay Layer */}
      {renderedRect.width > 0 && renderedRect.height > 0 && detections.map((det) => {
        const isSelected = selectedDetectionId === det.id;
        const isHovered = hoveredId === det.id;
        const riskStyles = getRiskBadgeColor(det.riskLevel);

        // Calculate scaled position based on exact image coordinates
        const imgNaturalW = det.imageWidth || imgRef.current?.naturalWidth || 800;
        const imgNaturalH = det.imageHeight || imgRef.current?.naturalHeight || 500;

        let boxLeft: number;
        let boxTop: number;
        let boxWidth: number;
        let boxHeight: number;

        if (det.bbox && det.bbox.width > 0 && det.bbox.height > 0) {
          // Precise pixel coordinates from AI model
          boxLeft = renderedRect.x + (det.bbox.x / imgNaturalW) * renderedRect.width;
          boxTop = renderedRect.y + (det.bbox.y / imgNaturalH) * renderedRect.height;
          boxWidth = (det.bbox.width / imgNaturalW) * renderedRect.width;
          boxHeight = (det.bbox.height / imgNaturalH) * renderedRect.height;
        } else {
          // Fallback to percentage coordinates scaled to rendered image
          boxLeft = renderedRect.x + (det.x / 100) * renderedRect.width;
          boxTop = renderedRect.y + (det.y / 100) * renderedRect.height;
          boxWidth = (det.width / 100) * renderedRect.width;
          boxHeight = (det.height / 100) * renderedRect.height;
        }

        // Box border & glow colors
        const boxColor =
          det.riskLevel === 'HIGH'
            ? 'border-rose-500 bg-rose-500/10'
            : det.riskLevel === 'MEDIUM'
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-cyan-400 bg-cyan-400/10';

        const activeGlow = isSelected
          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-[0_0_22px_rgba(6,182,212,0.85)] z-30'
          : isHovered
          ? 'shadow-[0_0_15px_rgba(255,255,255,0.45)] z-20'
          : 'z-10';

        return (
          <div
            key={det.id}
            onClick={() => onSelectDetection && onSelectDetection(det)}
            onMouseEnter={() => setHoveredId(det.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              left: `${boxLeft}px`,
              top: `${boxTop}px`,
              width: `${boxWidth}px`,
              height: `${boxHeight}px`,
            }}
            className={`absolute border-2 transition-all duration-150 cursor-pointer ${boxColor} ${activeGlow}`}
          >
            {/* Reticle Corner Marks */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white pointer-events-none" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white pointer-events-none" />

            {/* Target Label */}
            {showLabels && (
              <div
                className={`absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold whitespace-nowrap shadow-lg backdrop-blur-md transition-transform duration-150 ${
                  isSelected || isHovered
                    ? 'scale-105 bg-slate-900 border border-cyan-400'
                    : 'bg-slate-900/90 border border-white/20'
                }`}
              >
                <span className="text-white">{det.class}</span>
                <span className="text-cyan-300 font-semibold">{det.confidence}%</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${riskStyles.bg} ${riskStyles.text}`}>
                  {det.riskLevel}
                </span>
              </div>
            )}

            {/* Dimension Tag on Hover / Select */}
            {(isSelected || isHovered) && (
              <div className="absolute -bottom-6 left-0 px-1.5 py-0.5 rounded bg-black/85 border border-white/10 text-[9px] font-mono text-slate-300 whitespace-nowrap">
                Est: {det.estimatedWidthMeters}m × {det.estimatedHeightMeters}m ({det.estimatedAreaSqMeters} m²)
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
