'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'User Management', href: '/dashboard/users', icon: '👥' },
  { name: 'Events', href: '/dashboard/events', icon: '📅' },
  { name: 'Media', href: '/dashboard/media', icon: '🎬' },
  { name: 'Media Categories', href: '/dashboard/media-categories', icon: '📁' },
  { name: 'Prayer', href: '/dashboard/prayer', icon: '🙏' },
  { name: 'Products', href: '/dashboard/products', icon: '🛍️' },
  { name: 'Orders', href: '/dashboard/orders', icon: '📦' },
  { name: 'Payments', href: '/dashboard/payments', icon: '💳' },
  { name: 'Donations', href: '/dashboard/donations', icon: '💝' },
  { name: 'Groups', href: '/dashboard/groups', icon: '👫' },
  { name: 'Ministries', href: '/dashboard/ministries', icon: '⛪' },
  { name: 'Bible Stories', href: '/dashboard/bible-stories', icon: '📖' },
  { name: 'Bible Verses', href: '/dashboard/bible-verses', icon: '📜' },
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect on error to ensure cleanup
      window.location.href = '/login';
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Mowdmin Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="shrink-0 flex border-t border-gray-200 p-4">
            <div className="shrink-0 w-full group block">
              <div className="flex flex-col  justify-between">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">{user?.name}</p>
                    <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Logout"
                >
                  <span className="mr-1">🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">Mowdmin Admin</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="shrink-0 flex border-t border-gray-200 p-4">
              <div className="shrink-0 w-full group block">
                <div className="flex flex-col gap-3 justify-between">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                      <p className="text-xs font-medium text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-1 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Logout"
                  >
                    <span className="mr-1">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}