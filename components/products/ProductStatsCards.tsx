'use client';

import { ProductStats } from '@/constant/productTypes';

interface ProductStatsCardsProps {
  stats: ProductStats;
}

export default function ProductStatsCards({ stats }: ProductStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statsData = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts.toLocaleString(),
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-900',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts.toLocaleString(),
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-900',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockProducts.toLocaleString(),
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
    },
    {
      title: 'Total Inventory',
      value: `${stats.totalInventory.toLocaleString()} units`,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 00-1 1v15a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H8zm2 6h4m-4 4h4" />
        </svg>
      ),
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} border rounded-lg p-4 transition-transform hover:scale-105`}
        >
          <div className="flex items-center">
            <div className="shrink-0">
              {stat.icon}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className={`text-xs font-medium ${stat.textColor} opacity-75 uppercase tracking-wide`}>
                {stat.title}
              </p>
              <p className={`text-lg font-semibold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}