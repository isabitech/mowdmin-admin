import api from './authService';
import { endpoints } from '@/constant/endpoints';
import { PrayerPoint, PrayerRequest, CreatePrayerPointRequest, UpdatePrayerPointRequest } from '@/constant/prayerTypes';
import { ApiResponse } from '@/constant/types';

type PrayerRequestApi = Partial<PrayerRequest> & {
  _id?: string;
  user?: {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
};

type PrayerPointApi = Partial<PrayerPoint> & {
  _id?: string;
  prayerRequest?: PrayerRequestApi;
};

const toIsoDateString = (value: unknown): string => {
  const parsedDate =
    value instanceof Date ? value : new Date(typeof value === 'string' ? value : Date.now());

  return Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
};

const normalizePrayerRequest = (request: PrayerRequestApi | null | undefined, index: number): PrayerRequest => ({
  id: request?.id ?? request?._id ?? `prayer-request-${index}`,
  title: request?.title ?? 'Untitled Prayer Request',
  description: request?.description ?? '',
  userId: request?.userId ?? request?.user?.id ?? request?.user?._id ?? '',
  user: request?.user
    ? {
        id: request.user.id ?? request.user._id ?? '',
        name: request.user.name ?? request.user.fullName ?? 'Unknown',
        email: request.user.email ?? '',
      }
    : undefined,
  status: request?.status ?? 'pending',
  isAnonymous: Boolean(request?.isAnonymous),
  createdAt: toIsoDateString(request?.createdAt),
  updatedAt: toIsoDateString(request?.updatedAt),
});

const normalizePrayerPoint = (point: PrayerPointApi | null | undefined, index: number): PrayerPoint => ({
  id: point?.id ?? point?._id ?? `prayer-point-${index}`,
  title: point?.title ?? 'Untitled Prayer Point',
  description: point?.description ?? '',
  prayerRequestId: point?.prayerRequestId ?? point?.prayerRequest?.id ?? point?.prayerRequest?._id ?? undefined,
  prayerRequest: point?.prayerRequest ? normalizePrayerRequest(point.prayerRequest, index) : undefined,
  category: point?.category ?? 'general',
  priority: point?.priority ?? 'medium',
  isActive: typeof point?.isActive === 'boolean' ? point.isActive : true,
  createdAt: toIsoDateString(point?.createdAt),
  updatedAt: toIsoDateString(point?.updatedAt),
});

export const prayerService = {
  // Get all prayer points (feed)
  async getPrayerPoints(): Promise<PrayerPoint[]> {
    const response = await api.get<ApiResponse<PrayerPointApi[]>>(endpoints.prayer.list);
    return Array.isArray(response.data.data)
      ? response.data.data.map((point, index) => normalizePrayerPoint(point, index))
      : [];
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
    const response = await api.get<ApiResponse<PrayerRequestApi[]>>('/prayer-request');
    return Array.isArray(response.data.data)
      ? response.data.data.map((request, index) => normalizePrayerRequest(request, index))
      : [];
  },

  // Update prayer request status
  async updatePrayerRequestStatus(id: string, status: PrayerRequest['status']): Promise<ApiResponse> {
    const response = await api.patch<ApiResponse>(`/prayer-request/${id}/status`, { status });
    return response.data;
  }
};
