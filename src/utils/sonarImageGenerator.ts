/**
 * Realistic Side-Scan Sonar (SSS) Acoustic Image Generator
 * Generates acoustic backscatter data URLs with realistic water-column nadir,
 * seabed reverberation, acoustic shadows, and target returns.
 */

export interface SampleSonarPreset {
  id: string;
  name: string;
  description: string;
  surveyId: string;
  category: string;
  targetType: string;
  coordinates: { lat: number; lng: number; location: string };
  generateDataUrl: () => string;
}

export function generateSonarCanvas(
  type: 'shipwreck' | 'ghostnet' | 'pipeline' | 'debris',
  width: number = 800,
  height: number = 500
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Base acoustic colormap (Side-scan copper-bronze or deep slate-cyan)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1c150b');
  bgGrad.addColorStop(0.5, '#2b1f10');
  bgGrad.addColorStop(1, '#1e1408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Seabed texture & reverberation speckles
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 45;
    data[i] = Math.min(255, Math.max(0, data[i] + noise + 15));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.7 + 8)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.3));     // B
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Sand ripples / seafloor texture lines
  ctx.strokeStyle = 'rgba(215, 160, 90, 0.08)';
  ctx.lineWidth = 1.5;
  for (let y = 0; y < height; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < width; x += 40) {
      const dy = Math.sin(x * 0.03 + y * 0.05) * 6;
      ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
  }

  // 4. Center Nadir track / Water Column (towfish trajectory)
  const nadirWidth = width * 0.08;
  const nadirX = width / 2 - nadirWidth / 2;
  const nadirGrad = ctx.createLinearGradient(nadirX, 0, nadirX + nadirWidth, 0);
  nadirGrad.addColorStop(0, 'rgba(8, 6, 4, 0.95)');
  nadirGrad.addColorStop(0.5, 'rgba(2, 2, 2, 0.98)');
  nadirGrad.addColorStop(1, 'rgba(8, 6, 4, 0.95)');
  ctx.fillStyle = nadirGrad;
  ctx.fillRect(nadirX, 0, nadirWidth, height);

  // Seabed first return line (altitude boundary)
  ctx.strokeStyle = 'rgba(255, 210, 140, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(nadirX, 0);
  ctx.lineTo(nadirX, height);
  ctx.moveTo(nadirX + nadirWidth, 0);
  ctx.lineTo(nadirX + nadirWidth, height);
  ctx.stroke();

  // 5. Draw acoustic target according to preset
  if (type === 'shipwreck') {
    // Large shipwreck hull with strong acoustic return on left and shadow extending right
    const hullX = width * 0.28;
    const hullY = height * 0.32;
    const hullW = width * 0.18;
    const hullH = height * 0.38;

    // Acoustic shadow (black silhouette)
    ctx.fillStyle = 'rgba(3, 2, 1, 0.96)';
    ctx.beginPath();
    ctx.ellipse(hullX + hullW * 0.8, hullY + hullH * 0.4, hullW * 0.9, hullH * 0.45, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Bright acoustic reflection (backscatter)
    const hullGrad = ctx.createLinearGradient(hullX, hullY, hullX + hullW, hullY + hullH);
    hullGrad.addColorStop(0, '#fff4db');
    hullGrad.addColorStop(0.3, '#f59e0b');
    hullGrad.addColorStop(0.7, '#d97706');
    hullGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = hullGrad;

    ctx.save();
    ctx.translate(hullX, hullY);
    ctx.rotate(-0.15);
    // Shipwreck hull shape
    ctx.beginPath();
    ctx.moveTo(0, hullH * 0.2);
    ctx.quadraticCurveTo(hullW * 0.3, 0, hullW, hullH * 0.15);
    ctx.lineTo(hullW * 0.95, hullH * 0.85);
    ctx.quadraticCurveTo(hullW * 0.4, hullH * 0.95, 0, hullH * 0.7);
    ctx.closePath();
    ctx.fill();

    // Internal ribs / structural frames
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 1; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(hullW * (i / 7), hullH * 0.2);
      ctx.lineTo(hullW * (i / 7), hullH * 0.75);
      ctx.stroke();
    }
    ctx.restore();
  } else if (type === 'ghostnet') {
    // Tangled, billowing acoustic signature of synthetic monofilament ghost net
    const netX = width * 0.65;
    const netY = height * 0.35;
    const netW = width * 0.22;
    const netH = height * 0.32;

    // Dark acoustic shadow behind net
    ctx.fillStyle = 'rgba(4, 3, 2, 0.95)';
    ctx.beginPath();
    ctx.ellipse(netX + netW * 0.6, netY + netH * 0.5, netW * 0.6, netH * 0.4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Bright mesh highlights
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.moveTo(netX + Math.random() * netW * 0.7, netY + Math.random() * netH);
      ctx.bezierCurveTo(
        netX + Math.random() * netW,
        netY + Math.random() * netH,
        netX + Math.random() * netW,
        netY + Math.random() * netH,
        netX + Math.random() * netW,
        netY + Math.random() * netH
      );
      ctx.stroke();
    }
  } else if (type === 'pipeline') {
    // Linear exposed subsea pipeline
    const pipeX1 = width * 0.15;
    const pipeY1 = height * 0.8;
    const pipeX2 = width * 0.85;
    const pipeY2 = height * 0.2;

    // Pipeline shadow
    ctx.strokeStyle = 'rgba(2, 2, 1, 0.96)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(pipeX1 + 10, pipeY1 + 10);
    ctx.lineTo(pipeX2 + 10, pipeY2 + 10);
    ctx.stroke();

    // Pipeline highlight reflection
    ctx.strokeStyle = '#fde68a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(pipeX1, pipeY1);
    ctx.lineTo(pipeX2, pipeY2);
    ctx.stroke();

    // Flange/joint anomalies
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(width * 0.45, height * 0.52, 10, 10);
  } else {
    // Cylindrical debris anomaly
    const cx = width * 0.32;
    const cy = height * 0.55;

    // Shadow
    ctx.fillStyle = 'rgba(2, 1, 1, 0.98)';
    ctx.fillRect(cx + 40, cy - 10, 80, 35);

    // Target highlight
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx, cy, 35, 20);
  }

  // 6. Sonar Telemetry Overlay (Scientific watermark)
  ctx.font = '11px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText(`SSS-450kHz | RANGE: 75m | SPEED: 3.4kts | CH: PORT/STBD`, 14, height - 14);
  ctx.fillText(`LAT: 13.0827°N | LON: 80.2707°E | SURVEY-NIOT-2026`, width - 360, height - 14);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SAMPLE_PRESETS: SampleSonarPreset[] = [
  {
    id: 'preset-shipwreck-1',
    name: 'Sample 1: Sunken Vessel Hull (AI4Shipwrecks Format)',
    description: 'High-resolution 450kHz acoustic scan of a 42m sunken wooden cargo vessel showing distinctive hull outline and acoustic shadow.',
    surveyId: 'SURVEY-NIOT-2026-SW01',
    category: 'Shipwreck',
    targetType: 'Shipwreck',
    coordinates: { lat: 13.0827, lng: 80.2707, location: 'Bay of Bengal, Chennai Offshore' },
    generateDataUrl: () => generateSonarCanvas('shipwreck'),
  },
  {
    id: 'preset-ghostnet-2',
    name: 'Sample 2: Ghost Net Entanglement on Rocky Seafloor',
    description: 'Acoustic backscatter signature of tangled discarded synthetic monofilament trawler net snagged on underwater rocky outcrops.',
    surveyId: 'SURVEY-MoES-2026-GN03',
    category: 'Ghost Net',
    targetType: 'Ghost Net',
    coordinates: { lat: 9.2876, lng: 79.3129, location: 'Gulf of Mannar Marine Biosphere' },
    generateDataUrl: () => generateSonarCanvas('ghostnet'),
  },
  {
    id: 'preset-pipeline-3',
    name: 'Sample 3: Exposed Subsea Pipeline & Debris',
    description: 'Sonar acoustic swath revealing unburied subsea transmission line with surrounding anthropogenic metallic debris.',
    surveyId: 'SURVEY-NIOT-2026-PL04',
    category: 'Underwater Pipe',
    targetType: 'Underwater Pipe',
    coordinates: { lat: 18.9220, lng: 72.8346, location: 'Arabian Sea, Mumbai High Corridor' },
    generateDataUrl: () => generateSonarCanvas('pipeline'),
  },
  {
    id: 'preset-anomaly-4',
    name: 'Sample 4: Cylindrical Debris & Unidentified Object',
    description: 'Acoustic swath indicating dense cylindrical drum object with high acoustic shadow length indicating elevated elevation.',
    surveyId: 'SURVEY-NIOT-2026-AN09',
    category: 'Cylindrical Object',
    targetType: 'Cylindrical Object',
    coordinates: { lat: 11.9139, lng: 79.8145, location: 'Puducherry Coast Marine Sanctuary' },
    generateDataUrl: () => generateSonarCanvas('debris'),
  },
  {
    id: 'preset-sss-challenge-5',
    name: 'Sample 5: Real SSS Challenge Anomaly Scan (000012_jpg)',
    description: 'Authentic Side-Scan Sonar acoustic swath raster from the side-scan-sonar-object-detection-challenge dataset with synchronized GNSS geotag.',
    surveyId: 'SSS-CHALLENGE-2026',
    category: 'Sonar Acoustic Shadow Target',
    targetType: 'Sonar Acoustic Shadow Target',
    coordinates: { lat: 13.02, lng: 80.24, location: 'Bay of Bengal SSS Corridor (13.02° N, 80.24° E)' },
    generateDataUrl: () => '/datasets/side-scan-sonar-object-detection-challenge/train/images/000012_jpg.rf.b76b3c145d081a2a8ae2601c202bdc84.jpg',
  },
];
