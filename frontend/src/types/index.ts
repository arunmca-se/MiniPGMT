import { type PriorityLevel, type StatusType } from '../design-system/tokens/colors';
import { type IssueType } from '../design-system/patterns/IssueCard';
import { type ProjectHealth } from '../design-system/patterns/ProjectCard';

/**
 * Core domain types for the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  health: ProjectHealth;
  progress: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  teamMembers: User[];
  issueCount: {
    total: number;
    completed: number;
  };
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description?: string;
  type: IssueType;
  priority: PriorityLevel;
  status: StatusType;
  projectKey: string;
  assignee?: User;
  reporter: User;
  storyPoints?: number;
  dueDate?: string;
  estimatedHours?: number;
  loggedHours?: number;
  createdAt: string;
  updatedAt: string;
  sprint?: {
    id: string;
    name: string;
  };
  parent?: {
    id: string;
    key: string;
  };
  subtasks?: Issue[];
  commentCount: number;
  attachmentCount: number;
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  projectKey: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  issues: Issue[];
}

export interface Activity {
  id: string;
  type: 'issue_created' | 'issue_updated' | 'status_changed' | 'comment_added' | 'assigned';
  user: User;
  issue?: Issue;
  project?: Project;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalIssues: number;
  myAssignedIssues: number;
  completedThisWeek: number;
  overdueIssues: number;
}

export interface Comment {
  id: string;
  issueKey: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  issueKey: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: User;
  uploadedAt: string;
  url: string;
}

export interface TimeLog {
  id: string;
  issueKey: string;
  user: User;
  timeSpent: number; // in minutes
  description?: string;
  loggedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  relatedIssue?: Issue;
  relatedProject?: Project;
}
