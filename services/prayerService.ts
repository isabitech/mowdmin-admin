import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { PrayerPoint, PrayerRequest, CreatePrayerPointRequest, UpdatePrayerPointRequest } from '@/constant/prayerTypes';
import { ApiResponse } from '@/constant/types';

export const prayerService = {
  // Get all prayer points (feed)
  async getPrayerPoints(): Promise<PrayerPoint[]> {
    const response = await api.get<ApiResponse<PrayerPoint[]>>(endpoints.prayer.list);
    return response.data.data || [];
  },

  // Create prayer point (Admin only)
  async createPrayerPoint(prayerData: CreatePrayerPointRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(endpoints.prayer.create, prayerData);
    return response.data;
  },

  // Update prayer point
  async updatePrayerPoint(id: string, prayerData: Partial<UpdatePrayerPointRequest>): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(`/prayer/${id}`, prayerData);
    return response.data;
  },

  // Delete prayer point
  async deletePrayerPoint(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/prayer/${id}`);
    return response.data;
  },

  // Get all prayer requests (Admin only)
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    const response = await api.get<ApiResponse<PrayerRequest[]>>('/prayer-request');
    return response.data.data || [];
  },

  // Update prayer request status
  async updatePrayerRequestStatus(id: string, status: PrayerRequest['status']): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(`/prayer-request/${id}/status`, { status });
    return response.data;
  }
};