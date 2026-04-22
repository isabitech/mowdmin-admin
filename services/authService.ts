import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../constant/types';
import { endpoints } from '../constant/endpoints';

const BASE_URL = 'https://mowdmin-mobile-be-qwo0.onrender.com/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /* ---------------- AUTH ---------------- */

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      endpoints.auth.login,
      credentials
    );

    const { token, user } = response.data.data || {};

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    if (!response.data.data) {
      throw new Error('Login failed: No data received');
    }

    return response.data.data;
  },

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.register,
      userData
    );
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post(endpoints.auth.logout);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.forgotPassword,
      data
    );
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.resetPassword,
      data
    );
    return response.data;
  },

  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.verifyOtp,
      data
    );
    return response.data;
  },

  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.resendOtp,
      data
    );
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      endpoints.auth.changePassword,
      data
    );
    return response.data;
  },

  /* ---------------- ADMIN USERS (FIXED SEARCH) ---------------- */

  async getAdminUsers(filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    if (filters?.search?.trim()) {
      const searchTerm = filters.search.trim();
      params.append('search', searchTerm);
      params.append('q', searchTerm); // Alias requested by user
    }

    const response = await api.get(
      `${endpoints.auth.adminUsers}?${params.toString()}`
    );

    // ✅ THIS is the missing part (apiData was undefined before)
    const apiData = response.data;

    // ---------------- USERS ----------------
    let users: any[] = [];

    if (Array.isArray(apiData.data)) {
      users = apiData.data;
    } else if (Array.isArray(apiData)) {
      users = apiData;
    } else if (Array.isArray(apiData?.data?.data)) {
      users = apiData.data.data;
    }

    // ---------------- TOTAL (FIXED PROPERLY with fallback) ----------------
    const total =
      apiData?.total ??
      apiData?.totalUsers ??
      apiData?.totalCount ??
      apiData?.pagination?.total ??
      apiData?.data?.total ??
      (users.length === (filters?.limit || 10) ? (filters?.page || 1) * (filters?.limit || 10) + 1 : users.length);

    return {
      data: users,
      total,
      page: filters?.page || 1,
      limit: filters?.limit || 10,
    };
  },
  /* ---------------- USER ACTIONS ---------------- */

  async promoteUser(userId: string): Promise<ApiResponse> {
    const response = await api.patch(
      endpoints.auth.promoteUser(userId)
    );
    return response.data;
  },

  async updateUser(userId: string, userData: any): Promise<ApiResponse> {
    const response = await api.put(
      endpoints.auth.updateUser(userId),
      userData
    );
    return response.data;
  },

  async triggerUserOtp(userId: string): Promise<ApiResponse> {
    const response = await api.post(
      endpoints.auth.triggerOtp(userId)
    );
    return response.data;
  },

  /* ---------------- HELPERS ---------------- */

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  getCurrentUser(): any {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default api;