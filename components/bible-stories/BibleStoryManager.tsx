'use client';

import { useState, useEffect } from 'react';
import { bibleStoryService } from '@/services/bibleStoryService';
import {
  BibleStory,
  BibleStoryStats,
  BibleStoryFilters,
  CreateBibleStoryData,
  UpdateBibleStoryData
} from '@/constant/bibleStoryTypes';
import BibleStoryCard from './BibleStoryCard';
import BibleStoryFiltersPanel from './BibleStoryFiltersPanel';
import BibleStoryStatsCards from './BibleStoryStatsCards';
import CreateBibleStoryModal from './modals/CreateBibleStoryModal';
import EditBibleStoryModal from './modals/EditBibleStoryModal';
import BibleStoryDetailsModal from './modals/BibleStoryDetailsModal';
import toast from 'react-hot-toast';

export default function BibleStoryManager() {
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [stats, setStats] = useState<BibleStoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<BibleStoryFilters>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<BibleStory | null>(null);

  useEffect(() => {
    loadStories();
    loadStats();
  }, [currentPage, filters]);

  const loadStories = async () => {
    try {
      setIsLoading(true);
      const response = await bibleStoryService.getBibleStories(currentPage, 20, filters);
      setStories(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading Bible stories:', error);
      toast.error('Failed to load Bible stories');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await bibleStoryService.getBibleStoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading Bible story statistics:', error);
    }
  };

  const handleCreateStory = async (storyData: CreateBibleStoryData) => {
    try {
      setIsSubmitting(true);
      await bibleStoryService.createBibleStory(storyData);
      toast.success('Bible story created successfully');
      setIsCreateModalOpen(false);
      loadStories();
      loadStats();
    } catch (error) {
      console.error('Error creating Bible story:', error);
      toast.error('Failed to create Bible story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStory = async (storyData: UpdateBibleStoryData) => {
    if (!selectedStory) return;

    try {
      setIsSubmitting(true);
      const updatedStory = await bibleStoryService.updateBibleStory(selectedStory.id, storyData);
      toast.success('Bible story updated successfully');
      setIsEditModalOpen(false);
      setSelectedStory(null);
      setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
      loadStats();
    } catch (error) {
      console.error('Error updating Bible story:', error);
      toast.error('Failed to update Bible story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this Bible story? This action cannot be undone.')) {
      return;
    }

    try {
      await bibleStoryService.deleteBibleStory(storyId);
      toast.success('Bible story deleted successfully');
      setStories(prev => prev.filter(s => s.id !== storyId));
      setSelectedStories(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
      loadStats();
    } catch (error) {
      console.error('Error deleting Bible story:', error);
      toast.error('Failed to delete Bible story');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStories.size === 0) {
      toast.error('Please select stories to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedStories.size} selected stories?`)) {
      return;
    }

    try {
      await bibleStoryService.bulkDeleteBibleStories(Array.from(selectedStories));
      toast.success(`${selectedStories.size} stories deleted successfully`);
      setStories(prev => prev.filter(s => !selectedStories.has(s.id)));
      setSelectedStories(new Set());
      loadStats();
    } catch (error) {
      console.error('Error bulk deleting stories:', error);
      toast.error('Failed to delete selected stories');
    }
  };

  const handleViewStory = (story: BibleStory) => {
    setSelectedStory(story);
    setIsDetailsModalOpen(true);
    // Increment view count
    bibleStoryService.incrementViews(story.id).catch(console.error);
  };

  const handleEditStory = (story: BibleStory) => {
    setSelectedStory(story);
    setIsEditModalOpen(true);
  };

  const handleLikeStory = async (storyId: string) => {
    try {
      await bibleStoryService.likeBibleStory(storyId);
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, likes: s.likes + 1 } : s
      ));
    } catch (error) {
      console.error('Error liking story:', error);
      toast.error('Failed to like story');
    }
  };

  const handleSelectStory = (storyId: string, isSelected: boolean) => {
    setSelectedStories(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(storyId);
      } else {
        newSet.delete(storyId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedStories(new Set(stories.map(s => s.id)));
    } else {
      setSelectedStories(new Set());
    }
  };

  const handleApplyFilters = (newFilters: BibleStoryFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  if (isLoading && stories.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Bible Stories Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage Bible stories for educational and devotional purposes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedStories.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Delete Selected ({selectedStories.size})
            </button>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Story
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && <BibleStoryStatsCards stats={stats} />}

      {/* Filters */}
      <BibleStoryFiltersPanel
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
              checked={selectedStories.size === stories.length && stories.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedStories.size > 0 ? `${selectedStories.size} selected` : 'Select all'}
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {stories.length} stories found
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

      {/* Stories List/Grid */}
      {stories.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {stories.map((story) => (
            <BibleStoryCard
              key={story.id}
              story={story}
              viewMode={viewMode}
              isSelected={selectedStories.has(story.id)}
              onSelect={(isSelected) => handleSelectStory(story.id, isSelected)}
              onView={handleViewStory}
              onEdit={handleEditStory}
              onDelete={() => handleDeleteStory(story.id)}
              onLike={() => handleLikeStory(story.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Bible stories found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first Bible story.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Bible Story
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
        <CreateBibleStoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateStory}
          isSubmitting={isSubmitting}
        />
      )}

      {isEditModalOpen && selectedStory && (
        <EditBibleStoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStory(null);
          }}
          story={selectedStory}
          onSuccess={handleUpdateStory}
          isSubmitting={isSubmitting}
        />
      )}

      {isDetailsModalOpen && selectedStory && (
        <BibleStoryDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedStory(null);
          }}
          story={selectedStory}
          onEdit={handleEditStory}
          onDelete={() => handleDeleteStory(selectedStory.id)}
          onLike={() => handleLikeStory(selectedStory.id)}
        />
      )}
    </div>
  );
}