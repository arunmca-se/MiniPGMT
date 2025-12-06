import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesService } from '../services/api/issuesService';
import type { Issue } from '../types';

// Query keys
export const issueKeys = {
  all: ['issues'] as const,
  lists: () => [...issueKeys.all, 'list'] as const,
  list: (projectKey?: string, sprintId?: string) =>
    [...issueKeys.lists(), { projectKey, sprintId }] as const,
  details: () => [...issueKeys.all, 'detail'] as const,
  detail: (key: string) => [...issueKeys.details(), key] as const,
  myIssues: () => [...issueKeys.all, 'my-issues'] as const,
};

// Get issues by project
export const useIssues = (projectKey?: string) => {
  return useQuery({
    queryKey: issueKeys.list(projectKey),
    queryFn: () => (projectKey ? issuesService.getIssuesByProject(projectKey) : Promise.resolve([])),
    enabled: !!projectKey,
  });
};

// Get issue by key
export const useIssue = (key: string) => {
  return useQuery({
    queryKey: issueKeys.detail(key),
    queryFn: () => issuesService.getIssueByKey(key),
    enabled: !!key,
  });
};

// Get my issues
export const useMyIssues = () => {
  return useQuery({
    queryKey: issueKeys.myIssues(),
    queryFn: () => issuesService.getMyIssues(),
  });
};

// Get issues by sprint
export const useIssuesBySprint = (sprintId?: string) => {
  return useQuery({
    queryKey: issueKeys.list(undefined, sprintId),
    queryFn: () => (sprintId ? issuesService.getIssuesBySprint(sprintId) : Promise.resolve([])),
    enabled: !!sprintId,
  });
};

// Create issue
export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issue: Partial<Issue>) => issuesService.createIssue(issue),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.myIssues() });
      if (data.projectKey) {
        queryClient.invalidateQueries({ queryKey: issueKeys.list(data.projectKey) });
      }
    },
  });
};

// Update issue
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, issue }: { key: string; issue: Partial<Issue> }) =>
      issuesService.updateIssue(key, issue),
    onMutate: async ({ key, issue }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: issueKeys.detail(key) });

      // Snapshot previous value
      const previousIssue = queryClient.getQueryData(issueKeys.detail(key));

      // Optimistically update
      queryClient.setQueryData(issueKeys.detail(key), (old: Issue | undefined) => ({
        ...old,
        ...issue,
      }));

      return { previousIssue };
    },
    onError: (err, { key }, context) => {
      // Rollback on error
      if (context?.previousIssue) {
        queryClient.setQueryData(issueKeys.detail(key), context.previousIssue);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.detail(data.key) });
      queryClient.invalidateQueries({ queryKey: issueKeys.myIssues() });
      if (data.projectKey) {
        queryClient.invalidateQueries({ queryKey: issueKeys.list(data.projectKey) });
      }
    },
  });
};

// Delete issue
export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => issuesService.deleteIssue(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: issueKeys.myIssues() });
    },
  });
};
