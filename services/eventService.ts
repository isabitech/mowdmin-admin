import api from './authService';
import { endpoints } from '../constant/endpoints';
import { Event, CreateEventRequest, UpdateEventRequest } from '../constant/eventTypes';
import { ApiResponse } from '../constant/types';

export const eventService = {
  // Get all events
  async getEvents(): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(endpoints.events.list);
    return response.data.data || [];
  },

  // Get single event
  async getEvent(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(endpoints.events.detail(id));
    return response.data.data!;
  },

  // Create event
  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('title', eventData.title);
    formData.append('date', eventData.date);
    formData.append('time', eventData.time);
    formData.append('location', eventData.location);
    formData.append('type', eventData.type);
    
    if (eventData.description) {
      formData.append('description', eventData.description);
    }
    
    if (eventData.capacity) {
      formData.append('capacity', eventData.capacity.toString());
    }
    
    // Append image if provided
    if (eventData.image) {
      formData.append('image', eventData.image);
    }

    const response = await api.post<ApiResponse>(endpoints.events.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update event
  async updateEvent(id: string, eventData: Partial<UpdateEventRequest>): Promise<ApiResponse> {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(eventData).forEach(key => {
      if (key !== 'image' && eventData[key as keyof UpdateEventRequest] !== undefined) {
        const value = eventData[key as keyof UpdateEventRequest];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Append image if provided
    if (eventData.image) {
      formData.append('image', eventData.image);
    }

    const response = await api.put<ApiResponse>(endpoints.events.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete event
  async deleteEvent(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(endpoints.events.delete(id));
    return response.data;
  }
};