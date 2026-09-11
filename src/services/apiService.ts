/**
 * General API Service layer for backend communication and dataset ingestion
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export const apiService = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown network failure';
      return { success: false, error: message, timestamp: new Date().toISOString() };
    }
  },

  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown request failure';
      return { success: false, error: message, timestamp: new Date().toISOString() };
    }
  },
};
