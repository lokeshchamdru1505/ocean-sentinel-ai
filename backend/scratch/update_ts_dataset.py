from pathlib import Path

csv_p = Path("public/datasets/side-scan-sonar-object-detection-challenge/sss_dataset_with_location.csv")
ts_p = Path("src/services/sideScanSonarDataset.ts")

csv_text = csv_p.read_text(encoding="utf-8").strip()

ts_code = f"""export interface SideScanRecord {{
  imageId: string;
  imageUrl: string;
  className: string;
  classId: number | null;
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  latitude: number | null;
  longitude: number | null;
  heading: number;
  timestamp: string;
  locationSource: string;
  hasObject: boolean;
}}

// Raw CSV Data content embedded/parsed for client side performance
const CSV_DATA = `{csv_text}`;

export function parseSideScanDataset(): SideScanRecord[] {{
  const lines = CSV_DATA.trim().split('\\n');
  const records: SideScanRecord[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {{
    const parts = lines[i].split(',');
    if (parts.length < 11) continue;

    const imageId = parts[0].trim();
    const classIdStr = parts[1].trim();
    const xStr = parts[2].trim();
    const yStr = parts[3].trim();
    const wStr = parts[4].trim();
    const hStr = parts[5].trim();
    const latStr = parts[6].trim();
    const lngStr = parts[7].trim();
    const headingStr = parts[8].trim();
    const timestamp = parts[9].trim();
    const locationSource = parts[10].trim();

    const hasObject = classIdStr !== '';
    const classId = hasObject ? parseFloat(classIdStr) : null;
    const x = hasObject ? parseFloat(xStr) : null;
    const y = hasObject ? parseFloat(yStr) : null;
    const width = hasObject ? parseFloat(wStr) : null;
    const height = hasObject ? parseFloat(hStr) : null;
    const heading = parseFloat(headingStr) || 90.0;

    // Parse geographic coordinates from dataset survey log
    const isRealLocation = locationSource !== '' && ['survey', 'exif', 'verified', 'telemetry'].includes(locationSource.toLowerCase());
    const latitude = isRealLocation && latStr !== '' ? parseFloat(latStr) : null;
    const longitude = isRealLocation && lngStr !== '' ? parseFloat(lngStr) : null;

    let className = 'Subsea Object Anomaly';
    if (classId === 0) className = 'Sonar Acoustic Shadow Target';
    else if (classId === 1) className = 'Metallic Structural Debris';

    const imageUrl = `/datasets/side-scan-sonar-object-detection-challenge/valid/images/${{imageId}}`;

    records.push({{
      imageId,
      imageUrl,
      className,
      classId,
      x,
      y,
      width,
      height,
      latitude,
      longitude,
      heading,
      timestamp,
      locationSource: isRealLocation ? locationSource : 'unavailable',
      hasObject,
    }});
  }}

  return records;
}}

export const sideScanRecords = parseSideScanDataset();
"""

ts_p.write_text(ts_code, encoding="utf-8")
print("Wrote clean sideScanSonarDataset.ts")
