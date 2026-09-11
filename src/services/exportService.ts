import { AnalysisResult } from '../types';

/**
 * Service to generate and trigger downloads of JSON and CSV reports
 */

export function downloadJsonReport(analysis: AnalysisResult): void {
  const reportPayload = {
    system: {
      name: 'OCEAN SENTINEL AI',
      version: '2.0.0-SIH2026',
      problemStatementId: '26057',
      organization: 'Ministry of Earth Sciences (MoES) / National Institute of Ocean Technology (NIOT)',
      timestamp: new Date().toISOString(),
      mode: analysis.isDemo ? 'Demo Mode (Simulated AI Analysis)' : 'Production AI Inference',
    },
    analysisSummary: {
      analysisId: analysis.id,
      date: analysis.createdAt,
      sourceImage: analysis.metadata.fileName,
      resolution: analysis.metadata.resolution,
      fileSize: analysis.metadata.fileSize,
      executionTimeMs: analysis.executionTimeMs,
      averageConfidence: `${analysis.averageConfidence}%`,
      highestRiskLevel: analysis.highestRisk,
      totalAnomaliesDetected: analysis.detections.length,
      noiseReductionRatio: analysis.noiseReductionScore,
      contrastEnhancementRatio: analysis.contrastEnhancementRatio,
    },
    sonarTelemetry: {
      surveyId: analysis.metadata.surveyId,
      acousticFrequencyKhz: analysis.metadata.frequencyKhz,
      slantRangeMeters: analysis.metadata.rangeMeters,
      altitudeMeters: analysis.metadata.altitudeMeters,
      vesselSpeedKnots: analysis.metadata.vesselSpeedKnots,
      geotaggingNote: analysis.metadata.location?.available ? 'Real coordinates from EXIF/dataset match' : 'No real GPS data found for this scan — location unavailable.',
      coordinates: analysis.metadata.location?.available ? {
        latitude: analysis.metadata.location.latitude,
        longitude: analysis.metadata.location.longitude,
        source: analysis.metadata.location.source,
      } : null,
    },
    detections: analysis.detections.map((det) => ({
      detectionId: det.id,
      objectClass: det.class,
      confidenceScore: `${det.confidence}%`,
      riskAssessment: det.riskLevel,
      status: det.status,
      description: det.description,
      physicalDimensions: {
        estimatedWidthMeters: det.estimatedWidthMeters,
        estimatedHeightMeters: det.estimatedHeightMeters,
        estimatedAreaSqMeters: det.estimatedAreaSqMeters,
        acousticShadowLengthMeters: det.acousticShadowLengthMeters,
        pixelWidth: det.pixelWidth,
        pixelHeight: det.pixelHeight,
        metersPerPixelScale: det.metersPerPixel,
      },
      boundingBoxPercentage: {
        x: det.x,
        y: det.y,
        width: det.width,
        height: det.height,
      },
      geotag: {
        latitude: det.latitude,
        longitude: det.longitude,
      },
    })),
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(reportPayload, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `${analysis.id}_OCEAN_SENTINEL_REPORT.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function downloadCsvReport(analysis: AnalysisResult): void {
  const headers = [
    'Analysis_ID',
    'Date_UTC',
    'Image_File',
    'Survey_ID',
    'Detection_ID',
    'Object_Type',
    'Confidence_Percent',
    'Risk_Level',
    'Status',
    'Width_Meters',
    'Height_Meters',
    'Area_Sq_Meters',
    'Acoustic_Shadow_Meters',
    'Latitude',
    'Longitude',
    'Location_Zone',
    'AI_Engine_Mode',
  ];

  const rows = analysis.detections.map((d) => [
    `"${analysis.id}"`,
    `"${analysis.createdAt}"`,
    `"${analysis.metadata.fileName}"`,
    `"${d.surveyId}"`,
    `"${d.id}"`,
    `"${d.class}"`,
    d.confidence,
    `"${d.riskLevel}"`,
    `"${d.status}"`,
    d.estimatedWidthMeters,
    d.estimatedHeightMeters,
    d.estimatedAreaSqMeters,
    d.acousticShadowLengthMeters,
    d.latitude,
    d.longitude,
    analysis.metadata.location?.available
      ? `"${analysis.metadata.location.source || 'Geotagged'}"` 
      : '"Location Unavailable"',
    analysis.isDemo ? '"Demo Mode"' : '"Production AI"',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${analysis.id}_DETECTIONS.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Bulk download of all analyses as a master CSV
 */
export function downloadAllAnalysesCsv(analyses: AnalysisResult[]): void {
  const headers = [
    'Analysis_ID',
    'Date_UTC',
    'Image_File',
    'Survey_ID',
    'Total_Detections',
    'Avg_Confidence',
    'Highest_Risk',
    'Status',
    'Resolution',
    'Engine_Mode',
  ];

  const rows = analyses.map((a) => [
    `"${a.id}"`,
    `"${a.createdAt}"`,
    `"${a.metadata.fileName}"`,
    `"${a.metadata.surveyId}"`,
    a.detections.length,
    a.averageConfidence,
    `"${a.highestRisk}"`,
    `"${a.status}"`,
    `"${a.metadata.resolution}"`,
    a.isDemo ? '"Demo Mode"' : '"Production AI"',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OCEAN_SENTINEL_MASTER_LOG_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
