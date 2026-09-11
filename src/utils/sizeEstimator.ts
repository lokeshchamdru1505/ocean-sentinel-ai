/**
 * Side-Scan Sonar Physical Dimension Estimator
 * Real-world acoustic dimension calculations based on pixel scale and slant-range geometry
 */

export interface DimensionCalculation {
  pixelWidth: number;
  pixelHeight: number;
  metersPerPixel: number;
  estimatedWidthMeters: number;
  estimatedHeightMeters: number;
  estimatedAreaSqMeters: number;
  acousticShadowLengthMeters: number;
  estimatedObjectHeightMeters: number; // calculated from acoustic shadow
  formulaDescription: string;
}

export const DIMENSION_DISCLAIMER_TOOLTIP = 
  "Accurate real-world dimensions require sonar scale, towfish altitude, and acoustic resolution metadata.";

/**
 * Calculates physical dimensions from pixel bounding box and scale factor
 * 
 * Formula:
 * width_meters = pixel_width * meters_per_pixel
 * height_meters = pixel_height * meters_per_pixel
 * object_height_m = (towfish_altitude * shadow_length) / (slant_range + shadow_length)
 */
export function calculatePhysicalDimensions(
  pixelWidth: number,
  pixelHeight: number,
  metersPerPixel: number = 0.08, // typical 8cm/pixel for high-res 450kHz SSS
  towfishAltitudeMeters: number = 15.0,
  slantRangeMeters: number = 50.0,
  acousticShadowLengthMeters: number = 4.5
): DimensionCalculation {
  const estimatedWidthMeters = +(pixelWidth * metersPerPixel).toFixed(2);
  const estimatedHeightMeters = +(pixelHeight * metersPerPixel).toFixed(2);
  const estimatedAreaSqMeters = +(estimatedWidthMeters * estimatedHeightMeters).toFixed(2);

  // Acoustic shadow geometry height estimate: H_obj = (Altitude * L_shadow) / Slant_Range
  const estimatedObjectHeightMeters = +(
    (towfishAltitudeMeters * acousticShadowLengthMeters) / slantRangeMeters
  ).toFixed(2);

  return {
    pixelWidth,
    pixelHeight,
    metersPerPixel,
    estimatedWidthMeters,
    estimatedHeightMeters,
    estimatedAreaSqMeters,
    acousticShadowLengthMeters,
    estimatedObjectHeightMeters,
    formulaDescription: `width = ${pixelWidth}px × ${metersPerPixel} m/px = ${estimatedWidthMeters}m | Acoustic Shadow: ${acousticShadowLengthMeters}m`,
  };
}
