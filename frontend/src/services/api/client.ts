import axios, { type AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import {
  formatStatusFromBackend,
  formatPriorityFromBackend,
  formatStatusToBackend,
  formatPriorityToBackend
} from '../../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to transform issue objects from frontend format to backend format
function transformIssueToBackend(issue: any): any {
  if (!issue || typeof issue !== 'object') return issue;

  const transformed = { ...issue };

  // Transform status from frontend format (inProgress) to backend format (IN_PROGRESS)
  if (typeof transformed.status === 'string') {
    transformed.status = formatStatusToBackend(transformed.status as any);
  }

  // Transform priority from frontend format (highest) to backend format (HIGHEST)
  if (typeof transformed.priority === 'string') {
    transformed.priority = formatPriorityToBackend(transformed.priority as any);
  }

  return transformed;
}

// Request interceptor - Add auth token and transform data to backend format
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Transform request data for POST/PUT/PATCH requests
    if (config.data && (config.method === 'post' || config.method === 'put' || config.method === 'patch')) {
      // Handle single issue object
      if (config.data.status || config.data.priority) {
        config.data = transformIssueToBackend(config.data);
      }

      // Handle array of issues
      if (Array.isArray(config.data)) {
        config.data = config.data.map((item: any) =>
          item && typeof item === 'object' && (item.status || item.priority)
            ? transformIssueToBackend(item)
            : item
        );
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Helper function to transform issue objects from backend format to frontend format
function transformIssue(issue: any): any {
  if (!issue || typeof issue !== 'object') return issue;

  const transformed = { ...issue };

  // Transform status from backend format (IN_PROGRESS) to frontend format (inProgress)
  if (typeof transformed.status === 'string') {
    transformed.status = formatStatusFromBackend(transformed.status);
  }

  // Transform priority from backend format (HIGHEST) to frontend format (highest)
  if (typeof transformed.priority === 'string') {
    transformed.priority = formatPriorityFromBackend(transformed.priority);
  }

  return transformed;
}

// Response interceptor - Transform data and handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Transform issue objects from backend format to frontend format
    if (response.data) {
      // Handle single issue
      if (response.data.status && typeof response.data.status === 'string') {
        response.data = transformIssue(response.data);
      }

      // Handle array of issues
      if (Array.isArray(response.data)) {
        response.data = response.data.map((item: any) =>
          item && typeof item === 'object' && item.status ? transformIssue(item) : item
        );
      }

      // Handle nested issues in projects (issueCount, etc.)
      if (response.data.issues && Array.isArray(response.data.issues)) {
        response.data.issues = response.data.issues.map(transformIssue);
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
