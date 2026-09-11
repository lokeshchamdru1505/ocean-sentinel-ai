export type ObjectType = 
  | 'Shipwreck'
  | 'Ghost Net'
  | 'Marine Debris'
  | 'Underwater Pipe'
  | 'Cylindrical Object'
  | 'Artificial Structure'
  | 'Unknown Anomaly';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ConfidenceLevel = 'Very High' | 'High' | 'Medium' | 'Low';

export type AnalysisStatus = 'Completed' | 'Processing' | 'Failed';

export interface LocationInfo {
  available: boolean;
  latitude: number | null;
  longitude: number | null;
  source: 'exif' | 'sonar_metadata' | 'dataset_match' | null;
  locationName?: string;
  type?: 'Scan Location' | 'Object GPS';
}

export interface Detection {
  id: string;
  class: ObjectType;
  confidence: number;
  riskLevel: RiskLevel;
  // Bounding box as percentages (0 to 100) relative to image
  x: number;
  y: number;
  width: number;
  height: number;
  // Explicit pixel bounding box from AI backend / model
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  imageWidth?: number;
  imageHeight?: number;
  // Pixel and physical estimations
  pixelWidth: number;
  pixelHeight: number;
  metersPerPixel: number;
  estimatedWidthMeters: number;
  estimatedHeightMeters: number;
  estimatedAreaSqMeters: number;
  // Geotagging (real coordinates or null if unavailable)
  latitude: number | null;
  longitude: number | null;
  location?: LocationInfo;
  locationSource?: string;
  surveyId: string;
  status: 'Confirmed' | 'Review Required' | 'Flagged';
  description: string;
  acousticShadowLengthMeters: number;
  // Segmentation coordinates points for polygon mask
  segmentationPoints?: [number, number][];
}

export interface SonarMetadata {
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  resolution: string;
  dimensions: { width: number; height: number };
  uploadTime: string;
  frequencyKhz: number;
  rangeMeters: number;
  altitudeMeters: number;
  vesselSpeedKnots: number;
  surveyId: string;
  location: LocationInfo;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  originalImageUrl: string;
  preprocessedImageUrl?: string;
  metadata: SonarMetadata;
  status: AnalysisStatus;
  detections: Detection[];
  averageConfidence: number;
  highestRisk: RiskLevel;
  noiseReductionScore: string;
  contrastEnhancementRatio: string;
  executionTimeMs: number;
  isDemo: boolean;
  aiConnected?: boolean;
  modelName?: string;
  noDetectionReason?: string;
  notes?: string;
}

export interface AppSettings {
  demoMode: boolean;
  animationsEnabled: boolean;
  theme: 'deep-ocean' | 'navy' | 'radar-cyan';
  autoProcessOnUpload: boolean;
  confidenceThreshold: number;
  highRiskAlerts: boolean;
}

export interface SystemEngineStatus {
  aiAnalysisEngine: 'Ready' | 'Busy' | 'Operational (Demo)';
  noiseFiltering: 'Ready' | 'Standby';
  reportGeneration: 'Ready';
  mapEngine: 'Ready';
  modelType: string;
  pendingIntegration: boolean;
}
