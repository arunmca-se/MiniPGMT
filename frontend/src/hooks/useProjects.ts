import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/api/projectsService';
import type { Project } from '../types';

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (key: string) => [...projectKeys.details(), key] as const,
  myProjects: () => [...projectKeys.all, 'my-projects'] as const,
};

// Get all projects
export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectsService.getAllProjects(),
  });
};

// Get project by key
export const useProject = (key: string) => {
  return useQuery({
    queryKey: projectKeys.detail(key),
    queryFn: () => projectsService.getProjectByKey(key),
    enabled: !!key,
  });
};

// Get my projects
export const useMyProjects = () => {
  return useQuery({
    queryKey: projectKeys.myProjects(),
    queryFn: () => projectsService.getMyProjects(),
  });
};

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Partial<Project>) => projectsService.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
    },
  });
};

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, project }: { key: string; project: Partial<Project> }) =>
      projectsService.updateProject(key, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.key) });
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => projectsService.deleteProject(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.myProjects() });
    },
  });
};
