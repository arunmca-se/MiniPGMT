import type { Project } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '@/utils/calculations';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks.length;
  const isProjectOverdue = isOverdue(project.dueDate) && project.status !== 'completed';

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
        isProjectOverdue ? 'border-red-200 bg-red-50/50' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
            {project.name}
          </CardTitle>
          {isProjectOverdue && (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(project.priority)}>
              {project.priority.toUpperCase()}
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Task Summary */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>{completedTasks}/{totalTasks} tasks completed</span>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className={`${isProjectOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              Due: {formatDate(project.dueDate)}
            </span>
          </div>

          {/* Team Members */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>
                {project.teamMembers.length} member{project.teamMembers.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}