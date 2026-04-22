'use client';

import { useState, useEffect } from 'react';
import {
  useMedia,
  useDeleteMedia,
  useUpdateMedia,
  useCreateMedia
} from '@/hooks/useMedia';
import { Media } from '@/services/mediaSchemas';
import CreateMediaModal from './CreateMediaModal';
import EditMediaModal from './EditMediaModal';
import ViewMediaModal from './ViewMediaModal';
import DeleteMediaModal from './DeleteMediaModal';
import MediaTableRow from './MediaTableRow';

export default function MediaList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewingMedia, setViewingMedia] = useState<Media | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState<Media | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const limit = 10;

  /* ---------------- debounce search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- reset page on search ---------------- */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: response, isLoading } = useMedia({
    page,
    limit,
    search: debouncedSearch,
  });

  const media = response?.data ?? [];
  const total = response?.total ?? 0;
  const hasMore = page * limit < total;

  const createMutation = useCreateMedia();
  const updateMutation = useUpdateMedia();
  const deleteMutation = useDeleteMedia();

  const handleEditMedia = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingMedia) return;
    try {
      await deleteMutation.mutateAsync(deletingMedia._id);
      setIsDeleteModalOpen(false);
      setDeletingMedia(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoading && media.length === 0) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading media...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-indigo-500 bg-white"
          /> */}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
          >
            + Add Media
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {media.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500">No media found</p>
              <button onClick={() => setSearch('')} className="mt-2 text-sm text-indigo-600 font-medium">Clear search</button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3">S/N</th>
                  <th className="px-4 py-3">Content Details</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {media.map((mediaItem, index) => (
                  <MediaTableRow
                    key={mediaItem._id}
                    media={mediaItem}
                    index={(page - 1) * limit + index + 1}
                    onView={() => {
                      setViewingMedia(mediaItem);
                      setIsViewModalOpen(true);
                    }}
                    onEdit={() => handleEditMedia(mediaItem)}
                    onDelete={() => {
                      setDeletingMedia(mediaItem);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Simplified Pagination */}
        <div className="flex items-center justify-center gap-4 p-4 border-t bg-gray-50">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-gray-900 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50 transition-all font-medium"
          >
            ← Previous
          </button>

          <span className="text-sm font-bold text-gray-600">
            Page {page}
          </span>

          <button
            onClick={() => {
              if (!hasMore) return;
              setPage((p) => p + 1);
            }}
            disabled={!hasMore}
            className="px-4 py-2 border text-gray-900 border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50 transition-all font-medium"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateMediaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isLoading={createMutation.isPending}
      />

      <EditMediaModal
        media={editingMedia}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMedia(null);
        }}
        isLoading={updateMutation.isPending}
      />

      <ViewMediaModal
        media={viewingMedia}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingMedia(null);
        }}
      />

      <DeleteMediaModal
        isOpen={isDeleteModalOpen}
        title={deletingMedia?.title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}