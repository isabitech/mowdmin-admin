'use client';

import { Group, GROUP_TYPE_CONFIG, GROUP_STATUS_CONFIG } from '@/constant/groupTypes';
import ModalWrapper from '../../ModalWrapper';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: () => void;
}

export default function GroupDetailsModal({ isOpen, onClose, group, onEdit, onDelete }: GroupDetailsModalProps) {
  const typeConfig = GROUP_TYPE_CONFIG[group.type] || {
    label: group.type?.replace('_', ' ') || 'Unknown Type',
    icon: '👥',
    color: 'bg-gray-100 text-gray-800'
  };
  const statusConfig = GROUP_STATUS_CONFIG[group.status] || {
    label: group.status?.replace('_', ' ') || 'Unknown Status',
    color: 'bg-gray-100 text-gray-800'
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      {/* Decorative Header Background */}
      <div className="h-20 bg-gradient-to-r from-indigo-400 to-violet-500 relative rounded-t-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-8 pb-8 -mt-12 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{group.name}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${typeConfig.color}`}>
                  <span className="mr-1.5">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
                {group.isPublic && (
                  <span className="inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-full">
                    Public
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(group)}
                className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
              >
                Edit Group
              </button>
              <button
                onClick={onDelete}
                className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 border border-red-100 rounded-lg transition-all"
                title="Delete Group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">About the Group</h4>
              <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">{group.description}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Meeting Schedule
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Frequency</span>
                    <span className="font-semibold text-gray-900 capitalize">{group.meetingSchedule?.frequency?.replace('_', ' ') || 'Not specified'}</span>
                  </div>
                  {group.meetingSchedule?.dayOfWeek && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Scheduled Day</span>
                      <span className="font-semibold text-gray-900">{group.meetingSchedule.dayOfWeek.charAt(0).toUpperCase() + group.meetingSchedule.dayOfWeek.slice(1)}</span>
                    </div>
                  )}
                  {group.meetingSchedule?.timeOfDay && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Time</span>
                      <span className="font-semibold text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">{group.meetingSchedule.timeOfDay}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                    <span className="text-gray-500">Format</span>
                    <span className={`font-bold ${group.meetingSchedule?.isVirtual ? 'text-purple-600' : 'text-indigo-600'}`}>
                      {group.meetingSchedule?.isVirtual ? 'Remote / Virtual' : 'In-Person'}
                    </span>
                  </div>
                </div>
              </section>

              <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Contact Info
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Primary Contact</span>
                    <p className="text-sm font-semibold text-gray-900">{group.contactInfo?.primaryContact || 'No contact specified'}</p>
                  </div>
                  {group.contactInfo?.email && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                      <a
                        href={`mailto:${group.contactInfo.email}`}
                        className="text-sm font-semibold text-indigo-600 hover:underline transition-colors"
                      >
                        {group.contactInfo.email}
                      </a>
                    </div>
                  )}
                  {group.contactInfo?.phone && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                      <p className="text-sm font-semibold text-gray-900">{group.contactInfo.phone}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Group Insights</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                  <span className="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Total Meetings</span>
                  <span className="text-xl font-black text-indigo-700">{group.statistics?.totalMeetings ?? 0}</span>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                  <span className="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Avg Attendance</span>
                  <span className="text-xl font-black text-indigo-700">{group.statistics?.averageAttendance?.toFixed(1) ?? '0.0'}%</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                  <span className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">Retention</span>
                  <span className="text-xl font-black text-emerald-700">{group.statistics?.retentionRate?.toFixed(1) ?? '0.0'}%</span>
                </div>
                <div className="bg-violet-50/50 border border-violet-100 p-4 rounded-xl">
                  <span className="block text-[10px] font-bold text-violet-400 uppercase mb-1">Growth</span>
                  <span className={`text-xl font-black ${(group.statistics?.growthRate ?? 0) >= 0 ? 'text-violet-700' : 'text-red-600'}`}>
                    {(group.statistics?.growthRate ?? 0) > 0 ? '+' : ''}{group.statistics?.growthRate?.toFixed(1) ?? '0.0'}%
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Leadership Team</h4>
              <div className="space-y-3">
                {group.leaders && group.leaders.length > 0 ? group.leaders.map((leader) => (
                  <div key={leader.id} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100 mr-3 shrink-0">
                      <span className="font-bold text-sm">{leader.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{leader.name}</p>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase">{leader.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">No leaders assigned</p>
                )}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Target Audience Tags</h4>
              <div className="flex flex-wrap gap-2">
                {group.tags && group.tags.length > 0 ? group.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-[11px] font-bold bg-gray-50 text-gray-600 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-default"
                  >
                    #{tag}
                  </span>
                )) : (
                  <p className="text-sm text-gray-500 italic">No tags defined</p>
                )}
              </div>
            </section>

            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Metadata</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Created On</span>
                    <span className="text-xs font-bold">{formatDate(group.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Last Modified</span>
                    <span className="text-xs font-bold">{formatDate(group.updatedAt)}</span>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Capacity Usage</span>
                      <span className="text-xs font-bold">{group.currentMemberCount || 0} / {group.maxMembers || '∞'}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${group.maxMembers ? ((group.currentMemberCount || 0) / group.maxMembers) * 100 : 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"></div>
            </section>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}