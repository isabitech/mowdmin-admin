'use client';

import { GroupStats } from '@/constant/groupTypes';

interface GroupStatsCardsProps {
  stats: GroupStats;
}

export default function GroupStatsCards({ stats }: GroupStatsCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateActiveRate = () => {
    if (stats.total.count === 0) return 0;
    return Math.round((stats.total.activeCount / stats.total.count) * 100);
  };

  const mainStatsCards = [
    {
      title: 'Total Groups',
      value: formatNumber(stats.total.count),
      subtitle: `${formatNumber(stats.total.activeCount)} active`,
      icon: '👥',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      title: 'Active Groups',
      value: formatNumber(stats.total.activeCount),
      subtitle: `${calculateActiveRate()}% of total`,
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-900',
    },
    {
      title: 'Total Members',
      value: formatNumber(stats.membership.totalMembers),
      subtitle: `${formatNumber(stats.membership.totalLeaders)} leaders`,
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900',
    },
    {
      title: 'Average Group Size',
      value: stats.membership.averageMembersPerGroup.toFixed(1),
      subtitle: 'members per group',
      icon: '📊',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-900',
    },
    {
      title: 'This Month\'s Meetings',
      value: formatNumber(stats.meetings.totalMeetingsThisMonth),
      subtitle: `${formatNumber(stats.meetings.upcomingMeetings)} upcoming`,
      icon: '📅',
      color: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-900',
    },
    {
      title: 'Average Attendance',
      value: `${stats.meetings.averageAttendance.toFixed(1)}%`,
      subtitle: 'across all meetings',
      icon: '👍',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-900',
    },
    {
      title: 'Membership Growth',
      value: `${stats.membership.membershipGrowth > 0 ? '+' : ''}${stats.membership.membershipGrowth.toFixed(1)}%`,
      subtitle: 'this month',
      icon: stats.membership.membershipGrowth >= 0 ? '📈' : '📉',
      color: stats.membership.membershipGrowth >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
      textColor: stats.membership.membershipGrowth >= 0 ? 'text-green-900' : 'text-red-900',
    },
    {
      title: 'Inactive Groups',
      value: formatNumber(stats.total.inactiveCount),
      subtitle: `${Math.round((stats.total.inactiveCount / stats.total.count) * 100)}% of total`,
      icon: '⏸️',
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-900',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {mainStatsCards.map((stat, index) => (
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
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Group Types Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Groups by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.entries(stats.byType)
            .filter(([_, count]) => count > 0)
            .sort(([,a], [,b]) => b - a)
            .map(([type, count]) => {
              const typeLabels: { [key: string]: { label: string; icon: string } } = {
                small_group: { label: 'Small Groups', icon: '👥' },
                ministry_team: { label: 'Ministry Teams', icon: '🤝' },
                bible_study: { label: 'Bible Studies', icon: '📖' },
                youth_group: { label: 'Youth Groups', icon: '🧑‍🎓' },
                committee: { label: 'Committees', icon: '📋' },
                prayer_group: { label: 'Prayer Groups', icon: '🙏' },
                worship_team: { label: 'Worship Teams', icon: '🎵' },
                mens_group: { label: 'Men\'s Groups', icon: '👨' },
                womens_group: { label: 'Women\'s Groups', icon: '👩' },
                childrens_group: { label: 'Children\'s Groups', icon: '🧒' },
                seniors_group: { label: 'Seniors Groups', icon: '👴' },
                volunteer_team: { label: 'Volunteer Teams', icon: '🤲' },
                leadership_team: { label: 'Leadership Teams', icon: '👑' },
                special_interest: { label: 'Special Interest', icon: '🌟' },
              };
              const typeInfo = typeLabels[type] || { label: type, icon: '👥' };
              
              return (
                <div key={type} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg">{typeInfo.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {typeInfo.label}
                    </p>
                    <p className="text-sm text-gray-500">{count} groups</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Recent Activity & Top Performing Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-lg">🆕</div>
                <div>
                  <p className="text-sm font-medium text-blue-900">New Groups</p>
                  <p className="text-xs text-blue-700">This month</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-900">
                {formatNumber(stats.recentActivity.newGroups)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-lg">👥</div>
                <div>
                  <p className="text-sm font-medium text-green-900">New Members</p>
                  <p className="text-xs text-green-700">This month</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-900">
                {formatNumber(stats.recentActivity.newMembers)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-lg">✅</div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Completed Meetings</p>
                  <p className="text-xs text-purple-700">This month</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-900">
                {formatNumber(stats.recentActivity.completedMeetings)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Performing Groups */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Groups</h3>
          {stats.topGroups && stats.topGroups.length > 0 ? (
            <div className="space-y-3">
              {stats.topGroups.slice(0, 5).map((topGroup, index) => (
                <div key={topGroup.group.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-600">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {topGroup.group.name}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{topGroup.memberCount} members</span>
                      <span>•</span>
                      <span>{topGroup.attendanceRate.toFixed(1)}% attendance</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No group performance data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}