import { AnalysisResult } from '../types';
import { SAMPLE_PRESETS, generateSonarCanvas } from '../utils/sonarImageGenerator';

const STORAGE_KEY = 'ocean_sentinel_analyses_v2';

/** Placeholder used in localStorage instead of bulky base64 data URLs */
const DATA_URL_PLACEHOLDER = '__DATA_URL__';

/**
 * Strip base64 data URLs and large blob URLs before saving to localStorage
 * to avoid QuotaExceededError (~5 MB browser limit).
 */
function deflateImages(analysis: AnalysisResult): AnalysisResult {
  return {
    ...analysis,
    originalImageUrl:
      analysis.originalImageUrl?.startsWith('data:') ||
      analysis.originalImageUrl?.startsWith('blob:')
        ? DATA_URL_PLACEHOLDER
        : analysis.originalImageUrl,
    preprocessedImageUrl:
      analysis.preprocessedImageUrl?.startsWith('data:') ||
      analysis.preprocessedImageUrl?.startsWith('blob:')
        ? DATA_URL_PLACEHOLDER
        : analysis.preprocessedImageUrl,
  };
}

/**
 * Re-inflate image URLs from preset generators when the stored value is a placeholder or revoked blob.
 */
function inflateImages(analysis: AnalysisResult): AnalysisResult {
  const needsOriginal =
    !analysis.originalImageUrl ||
    analysis.originalImageUrl === DATA_URL_PLACEHOLDER ||
    analysis.originalImageUrl.startsWith('blob:');

  const needsPreprocessed =
    !analysis.preprocessedImageUrl ||
    analysis.preprocessedImageUrl === DATA_URL_PLACEHOLDER ||
    analysis.preprocessedImageUrl.startsWith('blob:');

  if (!needsOriginal && !needsPreprocessed) return analysis;

  // Priority 1: matching preset by surveyId
  const preset = SAMPLE_PRESETS.find(
    (p) => p.surveyId === analysis.metadata.surveyId
  );
  let originalUrl = analysis.originalImageUrl;
  let preprocessedUrl = analysis.preprocessedImageUrl;

  if (preset) {
    const regenerated = preset.generateDataUrl();
    if (needsOriginal) originalUrl = regenerated;
    if (needsPreprocessed) preprocessedUrl = regenerated;
  } else {
    // Priority 2: known SSS-challenge dataset filenames served from public/
    const fileName = analysis.metadata.fileName ?? '';
    const isDatasetFile = /^\d{6}_jpg\.rf\.[0-9a-f]{32}\.jpg$/i.test(fileName);
    if (isDatasetFile) {
      const datasetPublicUrl = `/datasets/side-scan-sonar-object-detection-challenge/valid/images/${fileName}`;
      if (needsOriginal) originalUrl = datasetPublicUrl;
      if (needsPreprocessed) preprocessedUrl = datasetPublicUrl;
    } else {
      // Priority 3: user-uploaded file whose original data URL was stripped or revoked.
      // Regenerate a sonar canvas that matches the primary detected object class
      const primaryClass = (
        analysis.detections?.[0]?.class ?? 'Shipwreck'
      ).toLowerCase();
      const canvasType: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris' =
        primaryClass.includes('ghost') || primaryClass.includes('net')
          ? 'ghostnet'
          : primaryClass.includes('pipe')
          ? 'pipeline'
          : primaryClass.includes('debris')
          ? 'debris'
          : 'shipwreck';
      const regenerated = generateSonarCanvas(canvasType);
      if (needsOriginal) originalUrl = regenerated;
      if (needsPreprocessed) preprocessedUrl = regenerated;
    }
  }

  return {
    ...analysis,
    originalImageUrl: originalUrl,
    preprocessedImageUrl: preprocessedUrl,
  };
}

/**
 * Pre-seeded realistic analyses for immediate high-quality hackathon demonstration
 */
function getInitialSeedAnalyses(): AnalysisResult[] {
  // Generate sample 1 (Shipwreck)
  const img1 = SAMPLE_PRESETS[0].generateDataUrl();
  const img2 = SAMPLE_PRESETS[1].generateDataUrl();
  const img3 = SAMPLE_PRESETS[2].generateDataUrl();

  return [
    {
      id: 'ANALYSIS-2026-001',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      originalImageUrl: img1,
      metadata: {
        fileName: 'NIOT_SSS_BAYOFBENGAL_001.png',
        fileSize: '4.8 MB',
        fileSizeBytes: 5033164,
        resolution: '1920x1080',
        dimensions: { width: 1920, height: 1080 },
        uploadTime: '2026-09-06 14:22:10 UTC',
        frequencyKhz: 450,
        rangeMeters: 75,
        altitudeMeters: 14.5,
        vesselSpeedKnots: 3.6,
        surveyId: 'SURVEY-NIOT-2026-SW01',
        location: {
          available: false,
          latitude: null,
          longitude: null,
          source: null,
          locationName: 'Bay of Bengal, Chennai Offshore (Demo Record)',
        },

      },
      status: 'Completed',
      detections: [
        {
          id: 'DET-SW-01',
          class: 'Shipwreck',
          confidence: 94.6,
          riskLevel: 'HIGH',
          x: 8.0,
          y: 28.0,
          width: 14.0,
          height: 22.0,
          pixelWidth: 269,
          pixelHeight: 238,
          metersPerPixel: 0.08,
          estimatedWidthMeters: 21.5,
          estimatedHeightMeters: 19.0,
          estimatedAreaSqMeters: 408.5,
          latitude: null,
          longitude: null,
          location: {
            available: false,
            latitude: null,
            longitude: null,
            source: null,
            type: 'Scan Location',
          },
          surveyId: 'SURVEY-NIOT-2026-SW01',
          status: 'Confirmed',
          description: 'Large sunken wooden-steel composite vessel hull. Strong broadband backscatter with defined acoustic shadow indicating 6.2m relief above seabed. High navigation hazard.',
          acousticShadowLengthMeters: 16.4,
          segmentationPoints: [
            [9, 30], [15, 28], [22, 32], [22, 48], [16, 50], [8, 44],
          ],
        },
        {
          id: 'DET-DB-02',
          class: 'Marine Debris',
          confidence: 82.4,
          riskLevel: 'MEDIUM',
          x: 64.0,
          y: 68.0,
          width: 7.5,
          height: 8.0,
          pixelWidth: 144,
          pixelHeight: 86,
          metersPerPixel: 0.08,
          estimatedWidthMeters: 11.5,
          estimatedHeightMeters: 6.9,
          estimatedAreaSqMeters: 79.4,
          latitude: null,
          longitude: null,
          location: {
            available: false,
            latitude: null,
            longitude: null,
            source: null,
            type: 'Scan Location',
          },
          surveyId: 'SURVEY-NIOT-2026-SW01',
          status: 'Review Required',
          description: 'Scattered metal structural fragments detached from hull. Diffuse backscatter patch with minor shadow. Potential snare hazard for trawling gear.',
          acousticShadowLengthMeters: 3.2,
          segmentationPoints: [
            [64, 68], [71, 69], [71, 76], [64, 75],
          ],
        },
      ],
      averageConfidence: 88.5,
      highestRisk: 'HIGH',
      noiseReductionScore: '-14.2 dB (Lee Filter)',
      contrastEnhancementRatio: 'CLAHE 2.4x Dynamic Range',
      executionTimeMs: 1480,
      isDemo: true,
      notes: 'Verified against AI4Shipwrecks ground truth dataset characteristics.',
    },
    {
      id: 'ANALYSIS-2026-002',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      originalImageUrl: img2,
      metadata: {
        fileName: 'MOES_SSS_GULFMANNAR_GN03.png',
        fileSize: '3.2 MB',
        fileSizeBytes: 3355443,
        resolution: '1600x900',
        dimensions: { width: 1600, height: 900 },
        uploadTime: '2026-09-05 09:15:32 UTC',
        frequencyKhz: 900,
        rangeMeters: 50,
        altitudeMeters: 10.2,
        vesselSpeedKnots: 2.8,
        surveyId: 'SURVEY-MoES-2026-GN03',
        location: {
          available: false,
          latitude: null,
          longitude: null,
          source: null,
          locationName: 'Gulf of Mannar Marine Biosphere (Demo Record)',
        },

      },
      status: 'Completed',
      detections: [
        {
          id: 'DET-GN-01',
          class: 'Ghost Net',
          confidence: 91.2,
          riskLevel: 'HIGH',
          x: 63.0,
          y: 33.0,
          width: 16.0,
          height: 18.0,
          pixelWidth: 256,
          pixelHeight: 162,
          metersPerPixel: 0.06,
          estimatedWidthMeters: 15.4,
          estimatedHeightMeters: 9.7,
          estimatedAreaSqMeters: 149.4,
          latitude: null,
          longitude: null,
          location: {
            available: false,
            latitude: null,
            longitude: null,
            source: null,
            type: 'Scan Location',
          },
          surveyId: 'SURVEY-MoES-2026-GN03',
          status: 'Confirmed',
          description: 'Synthetic monofilament gillnet cluster draped over biogenic reef outcrop. Diffuse irregular mesh-like backscatter with shadow gap. Extreme ecological hazard to marine megafauna (sea turtles, dugongs).',
          acousticShadowLengthMeters: 8.6,
          segmentationPoints: [
            [63, 35], [72, 33], [79, 40], [76, 51], [65, 50], [63, 43],
          ],
        },
      ],
      averageConfidence: 91.2,
      highestRisk: 'HIGH',
      noiseReductionScore: '-16.8 dB (Wavelet Denoising)',
      contrastEnhancementRatio: 'CLAHE 2.8x Dynamic Range',
      executionTimeMs: 1220,
      isDemo: true,
      notes: 'Priority alert dispatched to Marine Wildlife Rescue Taskforce.',
    },
    {
      id: 'ANALYSIS-2026-003',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      originalImageUrl: img3,
      metadata: {
        fileName: 'NIOT_SSS_MUMBAIHIGH_PL04.png',
        fileSize: '5.1 MB',
        fileSizeBytes: 5347737,
        resolution: '1920x1080',
        dimensions: { width: 1920, height: 1080 },
        uploadTime: '2026-09-04 18:40:11 UTC',
        frequencyKhz: 450,
        rangeMeters: 100,
        altitudeMeters: 18.0,
        vesselSpeedKnots: 4.1,
        surveyId: 'SURVEY-NIOT-2026-PL04',
        location: {
          available: false,
          latitude: null,
          longitude: null,
          source: null,
          locationName: 'Arabian Sea, Mumbai High Corridor (Demo Record)',
        },

      },
      status: 'Completed',
      detections: [
        {
          id: 'DET-PL-01',
          class: 'Underwater Pipe',
          confidence: 88.0,
          riskLevel: 'MEDIUM',
          x: 8.0,
          y: 18.0,
          width: 28.0,
          height: 9.0,
          pixelWidth: 538,
          pixelHeight: 97,
          metersPerPixel: 0.1,
          estimatedWidthMeters: 53.8,
          estimatedHeightMeters: 9.7,
          estimatedAreaSqMeters: 521.9,
          latitude: null,
          longitude: null,
          surveyId: 'SURVEY-NIOT-2026-PL04',
          status: 'Confirmed',
          description: 'Linear exposed subsea transmission line. Narrow bright backscatter return with parallel acoustic shadow. Free-spanning section where seafloor sediment has eroded.',
          acousticShadowLengthMeters: 8.5,
          segmentationPoints: [
            [8, 19], [10, 21], [36, 25], [35, 22],
          ],
        },
        {
          id: 'DET-UA-02',
          class: 'Unknown Anomaly',
          confidence: 76.5,
          riskLevel: 'MEDIUM',
          x: 65.0,
          y: 48.0,
          width: 8.0,
          height: 10.0,
          pixelWidth: 153,
          pixelHeight: 108,
          metersPerPixel: 0.1,
          estimatedWidthMeters: 15.3,
          estimatedHeightMeters: 10.8,
          estimatedAreaSqMeters: 165.2,
          latitude: null,
          longitude: null,
          surveyId: 'SURVEY-NIOT-2026-PL04',
          status: 'Review Required',
          description: 'Anomalous compact acoustic echo near pipeline collar. Does not match known target library signatures. Possible dropped cargo anchor or secondary debris cluster. Flagged for expert review.',
          acousticShadowLengthMeters: 5.2,
          segmentationPoints: [
            [65, 48], [73, 48], [73, 58], [65, 58],
          ],
        },
      ],
      averageConfidence: 82.2,
      highestRisk: 'MEDIUM',
      noiseReductionScore: '-12.5 dB',
      contrastEnhancementRatio: 'CLAHE 2.1x',
      executionTimeMs: 1610,
      isDemo: true,
      notes: 'Requires ROV visual inspection during next maintenance window.',
    },
  ];
}

/** In-memory fallback cache so freshly-analyzed results survive navigation even if localStorage is full */
const memoryCache = new Map<string, AnalysisResult>();

export const storageService = {
  getAllAnalyses(): AnalysisResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const initial = getInitialSeedAnalyses();
        // Save deflated (no base64 blobs) to avoid QuotaExceededError
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial.map(deflateImages)));
        } catch {
          // If even deflated data is too large, skip persisting seed
        }
        return initial;
      }
      const parsed: AnalysisResult[] = JSON.parse(stored);
      // Migrate: re-save deflated to replace any old sessions that stored raw base64
      const hasOldFormat = parsed.some(
        (a) => a.originalImageUrl?.startsWith('data:') || a.originalImageUrl?.startsWith('blob:')
      );
      if (hasOldFormat) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.map(deflateImages)));
        } catch {
          // If migration fails, just continue with current data in memory
        }
      }
      // Inflate from localStorage, then overlay with real image URLs from memoryCache.
      // This ensures freshly-uploaded/analyzed images show the actual uploaded image
      // in the history preview (not a generated fallback canvas).
      return parsed.map((item) => {
        const inflated = inflateImages(item);
        const cached = memoryCache.get(item.id);
        if (
          cached &&
          cached.originalImageUrl &&
          cached.originalImageUrl !== DATA_URL_PLACEHOLDER &&
          !cached.originalImageUrl.startsWith('blob:')
        ) {
          // Use the real data URL from memory cache (the exact uploaded image)
          inflated.originalImageUrl = cached.originalImageUrl;
        }
        return inflated;
      });
    } catch (e) {
      console.warn('Failed to access localStorage, returning initial seed', e);
      // Clear corrupted data and let next call start fresh
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return getInitialSeedAnalyses();
    }
  },

  getAnalysisById(id: string): AnalysisResult | null {
    // Check in-memory cache first (handles the case where localStorage save failed)
    if (memoryCache.has(id)) return inflateImages(memoryCache.get(id)!);
    const list = this.getAllAnalyses();
    return list.find((item) => item.id === id) || null;
  },

  saveAnalysis(analysis: AnalysisResult): void {
    // Always cache in memory so getResultById works even if localStorage fails
    memoryCache.set(analysis.id, analysis);
    try {
      const list = this.getAllAnalyses();
      const existingIndex = list.findIndex((a) => a.id === analysis.id);
      if (existingIndex >= 0) {
        list[existingIndex] = analysis;
      } else {
        list.unshift(analysis);
      }
      // Deflate image blobs before persisting to avoid QuotaExceededError
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map(deflateImages)));
    } catch (e) {
      console.warn('Failed to save analysis to localStorage (memory cache active):', e);
    }
  },

  deleteAnalysis(id: string): boolean {
    // Remove from in-memory cache so it doesn't reappear after refresh
    memoryCache.delete(id);
    const list = this.getAllAnalyses();
    const filtered = list.filter((a) => a.id !== id);
    if (filtered.length !== list.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.map(deflateImages)));
      return true;
    }
    return false;
  },

  resetAllData(): void {
    const initial = getInitialSeedAnalyses();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial.map(deflateImages)));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  clearAllAnalyses(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  },
};
