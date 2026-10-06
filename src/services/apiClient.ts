/**
 * NEXORA / MARKETHUB — Standardized API Client & Service Gateway
 * Implements Frontend Phase 2 integration contracts (Lines 2745-2836)
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    hasNext?: boolean;
    timestamp?: string;
    correlationId?: string;
  };
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  correlationId?: string;
}

// Configurable environment endpoints
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  AI_URL: (import.meta as any).env?.VITE_AI_URL || 'http://localhost:5000/api/v1/ai',
  APP_ENV: (import.meta as any).env?.MODE || 'development',
  DATA_SOURCE: ((import.meta as any).env?.VITE_DATA_SOURCE as 'mock' | 'api') || 'mock',
};

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Platform': 'NEXORA-Web',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          code: data.code || 'API_ERROR',
          message: data.message || `Request failed with status ${response.status}`,
          details: data.details,
          correlationId: data.meta?.correlationId,
        } as ApiError;
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      if (err.status) throw err;
      throw {
        status: 0,
        code: 'NETWORK_FAILURE',
        message: err.message || 'Unable to establish secure connection to marketplace cluster',
      } as ApiError;
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
