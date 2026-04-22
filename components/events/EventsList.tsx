'use client';

import { useState } from 'react';
import { useEvents, useDeleteEvent, useUpdateEvent, useCreateEvent } from '@/hooks/useEvents';
import { Event } from '@/constant/eventTypes';
import EventTableRow from './EventTableRow';
import CreateEventModal from './CreateEventModal';
import EditEventModal from './EditEventModal';

export default function EventsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // TanStack Query & Mutations
  const { data: response, isLoading, error: queryError } = useEvents({ page, limit });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const events = response?.data ?? [];
  const total = response?.total ?? 0;
  const hasMore = page * limit < total;

  const handleCreateEvent = async (eventData: any) => {
    await createMutation.mutateAsync(eventData);
    setIsCreateModalOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    await updateMutation.mutateAsync({ id: editingEvent._id, data: eventData });
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  /* ---------------- Loading State ---------------- */

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500 animate-pulse">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Events Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage church events, crusades, and conferences.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
        >
          Create Event
        </button>
      </div>

      {/* Error Message */}
      {(queryError || createMutation.error || updateMutation.error || deleteMutation.error) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded shadow-sm text-sm text-red-700">
          {(queryError as any)?.response?.data?.message || 'An error occurred while processing events.'}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {events.length === 0 ? (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 text-gray-400 mb-4">
                📅
              </div>
              <h3 className="text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                + New Event
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-tight">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">S/N</th>
                  <th className="px-6 py-3 text-left font-semibold">Event Details</th>
                  <th className="px-6 py-3 text-left font-semibold">Schedule</th>
                  <th className="px-6 py-3 text-left font-semibold">Location</th>
                  <th className="px-6 py-3 text-left font-semibold">Type</th>
                  <th className="px-6 py-3 text-left font-semibold">Register</th>
                  <th className="px-6 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {events.map((event, index) => (
                  <EventTableRow
                    key={event._id}
                    event={event}
                    index={(page - 1) * limit + index + 1}
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event._id)}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Smart Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-center gap-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-600 font-medium">
            Page {page}
          </span>

          <button
            onClick={() => {
              if (!hasMore) return;
              setPage((p: number) => p + 1);
            }}
            disabled={!hasMore}
            className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
      />

      <EditEventModal
        event={editingEvent}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleUpdateEvent}
      />
    </div>
  );
}
