import apiClient from './client';
import type { Project } from '../../types';

export const projectsService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/api/projects');
    return response.data;
  },

  async getProjectByKey(key: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/api/projects/${key}`);
    return response.data;
  },

  async getMyProjects(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>('/api/projects/my-projects');
    return response.data;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await apiClient.post<Project>('/api/projects', project);
    return response.data;
  },

  async updateProject(key: string, project: Partial<Project>): Promise<Project> {
    const response = await apiClient.put<Project>(`/api/projects/${key}`, project);
    return response.data;
  },

  async deleteProject(key: string): Promise<void> {
    await apiClient.delete(`/api/projects/${key}`);
  },
};
