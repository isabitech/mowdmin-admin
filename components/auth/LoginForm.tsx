'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LoginRequest } from '../../constant/types';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { validationRules } from '../../utils/validation';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginRequest>({
    email: '',
    password: '',
  });

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    form.setField(field, value);
    
    // Real-time validation on blur/change
    if (form.isFieldTouched(field)) {
      form.validateField(field, validationRules.login[field]);
    }
  };

  const handleBlur = (field: keyof LoginRequest) => {
    form.setFieldTouched(field, true);
    form.validateField(field, validationRules.login[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = form.validateForm(validationRules.login);
    
    if (!isValid) {
      return;
    }

    try {
      await login({
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
      });
    } catch (err) {
      // Error handling is done in useAuth hook
    }
  };

  return (
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={form.getFieldValue('password')}
            onChange={(e) => handleInputChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
              form.getFieldError('password') && form.isFieldTouched('password')
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
            placeholder="Enter your password"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {form.getFieldError('password') && form.isFieldTouched('password') && (
          <p className="mt-1 text-sm text-red-600">{form.getFieldError('password')}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}