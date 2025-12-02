export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
export type TaskStatus = 'to-do' | 'in-progress' | 'in-review' | 'blocked' | 'done';
export type SubtaskStatus = 'pending' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  name: string;
  status: SubtaskStatus;
  assignee?: string;
  notes?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  estimatedHours?: number;
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  dueDate: string;
  progress: number; // 0-100
  teamMembers?: string[];
  tasks: Task[];
}

export interface DashboardStats {
  totalProjects: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface ProjectFilters {
  status: ProjectStatus | 'all';
  search: string;
}