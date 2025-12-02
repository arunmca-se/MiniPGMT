import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api';
import type { Task } from '@/types';
import { projectKeys } from './useProjects';

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Omit<Task, 'id' | 'subtasks'> & { projectId: string }) =>
      tasksApi.create(taskData),
    onSuccess: (_data, variables) => {
      // Invalidate the specific project to refetch with new task
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      // Also invalidate projects list to update counts
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> & { projectId?: string } }) =>
      tasksApi.update(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch with updated task
      if (variables.data.projectId) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.data.projectId) });
      }
      // Also invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: { taskId: string; projectId: string }) =>
      tasksApi.delete(taskId),
    onSuccess: (_data, variables) => {
      // Invalidate the project to refetch without deleted task
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId) });
      // Also invalidate projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
