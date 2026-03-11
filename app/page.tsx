'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-md w-full text-center px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mowdmin Admin System
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Manage users and app updates.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
          >
            Login to Admin System
          </Link>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Secure administrative access for authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
