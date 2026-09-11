import { ObjectType, RiskLevel, ConfidenceLevel } from '../types';

/**
 * Automatically computes risk level based on:
 * 1. Object Type (Shipwrecks, large unknown structures, ghost nets have high navigation/ecological hazard)
 * 2. Confidence Score (Higher confidence = more definite hazard)
 * 3. Dimensions (Larger objects pose greater obstruction hazards)
 */
export function calculateRiskLevel(
  objectType: ObjectType,
  confidence: number,
  estimatedAreaSqMeters: number
): RiskLevel {
  // Ghost nets are severe ecological hazards — HIGH only when strongly confirmed
  if (objectType === 'Ghost Net') {
    if (confidence >= 88) return 'HIGH';
    if (confidence >= 65) return 'MEDIUM';
    return 'LOW';
  }

  if (objectType === 'Shipwreck') {
    // Only truly large, confirmed wrecks are HIGH navigation hazards
    if (estimatedAreaSqMeters > 200 && confidence >= 88) return 'HIGH';
    if (estimatedAreaSqMeters > 50 || confidence >= 80) return 'MEDIUM';
    return 'LOW';
  }

  if (objectType === 'Underwater Pipe') {
    // Uncharted or free-spanning pipes
    if (estimatedAreaSqMeters > 500 && confidence >= 85) return 'HIGH';
    if (confidence >= 75) return 'MEDIUM';
    return 'LOW';
  }

  if (objectType === 'Unknown Anomaly') {
    // Only very large unknown objects with high confidence are HIGH
    if (estimatedAreaSqMeters > 300 && confidence >= 90) return 'HIGH';
    if (estimatedAreaSqMeters > 80 || confidence >= 75) return 'MEDIUM';
    return 'LOW';
  }

  if (objectType === 'Artificial Structure') {
    if (estimatedAreaSqMeters > 200 && confidence >= 85) return 'HIGH';
    if (confidence >= 65) return 'MEDIUM';
    return 'LOW';
  }

  if (objectType === 'Cylindrical Object') {
    // Potential ordnance — HIGH only when very strongly confirmed
    if (confidence >= 92) return 'HIGH';
    if (confidence >= 70) return 'MEDIUM';
    return 'LOW';
  }

  // Marine Debris — mostly MEDIUM/LOW unless very large & confirmed
  if (confidence >= 92 && estimatedAreaSqMeters > 100) return 'HIGH';
  if (confidence >= 70 || estimatedAreaSqMeters > 30) return 'MEDIUM';
  return 'LOW';
}


/**
 * Returns confidence classification based on numerical score (0-100)
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return 'Very High';
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function getConfidenceBadgeColor(level: ConfidenceLevel): string {
  switch (level) {
    case 'Very High':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'High':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'Medium':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Low':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
}

export function getRiskBadgeColor(risk: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (risk) {
    case 'HIGH':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      };
    case 'LOW':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      };
  }
}
