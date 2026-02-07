'use client';

import { useState, useEffect } from 'react';
import { prayerService } from '@/services/prayerService';
import { PrayerRequest, PrayerPoint, CreatePrayerPointRequest } from '@/constant/prayerTypes';
import PrayerRequestCard from './PrayerRequestCard';
import PrayerPointCard from './PrayerPointCard';
import CreatePrayerPointModal from './CreatePrayerPointModal';
import toast from 'react-hot-toast';

interface CreatePrayerPointData {
  title: string;
  description?: string;
  prayerRequestId?: string;
  category: 'healing' | 'guidance' | 'thanksgiving' | 'protection' | 'provision' | 'salvation' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function PrayerManager() {
  const [activeTab, setActiveTab] = useState<'requests' | 'points'>('requests');
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [prayerPoints, setPrayerPoints] = useState<PrayerPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PrayerPoint | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [requestsResponse, pointsResponse] = await Promise.all([
        prayerService.getPrayerRequests(),
        prayerService.getPrayerPoints(),
      ]);

      setPrayerRequests(requestsResponse || []);
      setPrayerPoints(pointsResponse || []);
    } catch (error) {
      console.error('Error loading prayer data:', error);
      toast.error('Failed to load prayer data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestStatusUpdate = async (id: string, status: PrayerRequest['status']) => {
    try {
      await prayerService.updatePrayerRequestStatus(id, status);
      toast.success('Prayer request updated successfully');
      loadData();
    } catch (error) {
      console.error('Error updating prayer request:', error);
      toast.error('Failed to update prayer request');
    }
  };

  const handleCreatePrayerPoint = async (data: CreatePrayerPointData) => {
    try {
      setIsSubmitting(true);
      if (editingPoint) {
        await prayerService.updatePrayerPoint(editingPoint.id, data);
        toast.success('Prayer point updated successfully');
      } else {
        await prayerService.createPrayerPoint(data);
        toast.success('Prayer point created successfully');
      }
      setIsModalOpen(false);
      setEditingPoint(null);
      loadData();
    } catch (error) {
      console.error('Error creating/updating prayer point:', error);
      toast.error('Failed to save prayer point');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePrayerPoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer point?')) return;

    try {
      await prayerService.deletePrayerPoint(id);
      toast.success('Prayer point deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting prayer point:', error);
      toast.error('Failed to delete prayer point');
    }
  };

  const handleEditPrayerPoint = (point: PrayerPoint) => {
    setEditingPoint(point);
    setIsModalOpen(true);
  };

  const pendingRequests = prayerRequests.filter(r => r.status === 'pending');
  const approvedRequests = prayerRequests.filter(r => r.status === 'approved');
  const otherRequests = prayerRequests.filter(r => r.status !== 'pending' && r.status !== 'approved');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prayer Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage prayer requests from the community and create prayer points
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Prayer Point
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Prayer Requests ({prayerRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'points'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Prayer Points ({prayerPoints.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Pending Approval ({pendingRequests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingRequests.map((request) => (
                    <PrayerRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Approved Requests */}
            {approvedRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Approved ({approvedRequests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedRequests.map((request) => (
                    <PrayerRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Requests */}
            {otherRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Other ({otherRequests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherRequests.map((request) => (
                    <PrayerRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              </div>
            )}

            {prayerRequests.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prayer requests</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Prayer requests from the community will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'points' && (
          <div>
            {prayerPoints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prayerPoints.map((point) => (
                  <PrayerPointCard
                    key={point.id}
                    point={point}
                    onDelete={handleDeletePrayerPoint}
                    onEdit={handleEditPrayerPoint}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prayer points</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create prayer points to share with the church community.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Create First Prayer Point
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Prayer Point Modal */}
      <CreatePrayerPointModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPoint(null);
        }}
        onSubmit={handleCreatePrayerPoint}
        isLoading={isSubmitting}
        prayerRequests={prayerRequests}
        editingPoint={editingPoint}
      />
    </div>
  );
}