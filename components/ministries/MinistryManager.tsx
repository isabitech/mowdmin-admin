'use client';

import { useState, useEffect, useCallback } from 'react';
import { ministryService } from '@/services/ministryService';
import {
  Ministry,
  MinistryFilters,
  CreateMinistryData,
  UpdateMinistryData
} from '@/constant/ministryTypes';
import MinistryCard from './MinistryCard';
import MinistryFiltersPanel from './MinistryFiltersPanel';
import CreateMinistryModal from './modals/CreateMinistryModal';
import EditMinistryModal from './modals/EditMinistryModal';
import MinistryDetailsModal from './modals/MinistryDetailsModal';
import DeleteMinistryModal from './modals/DeleteMinistryModal';
import toast from 'react-hot-toast';

export default function MinistryManager() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMinistries, setSelectedMinistries] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<MinistryFilters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  const loadMinistries = useCallback(async () => {
    try {
      setIsLoading(true);
      // Load all ministries for robust selection/management
      const response = await ministryService.getMinistries(1, 1000, filters);
      setMinistries(response.data || []);
    } catch (error) {
      console.error('Error loading ministries:', error);
      toast.error('Failed to load ministries');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadMinistries();
  }, [loadMinistries]);

  const handleCreateMinistry = async (ministryData: CreateMinistryData) => {
    try {
      setIsSubmitting(true);
      await ministryService.createMinistry(ministryData);
      toast.success('Ministry created successfully');
      setIsCreateModalOpen(false);
      loadMinistries();
    } catch (error) {
      console.error('Error creating ministry:', error);
      toast.error('Failed to create ministry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMinistry = async (ministryData: UpdateMinistryData) => {
    if (!selectedMinistry) return;

    try {
      setIsSubmitting(true);
      const updatedMinistry = await ministryService.updateMinistry(selectedMinistry.id, ministryData);
      toast.success('Ministry updated successfully');
      setIsEditModalOpen(false);
      setSelectedMinistry(null);
      setMinistries(prev => prev.map(m => m.id === updatedMinistry.id ? updatedMinistry : m));
    } catch (error) {
      console.error('Error updating ministry:', error);
      toast.error('Failed to update ministry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMinistry = (ministryId: string) => {
    const ministry = ministries.find(m => (m.id || (m as any)._id) === ministryId);
    if (ministry) {
      setSelectedMinistry(ministry);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteMinistry = async () => {
    if (!selectedMinistry) return;
    const ministryId = selectedMinistry.id || (selectedMinistry as any)._id;

    try {
      setIsSubmitting(true);
      await ministryService.deleteMinistry(ministryId);
      toast.success('Ministry deleted successfully');
      setMinistries(prev => prev.filter(m => (m.id || (m as any)._id) !== ministryId));
      setSelectedMinistry(null);
      setIsDeleteModalOpen(false);
      setSelectedMinistries(prev => {
        const newSet = new Set(prev);
        newSet.delete(ministryId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting ministry:', error);
      toast.error('Failed to delete ministry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMinistries.size === 0) {
      toast.error('Please select ministries to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedMinistries.size} selected ministries?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await ministryService.bulkDeleteMinistries(Array.from(selectedMinistries));
      toast.success(`${selectedMinistries.size} ministries deleted successfully`);
      setMinistries(prev => prev.filter(m => !selectedMinistries.has(m.id || (m as any)._id)));
      setSelectedMinistries(new Set());
    } catch (error) {
      console.error('Error bulk deleting ministries:', error);
      toast.error('Failed to delete selected ministries');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewMinistry = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsDetailsModalOpen(true);
  };

  const handleEditMinistry = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsEditModalOpen(true);
  };

  const handleSelectMinistry = (ministryId: string, isSelected: boolean) => {
    setSelectedMinistries(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(ministryId);
      } else {
        newSet.delete(ministryId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedMinistries(new Set(ministries.map(m => m.id || (m as any)._id).filter(Boolean)));
    } else {
      setSelectedMinistries(new Set());
    }
  };

  const handleApplyFilters = (newFilters: MinistryFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading && ministries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ministry Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage church ministries, participants, and resources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedMinistries.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
            >
              Delete Selected ({selectedMinistries.size})
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 rounded-xl transition-all"
          >
            Create Ministry
          </button>
        </div>
      </div>

      {/* Filters */}
      <MinistryFiltersPanel
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedMinistries.size === ministries.length && ministries.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedMinistries.size > 0 ? `${selectedMinistries.size} selected` : 'Select all'}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {ministries.length} ministries found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Ministries List/Grid */}
      {ministries.length > 0 ? (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {ministries.map((ministry) => {
            const ministryId = ministry.id || (ministry as any)._id;
            return (
              <MinistryCard
                key={ministryId}
                ministry={ministry}
                viewMode={viewMode}
                isSelected={selectedMinistries.has(ministryId)}
                onSelect={(isSelected) => handleSelectMinistry(ministryId, isSelected)}
                onView={handleViewMinistry}
                onEdit={handleEditMinistry}
                onDelete={() => handleDeleteMinistry(ministryId)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ministries found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first ministry.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-2.5 border border-transparent shadow-lg shadow-indigo-100 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Create Your First Ministry
            </button>
          </div>
        </div>
      )}



      {/* Modals */}
      {isCreateModalOpen && (
        <CreateMinistryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateMinistry}
          isSubmitting={isSubmitting}
        />
      )}

      {isEditModalOpen && selectedMinistry && (
        <EditMinistryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMinistry(null);
          }}
          ministry={selectedMinistry}
          onSuccess={handleUpdateMinistry}
          isSubmitting={isSubmitting}
        />
      )}

      {isDetailsModalOpen && selectedMinistry && (
        <MinistryDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedMinistry(null);
          }}
          ministry={selectedMinistry}
          onEdit={handleEditMinistry}
          onDelete={() => handleDeleteMinistry(selectedMinistry.id || (selectedMinistry as any)._id)}
        />
      )}

      {isDeleteModalOpen && selectedMinistry && (
        <DeleteMinistryModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedMinistry(null);
          }}
          onConfirm={confirmDeleteMinistry}
          ministry={selectedMinistry}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}