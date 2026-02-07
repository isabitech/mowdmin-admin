'use client';

import { useState, useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { Event } from '@/constant/eventTypes';
import EventTableRow from './EventTableRow';
import CreateEventModal from './CreateEventModal';
import EditEventModal from './EditEventModal';


export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: any) => {
    try {
      await eventService.createEvent(eventData);
      setIsCreateModalOpen(false);
      await fetchEvents(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    
    try {
      await eventService.updateEvent(editingEvent.id, eventData);
      setIsEditModalOpen(false);
      setEditingEvent(null);
      await fetchEvents(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(id);
      await fetchEvents(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete event');
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
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage church events, crusades, baptisms, and conferences.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Event
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
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No events found</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <EventTableRow
                      key={event.id}
                      event={event}
                      onEdit={() => handleEditEvent(event)}
                      onDelete={() => handleDeleteEvent(event.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
      />

      {/* Edit Event Modal */}
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