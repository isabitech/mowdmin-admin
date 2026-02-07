import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { MediaCategory } from '@/constant/mediaTypes';
import { ApiResponse } from '@/constant/types';

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export const mediaCategoryService = {
  // Get all media categories
  async getCategories(): Promise<MediaCategory[]> {
    const response = await api.get<ApiResponse<MediaCategory[]>>(endpoints.mediaCategory.list);
    return response.data.data || [];
  },

  // Create media category
  async createCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.mediaCategory.create, categoryData);
    return response.data;
  },

  // Update media category
  async updateCategory(id: string, categoryData: Partial<CreateCategoryRequest>): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(endpoints.mediaCategory.update(id), categoryData);
    return response.data;
  },

  // Delete media category
  async deleteCategory(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(endpoints.mediaCategory.delete(id));
    return response.data;
  }
};