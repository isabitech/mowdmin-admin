// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Admin user management types
export interface AdminUser extends User {
  role: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface TriggerOtpRequest {
  userId: string;
}