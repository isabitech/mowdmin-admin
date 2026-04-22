import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...userKeys.lists(), filters.page, filters.limit, filters.search] as const,
};

export function useUsers(filters: { page: number; limit: number; search: string }) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => authService.getAdminUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function usePromoteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => authService.promoteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User privileges updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user privileges');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: any }) =>
      authService.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
}

export function useTriggerOtp() {
  return useMutation({
    mutationFn: (userId: string) => authService.triggerUserOtp(userId),
    onSuccess: () => {
      toast.success('Password reset OTP sent to user\'s email');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to trigger OTP');
    },
  });
}
