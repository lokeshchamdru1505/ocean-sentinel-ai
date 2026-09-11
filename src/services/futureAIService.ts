import { AnalysisResult } from '../types';

/**
 * Future Real AI / ML Backend Service Integration Layer
 * 
 * Target Backend:
 * - Framework: FastAPI (Python 3.11) + PyTorch
 * - Models: U-Net (Marine Debris & Shipwreck semantic segmentation),
 *           YOLOv8-OBB / YOLOv11 (Oriented Bounding Box sonar object detection)
 * - Hardware: NVIDIA TensorRT / CUDA-accelerated inference
 * 
 * Endpoint Specification:
 * POST /api/v1/sonar/analyze
 * Content-Type: multipart/form-data
 * Parameters:
 *   - file: Binary Side-Scan Sonar raster (.png, .jpg, .tiff, .xtf)
 *   - frequency_khz: float
 *   - towfish_altitude_m: float
 *   - meters_per_pixel: float
 *   - survey_id: string
 *   - latitude: float (optional)
 *   - longitude: float (optional)
 */

export interface FutureAIServiceConfig {
  apiBaseUrl: string;
  authToken?: string;
  timeoutMs: number;
}

const defaultBaseUrl = (import.meta as any).env?.VITE_API_URL 
  ? `${(import.meta as any).env.VITE_API_URL.replace(/\/+$/, '')}/api/v1` 
  : 'http://localhost:8000/api/v1';

export class FutureAIService {
  private config: FutureAIServiceConfig;

  constructor(config: FutureAIServiceConfig = { apiBaseUrl: defaultBaseUrl, timeoutMs: 30000 }) {
    this.config = config;
  }

  /**
   * Sends sonar imagery to real FastAPI PyTorch backend once deployed
   */
  async analyzeSonarImage(formData: FormData): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/sonar/analyze`, {
        method: 'POST',
        headers: this.config.authToken ? { Authorization: `Bearer ${this.config.authToken}` } : {},
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`AI inference service error: HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data as AnalysisResult;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.warn('Real AI service connection failed, fallback or error:', errorMessage);
      throw new Error(`Real AI service unavailable: ${errorMessage}. Switch to Demo Mode in Settings.`);
    }
  }

  /**
   * Health check for real model server
   */
  async checkHealth(): Promise<{ status: string; modelsLoaded: string[]; gpuAvailable: boolean }> {
    try {
      const res = await fetch(`${this.config.apiBaseUrl}/health`);
      return await res.json();
    } catch {
      return {
        status: 'Offline (Pending SIH Model Integration)',
        modelsLoaded: ['U-Net (Shipwreck Segmentation)', 'YOLOv8-OBB (Sonar Debris)'],
        gpuAvailable: false,
      };
    }
  }
}

export const futureAIService = new FutureAIService();
