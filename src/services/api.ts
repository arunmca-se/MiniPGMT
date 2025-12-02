import type { Project, Task, Subtask, DashboardStats } from '@/types';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Projects API
export const projectsApi = {
  // Get all projects
  getAll: async (): Promise<Project[]> => {
    return apiRequest<Project[]>('/projects');
  },

  // Get single project by ID
  getById: async (id: string): Promise<Project> => {
    return apiRequest<Project>(`/projects/${id}`);
  },

  // Create new project
  create: async (projectData: Omit<Project, 'id' | 'progress' | 'tasks'>): Promise<Project> => {
    return apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Update project
  update: async (id: string, projectData: Partial<Project>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tasks API
export const tasksApi = {
  // Get all tasks for a project
  getByProject: async (projectId: string): Promise<Task[]> => {
    return apiRequest<Task[]>(`/tasks/project/${projectId}`);
  },

  // Create new task
  create: async (taskData: Omit<Task, 'id' | 'subtasks'> & { projectId: string }): Promise<Task> => {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update task
  update: async (id: string, taskData: Partial<Task>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete task
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Subtasks API
export const subtasksApi = {
  // Create new subtask
  create: async (subtaskData: Omit<Subtask, 'id'> & { taskId: string }): Promise<Subtask> => {
    return apiRequest<Subtask>('/subtasks', {
      method: 'POST',
      body: JSON.stringify(subtaskData),
    });
  },

  // Update subtask
  update: async (id: string, subtaskData: Partial<Subtask>): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/subtasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subtaskData),
    });
  },

  // Toggle subtask completion status
  toggle: async (id: string): Promise<{ message: string; newStatus: string }> => {
    return apiRequest<{ message: string; newStatus: string }>(`/subtasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Delete subtask
  delete: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/subtasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/dashboard/stats');
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string; timestamp: string }> => {
  return apiRequest<{ status: string; message: string; timestamp: string }>('/health');
};