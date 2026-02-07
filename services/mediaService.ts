import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { Media, CreateMediaRequest, UpdateMediaRequest } from '@/constant/mediaTypes';
import { ApiResponse } from '@/constant/types';

export const mediaService = {
  // Get all media
  async getMedia(): Promise<Media[]> {
    const response = await api.get<ApiResponse<Media[]>>(endpoints.media.list);
    return response.data.data || [];
  },

  // Get videos (alias for media)
  async getVideos(): Promise<Media[]> {
    const response = await api.get<ApiResponse<Media[]>>(endpoints.media.videos);
    return response.data.data || [];
  },

  // Create media
  async createMedia(mediaData: CreateMediaRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.media.create, mediaData);
    return response.data;
  },

  // Update media
  async updateMedia(id: string, mediaData: Partial<UpdateMediaRequest>): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(`/media/${id}`, mediaData);
    return response.data;
  },

  // Delete media
  async deleteMedia(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/media/${id}`);
    return response.data;
  }
};