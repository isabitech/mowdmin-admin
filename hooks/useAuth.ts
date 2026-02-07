'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../constant/types';
import toast from 'react-hot-toast';

export interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  verifyOtp: (otpData: { email: string; otp: string }) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.login(credentials);
      
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      // Check if email verification is required
      if (response.data?.data?.user && !response.data.data.user.emailVerified) {
        toast.success('Registration successful! Please check your email for verification code.');
        // Store email for verification page
        sessionStorage.setItem('verificationEmail', userData.email);
        router.push('/verify-otp');
      } else {
        // If somehow email is already verified, go to login
        toast.success('Registration successful! You can now login.');
        router.push('/login');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
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
      // Clear stored email
      sessionStorage.removeItem('verificationEmail');
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
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
      const errorMessage = err.response?.data?.message || 'Failed to resend verification code.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    login,
    register,
    verifyOtp,
    resendOtp,
    clearError,
  };
};