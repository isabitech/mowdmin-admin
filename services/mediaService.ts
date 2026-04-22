import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { Media, CreateMediaRequest, UpdateMediaRequest } from './mediaSchemas';
import { ApiResponse } from '@/constant/types';

export const mediaService = {
  // Get all media with pagination and search
  async getMedia(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<{
    data: Media[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      params.append('search', q);
      params.append('q', q);
    }

    if (filters?.category) {
      params.append('category', filters.category);
    }

    const response = await api.get<ApiResponse<Media[]>>(
      `${endpoints.media.list}?${params.toString()}`
    );
    
    const apiData = response.data as any;
    let media: Media[] = [];

    if (Array.isArray(apiData.data)) {
      media = apiData.data;
    } else if (Array.isArray(apiData)) {
      media = apiData;
    } else if (Array.isArray(apiData?.data?.data)) {
      media = apiData.data.data;
    }

    // ---------------- TOTAL (SMART GUESS FALLBACK) ----------------
    const limit = filters?.limit || 50;
    const total =
      apiData?.total ??
      apiData?.totalCount ??
      apiData?.pagination?.total ??
      apiData?.data?.total ??
      (media.length === limit ? (filters?.page || 1) * limit + 1 : media.length);

    return {
      data: media,
      total,
      page: filters?.page || 1,
      limit,
    };
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
    const response = await api.put<ApiResponse>(`${endpoints.media.list}/${id}`, mediaData);
    return response.data;
  },

  // Delete media
  async deleteMedia(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`${endpoints.media.list}/${id}`);
    return response.data;
  }
};