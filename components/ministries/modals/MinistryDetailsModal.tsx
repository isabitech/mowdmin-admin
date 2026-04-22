'use client';

import { Ministry, MINISTRY_TYPE_CONFIG } from '@/constant/ministryTypes';
import { format } from 'date-fns';

interface MinistryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministry: Ministry;
  onEdit: (ministry: Ministry) => void;
  onDelete: () => void;
}

export default function MinistryDetailsModal({
  isOpen,
  onClose,
  ministry,
  onEdit,
  onDelete,
}: MinistryDetailsModalProps) {
  if (!isOpen || !ministry) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Decorative Header Background */}
        <div className="h-32 bg-gradient-to-r from-indigo-400 to-violet-500 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors z-20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Floating Content Header */}
        <div className="px-8 pb-0 relative -mt-12 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{ministry.name}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {ministry.type?.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${ministry.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-100'
                    } border`}>
                    {ministry.status}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${ministry.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    } border`}>
                    {ministry.priority} Priority
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(ministry)}
                  className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                >
                  Edit Ministry
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">About the Ministry</h4>
                <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">{ministry.description}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Audience */}
                <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Target Audience
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Gender</span>
                      <span className="font-bold text-gray-900 capitalize">{ministry.targetAudience?.gender || 'Mixed'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Age Range</span>
                      <span className="font-bold text-gray-900">
                        {ministry.targetAudience?.ageRange?.min || 'Any'} - {ministry.targetAudience?.ageRange?.max || 'Any'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Demographics</span>
                      <div className="flex flex-wrap gap-1">
                        {ministry.targetAudience?.demographics?.map((d, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">{d}</span>
                        )) || <span className="text-xs text-gray-400">None specified</span>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Info */}
                <section className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Primary Contact
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs mr-3">
                        {ministry.contactInfo?.primaryContact?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{ministry.contactInfo?.primaryContact || 'No contact specified'}</p>
                        <p className="text-[10px] text-gray-500 font-medium">Ministry Leader</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                        <a href={`mailto:${ministry.contactInfo?.email}`} className="text-sm font-semibold text-indigo-600 hover:underline">
                          {ministry.contactInfo?.email || 'N/A'}
                        </a>
                      </div>
                      {ministry.contactInfo?.phone && (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                          <span className="text-sm font-bold text-gray-900">{ministry.contactInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* Goals */}
              {ministry.goals && ministry.goals.length > 0 && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Ministry Goals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ministry.goals.map((goal, index) => (
                      <div key={goal.id || index} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <p className="text-xs font-bold text-gray-900 mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-gray-400 uppercase">Progress</span>
                            <span className="font-black text-indigo-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${goal.isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`}
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Insights</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                    <span className="block text-[10px] font-bold text-indigo-400 uppercase mb-1">Participants</span>
                    <span className="text-xl font-black text-indigo-700">{ministry.totalParticipants || 0}</span>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                    <span className="block text-[10px] font-bold text-emerald-400 uppercase mb-1">Budget</span>
                    <span className="text-xl font-black text-emerald-700">
                      ${ministry.budget?.allocated?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </section>

              <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Ministry Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Established</span>
                      <span className="text-xs font-bold">{format(new Date(ministry.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Last Updated</span>
                      <span className="text-xs font-bold">{format(new Date(ministry.updatedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl"></div>
              </section>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}