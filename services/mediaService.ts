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
    const hasThumbnailFile = mediaData.thumbnailFile instanceof File;

    if (hasThumbnailFile) {
      const formData = new FormData();

      formData.append('title', mediaData.title);
      formData.append('type', mediaData.type);
      formData.append('media_url', mediaData.media_url);

      if (mediaData.description) {
        formData.append('description', mediaData.description);
      }

      if (mediaData.category_id) {
        formData.append('category_id', mediaData.category_id);
      }

      if (mediaData.author) {
        formData.append('author', mediaData.author);
      }

      if (mediaData.duration) {
        formData.append('duration', mediaData.duration);
      }

      if (typeof mediaData.is_downloadable === 'boolean') {
        formData.append('is_downloadable', mediaData.is_downloadable.toString());
      }

      if (typeof mediaData.isLive === 'boolean') {
        formData.append('isLive', mediaData.isLive.toString());
      }

      if (mediaData.thumbnailFile) {
        formData.append('thumbnail', mediaData.thumbnailFile);
      }

      const response = await api.post<ApiResponse>(endpoints.media.create, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await api.post<ApiResponse>(endpoints.media.create, {
      ...mediaData,
      thumbnailFile: undefined,
    });
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
