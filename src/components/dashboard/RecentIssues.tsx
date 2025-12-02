import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Project } from '../../types';

interface TaskWithProject {
  id: string;
  name: string;
  status: string;
  assignee?: string;
  projectId: string;
  projectName: string;
}

interface RecentIssuesProps {
  projects: Project[];
  onViewAll: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in-progress':
      return <Badge className="bg-sky-50 text-sky-700 hover:bg-sky-50 border-0">In Progress</Badge>;
    case 'blocked':
      return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-0">High Priority</Badge>;
    case 'to-do':
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">Backlog</Badge>;
    case 'done':
      return <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-0">Done</Badge>;
    case 'in-review':
      return <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-0">In Review</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-0">{status}</Badge>;
  }
};

const getProjectCode = (projectName: string): string => {
  const words = projectName.split(' ');
  if (words.length >= 2) {
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
  return projectName.slice(0, 3).toUpperCase();
};

const getProjectColor = (projectId: string): string => {
  const colors = [
    'bg-sky-100 text-sky-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-green-100 text-green-700',
    'bg-pink-100 text-pink-700',
  ];
  const index = projectId.charCodeAt(0) % colors.length;
  return colors[index];
};

export function RecentIssues({ projects, onViewAll }: RecentIssuesProps) {
  // Extract all tasks from all projects with project info
  const allTasks: TaskWithProject[] = projects.flatMap(project =>
    project.tasks.map(task => ({
      id: task.id,
      name: task.name,
      status: task.status,
      assignee: task.assignee,
      projectId: project.id,
      projectName: project.name,
    }))
  );

  // Get recent tasks (last 4)
  const recentTasks = allTasks.slice(0, 4);

  return (
    <Card className="bg-white border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">Recent Issues</CardTitle>
        <button
          onClick={onViewAll}
          className="text-sm text-sky-500 hover:text-sky-600 font-medium"
        >
          View All
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentTasks.map((task, index) => {
          const projectCode = getProjectCode(task.projectName);

          return (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Task Code Badge */}
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getProjectColor(task.projectId)}`}>
                {projectCode}-{String(index + 1).padStart(2, '0')}
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{task.projectName}</span>
                  <span>•</span>
                  <span>Updated recently</span>
                </p>
              </div>

              {/* Assignee Avatar */}
              {task.assignee && (
                <div className="w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {task.assignee.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              )}

              {/* Status Badge */}
              {getStatusBadge(task.status)}
            </div>
          );
        })}

        {recentTasks.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No recent tasks
          </div>
        )}
      </CardContent>
    </Card>
  );
}
