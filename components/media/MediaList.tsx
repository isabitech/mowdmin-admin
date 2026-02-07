'use client';

import { useState, useEffect } from 'react';
import { mediaService } from '@/services/mediaService';
import { Media } from '@/constant/mediaTypes';
import CreateMediaModal from './CreateMediaModal';
import EditMediaModal from './EditMediaModal';
import MediaTableRow from './MediaTableRow';


export default function MediaList() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getMedia();
      setMedia(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCreateMedia = async (mediaData: any) => {
    try {
      await mediaService.createMedia(mediaData);
      setIsCreateModalOpen(false);
      await fetchMedia(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create media');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEditMedia = (mediaItem: Media) => {
    setEditingMedia(mediaItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateMedia = async (mediaData: any) => {
    if (!editingMedia) return;
    
    try {
      await mediaService.updateMedia(editingMedia._id, mediaData);
      setIsEditModalOpen(false);
      setEditingMedia(null);
      await fetchMedia(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update media');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) {
      return;
    }

    try {
      await mediaService.deleteMedia(id);
      await fetchMedia(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete media');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage videos, live streams, and media content for your church.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Media
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {media.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No media found</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Add Your First Media
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Media
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {media.map((mediaItem) => (
                    <MediaTableRow
                      key={mediaItem._id}
                      media={mediaItem}
                      onEdit={() => handleEditMedia(mediaItem)}
                      onDelete={() => handleDeleteMedia(mediaItem._id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Media Modal */}
      <CreateMediaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateMedia}
      />

      {/* Edit Media Modal */}
      <EditMediaModal
        media={editingMedia}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMedia(null);
        }}
        onSave={handleUpdateMedia}
      />
    </div>
  );
}