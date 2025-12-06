import apiClient from './client';
import type { Issue } from '../../types';

export const issuesService = {
  async getIssuesByProject(projectKey: string): Promise<Issue[]> {
    const response = await apiClient.get<Issue[]>('/api/issues', {
      params: { projectKey },
    });
    return response.data;
  },

  async getIssueByKey(key: string): Promise<Issue> {
    const response = await apiClient.get<Issue>(`/api/issues/${key}`);
    return response.data;
  },

  async getMyIssues(): Promise<Issue[]> {
    const response = await apiClient.get<Issue[]>('/api/issues/my-issues');
    return response.data;
  },

  async getIssuesBySprint(sprintId: string): Promise<Issue[]> {
    const response = await apiClient.get<Issue[]>(`/api/issues/sprint/${sprintId}`);
    return response.data;
  },

  async createIssue(issue: Partial<Issue>): Promise<Issue> {
    const response = await apiClient.post<Issue>('/api/issues', issue);
    return response.data;
  },

  async updateIssue(key: string, issue: Partial<Issue>): Promise<Issue> {
    const response = await apiClient.put<Issue>(`/api/issues/${key}`, issue);
    return response.data;
  },

  async deleteIssue(key: string): Promise<void> {
    await apiClient.delete(`/api/issues/${key}`);
  },
};
