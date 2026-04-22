'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../constant/types';
import toast from 'react-hot-toast';
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  verifyOtp: (otpData: { email: string; otp: string }) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login: updateAuthContext, logout: clearAuthContext } = useAuthContext();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ FIXED LOGIN
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      
      // 🕵️ Debug: Log user object to check verification field name
      console.log('Login successful, user object:', response.user);

      // 🔄 Update Auth Context FIRST
      updateAuthContext(response.token, response.user);
      
      toast.success('Successfully logged in!');

      // ✅ More robust verification check (covers common backend field names)
      const isVerified = 
        response.user.isVerified === true || 
        (response.user as any).emailVerified === true || 
        (response.user as any).verified === true;

      if (!isVerified) {
        console.log('User not verified, redirecting to OTP...');
        router.push('/verify-otp');
        return;
      }

      console.log('User verified, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(userData);

      // response is ApiResponse, data holds the user info if available
      if (response.data?.user && !response.data.user.isVerified) {
        toast.success(
          'Registration successful! Please check your email for verification code.'
        );
        sessionStorage.setItem('verificationEmail', userData.email);
        router.push('/verify-otp');
      } else {
        toast.success('Registration successful! You can now login.');
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const verifyOtp = useCallback(async (otpData: { email: string; otp: string }) => {
    try {
      setLoading(true);
      setError(null);

      await authService.verifyOtp(otpData);

      toast.success('Email verified successfully! You can now login.');
      sessionStorage.removeItem('verificationEmail');

      router.push('/login');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'OTP verification failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const resendOtp = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      await authService.resendOtp({ email });

      toast.success('Verification code sent! Please check your email.');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Failed to resend verification code.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await clearAuthContext();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err: any) {
      setError('Logout failed');
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return {
    loading,
    error,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    clearError,
  };
};