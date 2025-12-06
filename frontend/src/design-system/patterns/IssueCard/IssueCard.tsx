import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../primitives/Card';
import { Avatar } from '../../primitives/Avatar';
import { Badge, PriorityBadge, StatusBadge } from '../../primitives/Badge';
import { cn } from '../../../utils/cn';
import { type PriorityLevel, type StatusType } from '../../tokens/colors';
import { CheckSquare, FileText, Zap, Bug, ListTodo } from 'lucide-react';

/**
 * IssueCard Component
 *
 * Displays issue information in various layouts (kanban, list, compact).
 * Used in kanban boards, backlogs, and issue lists.
 */

export type IssueType = 'epic' | 'story' | 'task' | 'bug' | 'subtask';

export interface IssueCardProps extends React.HTMLAttributes<HTMLDivElement> {
  issueKey: string;
  title: string;
  type: IssueType;
  priority: PriorityLevel;
  status: StatusType;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  storyPoints?: number;
  layout?: 'kanban' | 'list' | 'compact';
  hoverable?: boolean;
}

const issueTypeConfig = {
  epic: {
    icon: Zap,
    label: 'Epic',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  story: {
    icon: FileText,
    label: 'Story',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  task: {
    icon: CheckSquare,
    label: 'Task',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  bug: {
    icon: Bug,
    label: 'Bug',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  subtask: {
    icon: ListTodo,
    label: 'Subtask',
    color: 'text-neutral-600',
    bgColor: 'bg-neutral-100',
  },
};

export const IssueCard = React.forwardRef<HTMLDivElement, IssueCardProps>(
  (
    {
      className,
      issueKey,
      title,
      type,
      priority,
      status,
      assignee,
      storyPoints,
      layout = 'kanban',
      hoverable = true,
      onClick,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();
    const typeInfo = issueTypeConfig[type];
    const TypeIcon = typeInfo.icon;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(e);
      } else {
        navigate(`/issue/${issueKey}`);
      }
    };

    if (layout === 'compact') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-3 rounded-md border border-neutral-200 bg-white p-3 transition-all',
            hoverable && 'cursor-pointer hover:border-primary-300 hover:shadow-sm',
            className
          )}
          onClick={handleClick}
          {...props}
        >
          <div className={cn('flex h-6 w-6 items-center justify-center rounded', typeInfo.bgColor)}>
            <TypeIcon className={cn('h-4 w-4', typeInfo.color)} />
          </div>

          <span className="text-xs font-mono font-semibold text-neutral-500">{issueKey}</span>

          <span className="flex-1 truncate text-sm text-neutral-900">{title}</span>

          <PriorityBadge priority={priority} size="sm" showLabel={false} />

          {assignee && (
            <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
          )}
        </div>
      );
    }

    if (layout === 'list') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-4 rounded-md border border-neutral-200 bg-white p-4 transition-all',
            hoverable && 'cursor-pointer hover:border-primary-300 hover:shadow-sm',
            className
          )}
          onClick={handleClick}
          {...props}
        >
          <div className={cn('flex h-8 w-8 items-center justify-center rounded', typeInfo.bgColor)}>
            <TypeIcon className={cn('h-5 w-5', typeInfo.color)} />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-neutral-500">{issueKey}</span>
              <span className="text-sm font-medium text-neutral-900">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" size="sm">{typeInfo.label}</Badge>
              <StatusBadge status={status} size="sm" />
            </div>
          </div>

          <PriorityBadge priority={priority} />

          {storyPoints && (
            <div className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 bg-neutral-50">
              <span className="text-xs font-semibold text-neutral-700">{storyPoints}</span>
            </div>
          )}

          {assignee ? (
            <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
          ) : (
            <div className="h-8 w-8 rounded-full border-2 border-dashed border-neutral-300" />
          )}
        </div>
      );
    }

    // Kanban layout (default)
    return (
      <Card
        ref={ref}
        hoverable={hoverable}
        className={cn('group', className)}
        onClick={onClick}
        {...props}
      >
        <CardContent className="space-y-3 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded', typeInfo.bgColor)}>
                <TypeIcon className={cn('h-4 w-4', typeInfo.color)} />
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-500">{issueKey}</span>
            </div>
            <PriorityBadge priority={priority} size="sm" showLabel={false} />
          </div>

          {/* Title */}
          <p className="text-sm font-medium leading-snug text-neutral-900 line-clamp-3">
            {title}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {storyPoints && (
                <div className="flex h-6 w-6 items-center justify-center rounded border border-neutral-300 bg-neutral-50">
                  <span className="text-xs font-semibold text-neutral-700">{storyPoints}</span>
                </div>
              )}
            </div>

            {assignee ? (
              <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-dashed border-neutral-300" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

IssueCard.displayName = 'IssueCard';

export default IssueCard;
