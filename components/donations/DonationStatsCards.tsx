'use client';

import { DonationStats } from '@/constant/donationTypes';

interface DonationStatsCardsProps {
  stats: DonationStats;
}

export default function DonationStatsCards({ stats }: DonationStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateCompletionRate = () => {
    if (stats.total.count === 0) return 0;
    return Math.round((stats.completed.count / stats.total.count) * 100);
  };

  const calculateAverageDonation = () => {
    if (stats.completed.count === 0) return 0;
    return stats.completed.amount / stats.completed.count;
  };

  const statsCards = [
    {
      title: 'Total Donations',
      value: formatNumber(stats.total.count),
      amount: formatCurrency(stats.total.amount),
      icon: '💝',
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
      title: 'Average Donation',
      value: formatCurrency(calculateAverageDonation()),
      amount: `From ${formatNumber(stats.completed.count)} donations`,
      icon: '📊',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900',
    },
    {
      title: 'Success Rate',
      value: `${calculateCompletionRate()}%`,
      amount: `${formatNumber(stats.completed.count)}/${formatNumber(stats.total.count)} completed`,
      icon: '📈',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-900',
    },
    {
      title: 'Active Campaigns',
      value: formatNumber(stats.activeCampaigns),
      amount: 'Currently running',
      icon: '🎯',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-900',
    },
    {
      title: 'Recurring Donors',
      value: formatNumber(stats.recurringDonors),
      amount: 'Regular supporters',
      icon: '🔄',
      color: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-900',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
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

      {/* Top Donors */}
      {stats.topDonors && stats.topDonors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Donors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.topDonors.slice(0, 6).map((topDonor, index) => (
              <div key={topDonor.donor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {topDonor.donor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(topDonor.totalAmount)} • {formatNumber(topDonor.donationCount)} donations
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}