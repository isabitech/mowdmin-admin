import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaService } from '@/services/mediaService';
import { CreateMediaRequest, UpdateMediaRequest } from '@/services/mediaSchemas';
import toast from 'react-hot-toast';

export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (filters: any) => [...mediaKeys.lists(), filters] as const,
};

export function useMedia(filters: any) {
  return useQuery({
    queryKey: mediaKeys.list(filters),
    queryFn: () => mediaService.getMedia(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMediaRequest) => mediaService.createMedia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Media created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create media');
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaRequest }) =>
      mediaService.updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Media updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update media');
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Media deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete media');
    },
  });
}
