'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
    </div>
  );
}
