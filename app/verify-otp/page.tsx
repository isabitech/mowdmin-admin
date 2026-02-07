'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validators } from '../../utils/validation';

interface OtpFormData {
  email: string;
  otp: string;
}

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp, loading, error } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const form = useForm<OtpFormData>({
    email: '',
    otp: '',
  });

  // Load email from session storage if available (from registration)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('verificationEmail');
    if (storedEmail) {
      form.setField('email', storedEmail);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (field: keyof OtpFormData, value: string) => {
    form.setField(field, value);
    
    // Format OTP input to be numeric only
    if (field === 'otp') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue !== value) {
        form.setField(field, numericValue);
        return;
      }
    }

    if (form.isFieldTouched(field)) {
      const validators_map = {
        email: [validators.required('Email'), validators.email],
        otp: [validators.required('OTP'), validators.minLength(6)]
      };
      form.validateField(field, validators_map[field]);
    }
  };

  const handleBlur = (field: keyof OtpFormData) => {
    form.setFieldTouched(field, true);
    const validators_map = {
      email: [validators.required('Email'), validators.email],
      otp: [validators.required('OTP'), validators.minLength(6)]
    };
    form.validateField(field, validators_map[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationRules = {
      email: [validators.required('Email'), validators.email],
      otp: [validators.required('OTP'), validators.minLength(4)]
    };
    
    const isValid = form.validateForm(validationRules);
    
    if (!isValid) {
      return;
    }

    try {
      await verifyOtp({
        email: form.getFieldValue('email'),
        otp: form.getFieldValue('otp')
      });
    } catch {
      // Error handling is done in useAuth hook
    }
  };

  const handleResendOtp = async () => {
    if (!form.getFieldValue('email')) {
      form.setFieldError('email', 'Please enter your email address');
      form.setFieldTouched('email', true);
      return;
    }

    if (resendCooldown > 0) return;

    try {
      setResendLoading(true);
      await resendOtp(form.getFieldValue('email'));
      setResendCooldown(60); // 60 second cooldown
    } catch {
      // Error handling is done in useAuth hook
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>
        <div className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.getFieldValue('email')}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  form.getFieldError('email') && form.isFieldTouched('email')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {form.getFieldError('email') && form.isFieldTouched('email') && (
                <p className="mt-1 text-sm text-red-600">{form.getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                value={form.getFieldValue('otp')}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                onBlur={() => handleBlur('otp')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  form.getFieldError('otp') && form.isFieldTouched('otp')
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm text-center tracking-widest font-mono`}
                placeholder="000000"
                disabled={loading}
                autoComplete="one-time-code"
              />
              {form.getFieldError('otp') && form.isFieldTouched('otp') && (
                <p className="mt-1 text-sm text-red-600">{form.getFieldError('otp')}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading || resendCooldown > 0}
                  className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading 
                    ? 'Sending...' 
                    : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : 'Resend Code'
                  }
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Check your spam folder if you don&apos;t see the email
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}