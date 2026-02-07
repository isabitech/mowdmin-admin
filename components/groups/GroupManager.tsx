'use client';

import { useState, useEffect, useCallback } from 'react';
import { groupService } from '@/services/groupService';
import { 
  Group,
  GroupFilters,
  CreateGroupData,
  UpdateGroupData
} from '@/constant/groupTypes';
import GroupCard from './GroupCard';
import GroupFiltersPanel from './GroupFiltersPanel';
import CreateGroupModal from './modals/CreateGroupModal';
import EditGroupModal from './modals/EditGroupModal';
import GroupDetailsModal from './modals/GroupDetailsModal';
import toast from 'react-hot-toast';

export default function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<GroupFilters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const loadGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await groupService.getGroups(currentPage, 20, filters);
      setGroups(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleCreateGroup = async (groupData: CreateGroupData) => {
    try {
      setIsSubmitting(true);
      await groupService.createGroup(groupData);
      toast.success('Group created successfully');
      setIsCreateModalOpen(false);
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateGroup = async (groupData: UpdateGroupData) => {
    if (!selectedGroup) return;

    try {
      setIsSubmitting(true);
      const updatedGroup = await groupService.updateGroup(selectedGroup.id, groupData);
      toast.success('Group updated successfully');
      setIsEditModalOpen(false);
      setSelectedGroup(null);
      setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await groupService.deleteGroup(groupId);
      toast.success('Group deleted successfully');
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setSelectedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGroups.size === 0) {
      toast.error('Please select groups to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedGroups.size} selected groups? This action cannot be undone.`)) {
      return;
    }

    try {
      await groupService.bulkDeleteGroups(Array.from(selectedGroups));
      toast.success(`${selectedGroups.size} groups deleted successfully`);
      setGroups(prev => prev.filter(g => !selectedGroups.has(g.id)));
      setSelectedGroups(new Set());
    } catch (error) {
      console.error('Error bulk deleting groups:', error);
      toast.error('Failed to delete selected groups');
    }
  };

  const handleViewGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsDetailsModalOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsEditModalOpen(true);
  };

  const handleSelectGroup = (groupId: string, isSelected: boolean) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(groupId);
      } else {
        newSet.delete(groupId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedGroups(new Set(groups.map(g => g.id)));
    } else {
      setSelectedGroups(new Set());
    }
  };

  const handleApplyFilters = (newFilters: GroupFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleExportGroups = async () => {
    if (selectedGroups.size === 0) {
      toast.error('Please select groups to export');
      return;
    }

    try {
      // Note: This would need to be implemented as a bulk export endpoint
      toast.error('Export functionality coming soon');
    } catch (error) {
      console.error('Error exporting groups:', error);
      toast.error('Failed to export groups');
    }
  };

  if (isLoading && groups.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage church groups, members, and meeting schedules
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedGroups.size > 0 && (
            <>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
              >
                Delete Selected ({selectedGroups.size})
              </button>
              <button
                onClick={handleExportGroups}
                className="px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
              >
                Export Selected
              </button>
            </>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Filters */}
      <GroupFiltersPanel
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
              checked={selectedGroups.size === groups.length && groups.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedGroups.size > 0 ? `${selectedGroups.size} selected` : 'Select all'}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {groups.length} groups found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Groups List/Grid */}
      {groups.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              viewMode={viewMode}
              isSelected={selectedGroups.has(group.id)}
              onSelect={(isSelected) => handleSelectGroup(group.id, isSelected)}
              onView={handleViewGroup}
              onEdit={handleEditGroup}
              onDelete={() => handleDeleteGroup(group.id)}
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first church group.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Group
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
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
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
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateGroup}
          isSubmitting={isSubmitting}
        />
      )}

      {isEditModalOpen && selectedGroup && (
        <EditGroupModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onSuccess={handleUpdateGroup}
          isSubmitting={isSubmitting}
        />
      )}

      {isDetailsModalOpen && selectedGroup && (
        <GroupDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onEdit={handleEditGroup}
          onDelete={() => handleDeleteGroup(selectedGroup.id)}
        />
      )}
    </div>
  );
}