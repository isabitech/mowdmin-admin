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
import DeleteGroupModal from './modals/DeleteGroupModal';
import toast from 'react-hot-toast';

export default function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<GroupFilters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // 🔥 LOAD ALL GROUPS (no pagination)
  const loadGroups = useCallback(async () => {
    try {
      setIsLoading(true);

      // pass a very large limit OR remove pagination params entirely
      const response = await groupService.getGroups(1, 1000, filters);

      setGroups(response.data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

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

      // update locally
      setGroups(prev =>
        prev.map(g => g.id === updatedGroup.id ? updatedGroup : g)
      );
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroup) return;

    try {
      setIsSubmitting(true);
      const groupId = selectedGroup.id || (selectedGroup as any)._id;

      await groupService.deleteGroup(groupId);

      toast.success('Group deleted successfully');

      // update UI
      setGroups(prev =>
        prev.filter(g => (g.id || (g as any)._id) !== groupId)
      );

      setSelectedGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });

      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedGroups.size === 0) {
      toast.error('Please select groups to delete');
      return;
    }

    if (!confirm(`Delete ${selectedGroups.size} groups? This cannot be undone.`)) {
      return;
    }

    try {
      await groupService.bulkDeleteGroups(Array.from(selectedGroups));

      toast.success(`${selectedGroups.size} groups deleted`);

      setGroups(prev =>
        prev.filter(g => !selectedGroups.has(g.id))
      );

      setSelectedGroups(new Set());
    } catch (error) {
      console.error(error);
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
      isSelected ? newSet.add(groupId) : newSet.delete(groupId);
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedGroups(new Set(groups.map(g => g.id || (g as any)._id)));
    } else {
      setSelectedGroups(new Set());
    }
  };

  const handleApplyFilters = (newFilters: GroupFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (isLoading && groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups Management</h1>
          <p className="text-sm text-gray-600">
            Manage church groups, members, and schedules
          </p>
        </div>

        <div className="flex gap-3">
          {selectedGroups.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md"
            >
              Delete ({selectedGroups.size})
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedGroups.size === groups.length && groups.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-sm">
            {selectedGroups.size > 0
              ? `${selectedGroups.size} selected`
              : 'Select all'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Groups */}
      {groups.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {groups.map(group => (
            <GroupCard
              key={group.id || (group as any)._id}
              group={group}
              viewMode={viewMode}
              isSelected={selectedGroups.has(group.id || (group as any)._id)}
              onSelect={(isSelected) =>
                handleSelectGroup(group.id || (group as any)._id, isSelected)
              }
              onView={handleViewGroup}
              onEdit={handleEditGroup}
              onDelete={() => handleDeleteGroup(group)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No groups found</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create Group
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
          onEdit={(group) => {
            setIsDetailsModalOpen(false);
            handleEditGroup(group);
          }}
          onDelete={() => {
            setIsDetailsModalOpen(false);
            handleDeleteGroup(selectedGroup);
          }}
        />
      )}

      {isDeleteModalOpen && selectedGroup && (
        <DeleteGroupModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedGroup(null);
          }}
          onConfirm={handleConfirmDelete}
          groupName={selectedGroup.name}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}