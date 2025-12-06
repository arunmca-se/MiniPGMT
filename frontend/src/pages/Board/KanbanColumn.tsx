import * as React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../utils/cn';
import { Badge } from '../../design-system/primitives/Badge';

/**
 * KanbanColumn Component
 *
 * A droppable column for the Kanban board.
 */

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  count,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex min-w-[320px] flex-1 flex-col">
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', color)} />
          <h3 className="font-semibold text-neutral-900">{title}</h3>
          <Badge variant="default" size="sm">
            {count}
          </Badge>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-lg border-2 border-dashed bg-white p-3 transition-colors',
          isOver ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
        )}
      >
        {children}
      </div>
    </div>
  );
};
