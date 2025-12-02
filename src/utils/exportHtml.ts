import type { Project } from '@/types';
import { calculateDashboardStats, getStatusColor, formatDate } from './calculations';

export const generateHtmlReport = (projects: Project[]): string => {
  const stats = calculateDashboardStats(projects);
  const timestamp = new Date().toLocaleString();

  const getStatusBadgeHtml = (status: string) => {
    const colorClass = getStatusColor(status);
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${status.replace('-', ' ').toUpperCase()}</span>`;
  };

  const getPriorityBadgeHtml = (priority: string) => {
    const colorMap: Record<string, string> = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    const colorClass = colorMap[priority] || 'bg-gray-100 text-gray-800';
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${priority.toUpperCase()}</span>`;
  };

  const generateProjectsHtml = () => {
    return projects.map(project => {
      const completedSubtasks = project.tasks.reduce(
        (acc, task) => acc + task.subtasks.filter(subtask => subtask.status === 'completed').length,
        0
      );
      const totalSubtasks = project.tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
      
      const tasksHtml = project.tasks.map(task => {
        const taskCompletedSubtasks = task.subtasks.filter(subtask => subtask.status === 'completed').length;
        const taskProgress = task.subtasks.length > 0 ? Math.round((taskCompletedSubtasks / task.subtasks.length) * 100) : 0;
        
        const subtasksHtml = task.subtasks.map(subtask => `
          <li class="flex items-center space-x-2 text-sm">
            <div class="flex-shrink-0">
              ${subtask.status === 'completed' 
                ? '<div class="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center"><span class="text-white text-xs">✓</span></div>'
                : '<div class="w-4 h-4 border-2 border-gray-300 rounded-sm"></div>'
              }
            </div>
            <span class="${subtask.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-700'}">${subtask.name}</span>
            ${subtask.assignee ? `<span class="text-gray-500">- ${subtask.assignee}</span>` : ''}
          </li>
        `).join('');
        
        return `
          <div class="border-l-4 border-blue-200 pl-4 mb-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">${task.name}</h4>
              <div class="flex items-center space-x-2">
                ${getStatusBadgeHtml(task.status)}
                ${getPriorityBadgeHtml(task.priority)}
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-2">${task.description}</p>
            <div class="grid grid-cols-2 gap-4 text-sm mb-3">
              <div><strong>Assignee:</strong> ${task.assignee || 'Unassigned'}</div>
              <div><strong>Due:</strong> ${task.dueDate ? formatDate(task.dueDate) : 'Not set'}</div>
              <div><strong>Progress:</strong> ${taskProgress}%</div>
              <div><strong>Estimated Hours:</strong> ${task.estimatedHours || 'Not estimated'}</div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div class="bg-blue-600 h-2 rounded-full" style="width: ${taskProgress}%"></div>
            </div>
            <div>
              <h5 class="text-sm font-medium text-gray-800 mb-2">Subtasks (${taskCompletedSubtasks}/${task.subtasks.length} completed):</h5>
              <ul class="space-y-1">
                ${subtasksHtml}
              </ul>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6 break-inside-avoid">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">${project.name}</h3>
              <p class="text-gray-600">${project.description}</p>
            </div>
            <div class="flex items-center space-x-2">
              ${getStatusBadgeHtml(project.status)}
              ${getPriorityBadgeHtml(project.priority)}
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div><strong>Start Date:</strong> ${formatDate(project.startDate)}</div>
            <div><strong>Due Date:</strong> ${formatDate(project.dueDate)}</div>
            <div><strong>Progress:</strong> ${project.progress}%</div>
            <div><strong>Team:</strong> ${project.teamMembers?.join(', ') || 'No team assigned'}</div>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div class="bg-green-600 h-3 rounded-full" style="width: ${project.progress}%"></div>
          </div>
          
          <div class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">
              Tasks Progress: ${completedSubtasks}/${totalSubtasks} subtasks completed
            </h4>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900 mb-3">Tasks (${project.tasks.length}):</h4>
            ${tasksHtml}
          </div>
        </div>
      `;
    }).join('');
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appzcart - Project Management Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { font-size: 12px; }
            .no-print { display: none; }
            .break-inside-avoid { break-inside: avoid; }
            .shadow-lg { box-shadow: none; border: 1px solid #e5e7eb; }
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    </style>
</head>
<body class="bg-gray-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="bg-white rounded-lg shadow-lg p-6 mb-8 text-center">
            <div class="flex items-center justify-center mb-4">
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <span class="text-white font-bold text-xl">A</span>
                </div>
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Appzcart</h1>
                    <p class="text-lg text-gray-600">Project Management Report</p>
                </div>
            </div>
            <p class="text-sm text-gray-500">Generated: ${timestamp}</p>
        </header>

        <!-- Summary Statistics -->
        <section class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Project Summary</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600">${stats.totalProjects}</div>
                    <div class="text-gray-600">Total Projects</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600">${stats.inProgress}</div>
                    <div class="text-gray-600">In Progress</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600">${stats.completed}</div>
                    <div class="text-gray-600">Completed</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl font-bold text-red-600">${stats.overdue}</div>
                    <div class="text-gray-600">Overdue</div>
                </div>
            </div>
        </section>

        <!-- Projects Detail -->
        <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
            <div class="space-y-6">
                ${generateProjectsHtml()}
            </div>
        </section>

        <!-- Footer -->
        <footer class="mt-8 text-center text-sm text-gray-500 border-t pt-4">
            <p>&copy; 2025 Appzcart. All rights reserved.</p>
            <p>This report contains confidential project information.</p>
        </footer>
    </div>
</body>
</html>`;
};

export const downloadHtmlReport = (projects: Project[], filename = 'appzcart-project-report.html') => {
  const htmlContent = generateHtmlReport(projects);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};