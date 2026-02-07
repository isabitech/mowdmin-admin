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
import toast from 'react-hot-toast';

export default function MinistryManager() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMinistries, setSelectedMinistries] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<MinistryFilters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  const loadMinistries = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ministryService.getMinistries(currentPage, 20, filters);
      setMinistries(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading ministries:', error);
      toast.error('Failed to load ministries');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

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

  const handleDeleteMinistry = async (ministryId: string) => {
    if (!confirm('Are you sure you want to delete this ministry? This action cannot be undone.')) {
      return;
    }

    try {
      await ministryService.deleteMinistry(ministryId);
      toast.success('Ministry deleted successfully');
      setMinistries(prev => prev.filter(m => m.id !== ministryId));
      setSelectedMinistries(prev => {
        const newSet = new Set(prev);
        newSet.delete(ministryId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting ministry:', error);
      toast.error('Failed to delete ministry');
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
      await ministryService.bulkDeleteMinistries(Array.from(selectedMinistries));
      toast.success(`${selectedMinistries.size} ministries deleted successfully`);
      setMinistries(prev => prev.filter(m => !selectedMinistries.has(m.id)));
      setSelectedMinistries(new Set());
    } catch (error) {
      console.error('Error bulk deleting ministries:', error);
      toast.error('Failed to delete selected ministries');
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
      setSelectedMinistries(new Set(ministries.map(m => m.id)));
    } else {
      setSelectedMinistries(new Set());
    }
  };

  const handleApplyFilters = (newFilters: MinistryFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (isLoading && ministries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Delete Selected ({selectedMinistries.size})
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
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
          {ministries.map((ministry) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              viewMode={viewMode}
              isSelected={selectedMinistries.has(ministry.id)}
              onSelect={(isSelected) => handleSelectMinistry(ministry.id, isSelected)}
              onView={handleViewMinistry}
              onEdit={handleEditMinistry}
              onDelete={() => handleDeleteMinistry(ministry.id)}
            />
          ))}
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
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Ministry
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded transition-colors"
          >
            Next
          </button>
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
          onDelete={() => handleDeleteMinistry(selectedMinistry.id)}
        />
      )}
    </div>
  );
}