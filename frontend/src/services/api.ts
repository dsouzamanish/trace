import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('momentum_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('momentum_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  getProfile: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// Team Members API
export const teamMembersApi = {
  getAll: (params?: { team?: string; isManager?: boolean }) =>
    api.get('/team-members', { params }),
  getById: (id: string) => api.get(`/team-members/${id}`),
  getByTeam: (teamName: string) => api.get(`/team-members/team/${teamName}`),
  create: (data: Record<string, unknown>) => api.post('/team-members', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/team-members/${id}`, data),
  delete: (id: string) => api.delete(`/team-members/${id}`),
};

// Blockers API
export const blockersApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/blockers', { params }),
  getMy: (params?: Record<string, unknown>) => api.get('/blockers/my', { params }),
  getMyStats: () => api.get('/blockers/my/stats'),
  getByTeam: (teamName: string, params?: Record<string, unknown>) =>
    api.get(`/blockers/team/${teamName}`, { params }),
  getTeamStats: (teamName: string) => api.get(`/blockers/team/${teamName}/stats`),
  getByMember: (memberId: string, params?: Record<string, unknown>) =>
    api.get(`/blockers/member/${memberId}`, { params }),
  getById: (id: string) => api.get(`/blockers/${id}`),
  create: (data: Record<string, unknown>) => api.post('/blockers', data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/blockers/${id}`, data),
};

// AI Reports API
export const aiReportsApi = {
  generateMy: (period: 'weekly' | 'monthly' = 'weekly') =>
    api.post(`/ai-reports/generate/my?period=${period}`),
  generateForMember: (memberId: string, period: 'weekly' | 'monthly' = 'weekly') =>
    api.post(`/ai-reports/generate/member/${memberId}?period=${period}`),
  generateForTeam: (teamName: string, period: 'weekly' | 'monthly' = 'weekly') =>
    api.post(`/ai-reports/generate/team/${teamName}?period=${period}`),
  getMy: () => api.get('/ai-reports/my'),
  getForTeam: (teamName: string) => api.get(`/ai-reports/team/${teamName}`),
  getForMember: (memberId: string) => api.get(`/ai-reports/member/${memberId}`),
  getById: (id: string) => api.get(`/ai-reports/${id}`),
};

export default api;

