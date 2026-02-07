'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { bibleVerseService } from '@/services/bibleVerseService';
import { BibleVerse, BibleVerseFilters } from '@/constant/bibleVerseTypes';
import { BibleVerseCard } from './BibleVerseCard';
import { BibleVerseStatsCards } from './BibleVerseStatsCards';
import { BibleVerseFiltersPanel } from './BibleVerseFiltersPanel';
import { CreateBibleVerseModal } from './modals/CreateBibleVerseModal';
import { EditBibleVerseModal } from './modals/EditBibleVerseModal';
import { BibleVerseDetailsModal } from './modals/BibleVerseDetailsModal';

export const BibleVerseManager: React.FC = () => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<BibleVerseFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detailed'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  
  // Search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'book' | 'bookmarks' | 'created' | 'updated'>('book');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchVerses();
  }, [currentPage, filters, sortBy, sortOrder]);

  const fetchVerses = async () => {
    try {
      setLoading(true);
      const searchFilters = searchTerm
        ? { ...filters, search: searchTerm }
        : filters;
        
      const response = await bibleVerseService.getBibleVerses(currentPage, 20, searchFilters);
      setVerses(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to fetch Bible verses');
      console.error('Error fetching verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVerses();
  };

  const handleCreateVerse = async () => {
    setShowCreateModal(false);
    await fetchVerses();
    toast.success('Bible verse created successfully!');
  };

  const handleUpdateVerse = async () => {
    setShowEditModal(false);
    setSelectedVerse(null);
    await fetchVerses();
    toast.success('Bible verse updated successfully!');
  };

  const handleDeleteVerse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Bible verse?')) return;
    
    try {
      await bibleVerseService.deleteBibleVerse(id);
      await fetchVerses();
      toast.success('Bible verse deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete Bible verse');
      console.error('Error deleting verse:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVerses.length === 0) {
      toast.error('Please select verses to delete');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedVerses.length} verses?`)) return;
    
    try {
      await bibleVerseService.bulkDeleteBibleVerses(selectedVerses);
      setSelectedVerses([]);
      await fetchVerses();
      toast.success(`${selectedVerses.length} verses deleted successfully!`);
    } catch (error) {
      toast.error('Failed to delete selected verses');
      console.error('Error bulk deleting verses:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'json' | 'csv') => {
    try {
      const blob = await bibleVerseService.exportVerses(format, filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bible_verses.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Bible verses exported successfully!');
    } catch (error) {
      toast.error('Failed to export Bible verses');
      console.error('Error exporting verses:', error);
    }
  };

  const handleBookmarkVerse = async (verse: BibleVerse) => {
    try {
      await bibleVerseService.bookmarkVerse(verse.id);
      await fetchVerses();
      toast.success('Verse bookmarked!');
    } catch (error) {
      toast.error('Failed to bookmark verse');
      console.error('Error bookmarking verse:', error);
    }
  };

  const handleToggleVerseSelection = (verseId: string) => {
    setSelectedVerses(prev => 
      prev.includes(verseId) 
        ? prev.filter(id => id !== verseId)
        : [...prev, verseId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVerses(
      selectedVerses.length === verses.length 
        ? [] 
        : verses.map(verse => verse.id)
    );
  };

  if (loading && verses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <BibleVerseStatsCards />

      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Bible Verses</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {verses.length} verses
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Verse
          </button>
          
          {selectedVerses.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Selected ({selectedVerses.length})
            </button>
          )}
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              🗺️
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              📋
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`p-2 rounded ${viewMode === 'detailed' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              🗎️
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Filters
          </button>
          
          <div className="relative">
            <select
              onChange={(e) => handleExport(e.target.value as any)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              value=""
            >
              <option value="" disabled>Export</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search verses by text, book, or reference..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Search
                </span>
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="book">Sort by Book</option>
            <option value="bookmarks">Sort by Bookmarks</option>
            <option value="created">Sort by Created</option>
            <option value="updated">Sort by Updated</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <BibleVerseFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={() => {
            setCurrentPage(1);
            fetchVerses();
          }}
          onResetFilters={() => {
            setFilters({});
            setCurrentPage(1);
            fetchVerses();
          }}
        />
      )}

      {/* Bulk Actions */}
      {verses.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedVerses.length === verses.length && verses.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Select All ({selectedVerses.length}/{verses.length})
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Verses Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        viewMode === 'list' ? 'grid-cols-1' :
        'grid-cols-1'
      }`}>
        {verses.map((verse) => (
          <BibleVerseCard
            key={verse.id}
            verse={verse}
            viewMode={viewMode}
            isSelected={selectedVerses.includes(verse.id)}
            onSelect={() => handleToggleVerseSelection(verse.id)}
            onEdit={() => {
              setSelectedVerse(verse);
              setShowEditModal(true);
            }}
            onDelete={() => handleDeleteVerse(verse.id)}
            onViewDetails={() => {
              setSelectedVerse(verse);
              setShowDetailsModal(true);
            }}
            onBookmark={() => handleBookmarkVerse(verse)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && verses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bible verses found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first Bible verse'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Bible Verse
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateBibleVerseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateVerse}
      />
      
      {selectedVerse && (
        <EditBibleVerseModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVerse(null);
          }}
          onSuccess={handleUpdateVerse}
          verse={selectedVerse}
        />
      )}
      
      {selectedVerse && (
        <BibleVerseDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedVerse(null);
          }}
          verse={selectedVerse}
        />
      )}
    </div>
  );
};