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
  ApiResponse 
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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(endpoints.auth.login, credentials);
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

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.register, userData);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post(endpoints.auth.logout);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Forgot Password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.forgotPassword, data);
    return response.data;
  },

  // Reset Password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.resetPassword, data);
    return response.data;
  },

  // Verify OTP
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.verifyOtp, data);
    return response.data;
  },

  // Resend OTP
  async resendOtp(data: ResendOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.resendOtp, data);
    return response.data;
  },

  // Change Password
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.changePassword, data);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Admin User Management
  async getAdminUsers(): Promise<any[]> {
    const response = await api.get<ApiResponse<any[]>>(endpoints.auth.adminUsers);
    return response.data.data || [];
  },

  async promoteUser(userId: string): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(endpoints.auth.promoteUser(userId));
    return response.data;
  },

  async updateUser(userId: string, userData: any): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(endpoints.auth.updateUser(userId), userData);
    return response.data;
  },

  async triggerUserOtp(userId: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.auth.triggerOtp(userId));
    return response.data;
  }
};

export default api;