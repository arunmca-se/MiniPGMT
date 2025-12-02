import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subtasksApi } from '@/services/api';
import type { Subtask } from '@/types';
import { projectKeys } from './useProjects';

// Hook to create a new subtask
export function useCreateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtaskData: Omit<Subtask, 'id'> & { taskId: string; projectId: string }) =>
      subtasksApi.create(subtaskData),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch with new subtask
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      // Also invalidate projects list to update progress
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook to update a subtask
export function useUpdateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subtask> & { projectId: string } }) =>
      subtasksApi.update(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch with updated subtask
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.data.projectId) });
      // Also invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook to toggle subtask completion status
export function useToggleSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      subtasksApi.toggle(id),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch with updated progress
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      // Also invalidate projects list to update dashboard
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook to delete a subtask
export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; projectId: string }) =>
      subtasksApi.delete(id),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch without deleted subtask
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      // Also invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
