import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IssueCard } from '../../design-system/patterns/IssueCard';
import { type Issue } from '../../mocks/data';
import { cn } from '../../utils/cn';

/**
 * SortableIssueCard Component
 *
 * A draggable and sortable issue card for the Kanban board.
 */

interface SortableIssueCardProps {
  issue: Issue;
  isDragging?: boolean;
}

export const SortableIssueCard: React.FC<SortableIssueCardProps> = ({
  issue,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none',
        (isDragging || isSortableDragging) && 'opacity-50'
      )}
      {...attributes}
      {...listeners}
    >
      <IssueCard
        issueKey={issue.key}
        title={issue.title}
        type={issue.type}
        priority={issue.priority}
        status={issue.status}
        assignee={issue.assignee}
        storyPoints={issue.storyPoints}
        layout="kanban"
        onClick={() => console.log('Open issue:', issue.key)}
      />
    </div>
  );
};
