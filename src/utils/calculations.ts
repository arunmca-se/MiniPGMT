import type { Project, DashboardStats } from '@/types';

export const calculateDashboardStats = (projects: Project[]): DashboardStats => {
  const totalProjects = projects.length;
  const inProgress = projects.filter(p => p.status === 'in-progress').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const overdue = projects.filter(p => {
    const today = new Date();
    const dueDate = new Date(p.dueDate);
    return today > dueDate && p.status !== 'completed';
  }).length;

  return {
    totalProjects,
    inProgress,
    completed,
    overdue
  };
};

export const getStatusColor = (status: string): string => {
  const statusColors = {
    // Project statuses
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    
    // Task statuses
    'to-do': 'bg-gray-100 text-gray-800',
    'in-review': 'bg-purple-100 text-purple-800',
    'blocked': 'bg-red-100 text-red-800',
    'done': 'bg-green-100 text-green-800',
    
    // Priority
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800',
  };

  return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors = {
    'low': 'bg-gray-100 text-gray-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-red-100 text-red-700',
  };

  return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-700';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();
  const due = new Date(dueDate);
  return today > due;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};