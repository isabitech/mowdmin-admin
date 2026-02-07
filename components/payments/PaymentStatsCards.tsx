'use client';

import { PaymentStats } from '@/constant/paymentTypes';

interface PaymentStatsCardsProps {
  stats: PaymentStats;
}

export default function PaymentStatsCards({ stats }: PaymentStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateSuccessRate = () => {
    const totalProcessed = stats.completed.count + stats.failed.count;
    if (totalProcessed === 0) return 0;
    return Math.round((stats.completed.count / totalProcessed) * 100);
  };

  const statsCards = [
    {
      title: 'Total Payments',
      value: formatNumber(stats.total.count),
      amount: formatCurrency(stats.total.amount),
      icon: '💳',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      title: 'Completed',
      value: formatNumber(stats.completed.count),
      amount: formatCurrency(stats.completed.amount),
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-900',
    },
    {
      title: 'Pending',
      value: formatNumber(stats.pending.count),
      amount: formatCurrency(stats.pending.amount),
      icon: '⏳',
      color: 'bg-yellow-50 border-yellow-200',
      textColor: 'text-yellow-900',
    },
    {
      title: 'Failed',
      value: formatNumber(stats.failed.count),
      amount: formatCurrency(stats.failed.amount),
      icon: '❌',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-900',
    },
    {
      title: 'Refunded',
      value: formatNumber(stats.refunded.count),
      amount: formatCurrency(stats.refunded.amount),
      icon: '↩️',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900',
    },
    {
      title: 'Success Rate',
      value: `${calculateSuccessRate()}%`,
      amount: `${formatNumber(stats.completed.count)}/${formatNumber(stats.completed.count + stats.failed.count)} processed`,
      icon: '📊',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} border rounded-lg p-4 transition-all hover:shadow-md`}
        >
          <div className="flex items-center">
            <div className="text-2xl mr-3">{stat.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${stat.textColor} truncate`}>
                {stat.title}
              </p>
              <p className={`text-lg font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${stat.textColor} opacity-75 truncate`}>
                {stat.amount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}