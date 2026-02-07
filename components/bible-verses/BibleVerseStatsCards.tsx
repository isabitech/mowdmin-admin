'use client';
import React, { useState, useEffect } from 'react';
import { bibleVerseService } from '@/services/bibleVerseService';
import { BibleVerseStats } from '@/constant/bibleVerseTypes';

export const BibleVerseStatsCards: React.FC = () => {
  const [stats, setStats] = useState<BibleVerseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await bibleVerseService.getBibleVerseStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsCards = [
    {
      title: 'Total Verses',
      value: stats.totalVerses.toLocaleString(),
      icon: '📜',
      color: 'bg-blue-500',
      change: '+12.5%',
      changeType: 'increase' as const,
    },
    {
      title: 'Total Bookmarks',
      value: stats.totalBookmarks.toLocaleString(),
      icon: '🔖',
      color: 'bg-green-500',
      change: '+8.3%',
      changeType: 'increase' as const,
    },
    {
      title: 'Total Collections',
      value: stats.totalCollections.toLocaleString(),
      icon: '🗺️',
      color: 'bg-purple-500',
      change: '+15.7%',
      changeType: 'increase' as const,
    },
    {
      title: 'Featured Verses',
      value: stats.featuredVerses.toLocaleString(),
      icon: '⭐',
      color: 'bg-yellow-500',
      change: '+5.2%',
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              card.changeType === 'increase'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <span>{card.changeType === 'increase' ? '↑' : '↓'}</span>
              <span>{card.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};