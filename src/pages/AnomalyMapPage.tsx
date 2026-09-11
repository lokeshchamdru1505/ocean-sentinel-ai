import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { RiskBadge } from '../components/ui/RiskBadge';
import { Filter, Radio, Database, MapPinOff, Trash2, ExternalLink } from 'lucide-react';

// Controller to auto-fly / zoom map when filtered detections or target URL parameters change
function MapFlyController({
  detections,
  targetLat,
  targetLng,
}: {
  detections: Array<{ latitude: number; longitude: number }>;
  targetLat: number | null;
  targetLng: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (targetLat != null && targetLng != null && !isNaN(targetLat) && !isNaN(targetLng)) {
      map.flyTo([targetLat, targetLng], 14, { duration: 1.5 });
      return;
    }

    if (detections.length === 0) return;

    if (detections.length === 1) {
      map.flyTo([detections[0].latitude, detections[0].longitude], 13, { duration: 1.2 });
    } else {
      const bounds = L.latLngBounds(detections.map((d) => [d.latitude, d.longitude]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14, animate: true, duration: 1.2 });
    }
  }, [detections, targetLat, targetLng, map]);

  return null;
}

// Create custom colored pulsing Leaflet DivIcons for each Risk Level
function createHazardIcon(risk: 'HIGH' | 'MEDIUM' | 'LOW') {
  const colors = {
    HIGH: {
      bg: '#f43f5e',
      border: '#fda4af',
      shadow: 'rgba(244, 63, 94, 0.7)',
    },
    MEDIUM: {
      bg: '#f59e0b',
      border: '#fde68a',
      shadow: 'rgba(245, 158, 11, 0.7)',
    },
    LOW: {
      bg: '#10b981',
      border: '#a7f3d0',
      shadow: 'rgba(16, 185, 129, 0.7)',
    },
  }[risk] || {
    bg: '#3b82f6',
    border: '#93c5fd',
    shadow: 'rgba(59, 130, 246, 0.7)',
  };

  return L.divIcon({
    className: 'custom-sonar-marker',
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background-color: ${colors.bg}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${colors.bg}; border: 2px solid ${colors.border}; box-shadow: 0 0 10px ${colors.shadow};"></div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export const AnomalyMapPage: React.FC = () => {
  const { analyses, deleteAnalysis } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawLat = searchParams.get('lat');
  const rawLng = searchParams.get('lng');

  const targetLat = rawLat ? parseFloat(rawLat) : null;
  const targetLng = rawLng ? parseFloat(rawLng) : null;

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  // Flatten all detections across stored missions with valid non-null coordinates ONLY
  const missionDetections = useMemo(() => {
    return analyses.flatMap((analysis) =>
      analysis.detections
        .filter((det) => det.latitude != null && det.longitude != null)
        .map((det) => ({
          id: det.id,
          source: 'MISSION' as const,
          analysisId: analysis.id,
          analysisName: analysis.metadata.fileName,
          surveyId: analysis.metadata.surveyId,
          riskLevel: det.riskLevel,
          class: det.class,
          confidence: det.confidence,
          latitude: det.latitude!,
          longitude: det.longitude!,
          width: det.estimatedWidthMeters,
          height: det.estimatedHeightMeters,
          area: det.estimatedAreaSqMeters,
          imageUrl: analysis.originalImageUrl,
          locationSource: det.locationSource || det.location?.source || analysis.metadata.location?.source || 'Scan Location',
        }))
    );
  }, [analyses]);

  const allMapItems = useMemo(() => {
    return missionDetections;
  }, [missionDetections]);

  // Filter detections based on user selection
  const filteredDetections = useMemo(() => {
    return allMapItems.filter((item) => {
      const matchRisk = selectedRiskFilter === 'ALL' || item.riskLevel === selectedRiskFilter;
      const matchClass = selectedClassFilter === 'ALL' || item.class === selectedClassFilter;
      return matchRisk && matchClass;
    });
  }, [allMapItems, selectedRiskFilter, selectedClassFilter]);

  // Unique object classes for filter dropdown
  const uniqueClasses = useMemo(() => {
    const set = new Set(allMapItems.map((d) => d.class));
    return Array.from(set);
  }, [allMapItems]);

  // Dynamic center: use target position from URL if present; otherwise first real geotagged detection
  const mapCenter: [number, number] = useMemo(() => {
    if (targetLat != null && targetLng != null && !isNaN(targetLat) && !isNaN(targetLng)) {
      return [targetLat, targetLng];
    }
    if (filteredDetections.length > 0) {
      return [filteredDetections[0].latitude, filteredDetections[0].longitude];
    }
    // Neutral world-ocean center — NOT tied to any specific region
    return [20.0, 0.0];
  }, [filteredDetections, targetLat, targetLng]);

  const mapZoom = targetLat != null && targetLng != null ? 14 : filteredDetections.length > 0 ? 13 : 3;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-cyan-400" />
            Real Anomaly Geospatial Map
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Interactive hydrographic map showing geotagged sonar anomalies at their real geographic coordinates.
          </p>
        </div>

        <div className="p-2 px-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-mono text-[11px]">
            Geotagged Targets: <strong>{filteredDetections.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-xl border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter Risk Level:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskFilter(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                  selectedRiskFilter === lvl
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Object Class:</span>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Categories ({allMapItems.length})</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="text-slate-300">Medium Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-300">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Main Leaflet OpenStreetMap Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border-cyan-500/30 shadow-2xl relative">
        <div className="h-[580px] w-full relative z-10">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <MapFlyController detections={filteredDetections} targetLat={targetLat} targetLng={targetLng} />

            {/* Standard OpenStreetMap Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Hazard Markers */}
            {filteredDetections.map((det, idx) => {
              const markerIcon = createHazardIcon(det.riskLevel);

              return (
                <Marker
                  key={`${det.source}-${det.analysisId}-${det.id}-${idx}`}
                  position={[det.latitude, det.longitude]}
                  icon={markerIcon}
                  eventHandlers={{
                    click: () => navigate(`/results/${det.analysisId}`),
                  }}
                  ref={(markerRef) => {
                    if (markerRef && targetLat != null && targetLng != null) {
                      const latDiff = Math.abs(det.latitude - targetLat);
                      const lngDiff = Math.abs(det.longitude - targetLng);
                      if (latDiff < 0.001 && lngDiff < 0.001) {
                        setTimeout(() => markerRef.openPopup(), 400);
                      }
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1.5 space-y-2 font-['Inter'] text-xs min-w-[260px]">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="font-mono font-bold text-cyan-700">{det.id}</span>
                        <RiskBadge level={det.riskLevel} size="sm" />
                      </div>

                      {/* Sonar image thumbnail */}
                      {det.imageUrl && det.imageUrl !== '__DATA_URL__' && !det.imageUrl.startsWith('data:') && (
                        <Link to={`/results/${det.analysisId}`} className="block overflow-hidden rounded border border-slate-300 bg-slate-900 group">
                          <img
                            src={det.imageUrl}
                            alt={`Sonar scan — ${det.class}`}
                            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        </Link>
                      )}

                      <div>
                        <Link to={`/results/${det.analysisId}`} className="font-bold text-slate-900 hover:text-cyan-700 text-sm flex items-center justify-between group">
                          <span>Anomaly: {det.class}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600" />
                        </Link>
                        <div className="text-[11px] text-slate-700 font-mono mt-0.5">
                          Confidence: <span className="text-emerald-700 font-bold">{det.confidence}%</span>
                        </div>
                      </div>

                      <div className="p-2 rounded bg-slate-100 font-mono text-[10px] text-slate-800 space-y-1 border border-slate-300">
                        <div><strong>Scan Location</strong></div>
                        <div>Latitude: {det.latitude.toFixed(6)}°</div>
                        <div>Longitude: {det.longitude.toFixed(6)}°</div>
                        <div>Location Source: {det.locationSource}</div>
                        <div>Survey: {det.surveyId}</div>
                      </div>

                      <div className="pt-1 flex items-center gap-2">
                        <Link
                          to={`/results/${det.analysisId}`}
                          className="flex-1 py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold text-center transition-colors font-mono uppercase shadow-sm block"
                        >
                          View Analysis →
                        </Link>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm(`Are you sure you want to delete anomaly ${det.id} (${det.class}) from the database?`)) {
                              deleteAnalysis(det.analysisId);
                            }
                          }}
                          title="Delete Anomaly Record"
                          className="py-1.5 px-2.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-colors font-mono flex items-center gap-1 shrink-0 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Floating Active Target Count Overlay */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/40 shadow-xl text-xs font-mono text-cyan-300 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Active Map Targets: {filteredDetections.length} Anomalies</span>
        </div>

        {/* Empty State Banner if no geotagged targets */}
        {filteredDetections.length === 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-amber-500/40 text-center space-y-3 shadow-2xl">
              <MapPinOff className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white font-['Outfit']">No geotagged anomalies found</h3>
              <p className="text-xs text-slate-300">
                No real GPS or verified geospatial coordinates were found for the selected risk filter.
              </p>
              <div className="text-[11px] font-mono text-amber-400 bg-amber-950/50 p-2 rounded-lg border border-amber-500/30">
                Simulated, fake, or hardcoded coordinates are never displayed.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


