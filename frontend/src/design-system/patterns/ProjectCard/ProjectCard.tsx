import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../primitives/Card';
import { Avatar, AvatarGroup } from '../../primitives/Avatar';
import { Badge } from '../../primitives/Badge';
import { Progress } from '../../primitives/Progress';
import { cn } from '../../../utils/cn';
import { Calendar, AlertCircle } from 'lucide-react';

/**
 * ProjectCard Component
 *
 * Displays project information with health status, progress, and team members.
 * Used in dashboard and project list views.
 */

export type ProjectHealth = 'onTrack' | 'atRisk' | 'behind';

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  projectKey: string;
  name: string;
  description?: string;
  health: ProjectHealth;
  progress: number;
  dueDate?: string;
  teamMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  issueCount?: {
    total: number;
    completed: number;
  };
  hoverable?: boolean;
}

const healthConfig = {
  onTrack: {
    label: 'On Track',
    color: 'success' as const,
    bgClass: 'bg-success-light',
    textClass: 'text-success-main',
  },
  atRisk: {
    label: 'At Risk',
    color: 'warning' as const,
    bgClass: 'bg-warning-light',
    textClass: 'text-warning-main',
  },
  behind: {
    label: 'Behind',
    color: 'error' as const,
    bgClass: 'bg-error-light',
    textClass: 'text-error-main',
  },
};

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      className,
      projectKey,
      name,
      description,
      health,
      progress,
      dueDate,
      teamMembers = [],
      issueCount,
      hoverable = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const healthInfo = healthConfig[health];

    return (
      <Card
        ref={ref}
        hoverable={hoverable}
        className={cn('relative overflow-hidden', className)}
        onClick={onClick}
        {...props}
      >
        {/* Health Indicator Bar */}
        <div className={cn('absolute left-0 top-0 h-1 w-full', healthInfo.bgClass)} />

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-neutral-500">
                  {projectKey}
                </span>
                <Badge variant="status" size="sm" className={cn(healthInfo.bgClass, healthInfo.textClass)}>
                  {healthInfo.label}
                </Badge>
              </div>
              <CardTitle className="mt-2">{name}</CardTitle>
              {description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-700">Progress</span>
              <span className="font-semibold text-neutral-900">{progress}%</span>
            </div>
            <Progress
              value={progress}
              variant={progress === 100 ? 'success' : 'default'}
            />
          </div>

          {/* Issue Count */}
          {issueCount && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-neutral-500" />
              <span className="text-neutral-600">
                {issueCount.completed} / {issueCount.total} issues completed
              </span>
            </div>
          )}

          {/* Due Date */}
          {dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-neutral-600">Due {dueDate}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-neutral-100 bg-neutral-50/50">
          <div className="flex w-full items-center justify-between">
            <span className="text-xs text-neutral-500">Team</span>
            {teamMembers.length > 0 ? (
              <AvatarGroup
                max={4}
                size="sm"
                avatars={teamMembers.map((member) => ({
                  src: member.avatar,
                  alt: member.name,
                }))}
              />
            ) : (
              <span className="text-xs text-neutral-400">No members</span>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
