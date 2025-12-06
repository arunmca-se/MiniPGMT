import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IssueCard } from '../../design-system/patterns/IssueCard';
import { Button } from '../../design-system/primitives/Button';
import { Badge } from '../../design-system/primitives/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../design-system/primitives/Select';
import { Plus, Filter, Settings2 } from 'lucide-react';
import { mockProjects, mockIssues, type Issue } from '../../mocks/data';
import { type StatusType } from '../../design-system/tokens/colors';
import { KanbanColumn } from './KanbanColumn';
import { SortableIssueCard } from './SortableIssueCard';

/**
 * Board Page (Kanban Board)
 *
 * Drag-and-drop Kanban board for managing issues.
 * Uses @dnd-kit for accessible drag-and-drop functionality.
 */

interface Column {
  id: StatusType;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-neutral-200' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-primary-200' },
  { id: 'inReview', title: 'In Review', color: 'bg-purple-200' },
  { id: 'done', title: 'Done', color: 'bg-success-light' },
];

export const Board: React.FC = () => {
  const [selectedProject, setSelectedProject] = React.useState(mockProjects[0].key);
  const [issues, setIssues] = React.useState<Issue[]>(
    mockIssues.filter((issue) => issue.projectKey === selectedProject)
  );
  const [activeId, setActiveId] = React.useState<string | null>(null);

  // Update issues when project changes
  React.useEffect(() => {
    setIssues(mockIssues.filter((issue) => issue.projectKey === selectedProject));
  }, [selectedProject]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const getIssuesByStatus = (status: StatusType) => {
    return issues.filter((issue) => issue.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active issue
    const activeIssue = issues.find((issue) => issue.id === activeId);
    if (!activeIssue) return;

    // Check if we're dragging over a column or an issue
    const overColumn = columns.find((col) => col.id === overId);
    const overIssue = issues.find((issue) => issue.id === overId);

    const newStatus = overColumn ? overColumn.id : overIssue?.status;

    if (newStatus && activeIssue.status !== newStatus) {
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === activeId ? { ...issue, status: newStatus } : issue
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIssue = issues.find((issue) => issue.id === activeId);
    const overIssue = issues.find((issue) => issue.id === overId);

    if (!activeIssue) return;

    // If dropped on another issue in the same column, reorder
    if (overIssue && activeIssue.status === overIssue.status) {
      const oldIndex = issues.findIndex((issue) => issue.id === activeId);
      const newIndex = issues.findIndex((issue) => issue.id === overId);

      setIssues((prevIssues) => arrayMove(prevIssues, oldIndex, newIndex));
    }
  };

  const activeIssue = activeId ? issues.find((issue) => issue.id === activeId) : null;

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-neutral-900">Board</h1>
            <p className="text-sm text-neutral-600">
              Drag and drop issues to update their status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.key} value={project.key}>
                    {project.key} - {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>

            <Button variant="outline" size="sm" leftIcon={<Settings2 className="h-4 w-4" />}>
              View Settings
            </Button>

            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Create Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4">
            {columns.map((column) => {
              const columnIssues = getIssuesByStatus(column.id);

              return (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  color={column.color}
                  count={columnIssues.length}
                >
                  <SortableContext
                    items={columnIssues.map((issue) => issue.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {columnIssues.map((issue) => (
                        <SortableIssueCard
                          key={issue.id}
                          issue={issue}
                          isDragging={activeId === issue.id}
                        />
                      ))}
                    </div>
                  </SortableContext>

                  {columnIssues.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 py-12 text-center">
                      <p className="text-sm font-medium text-neutral-600">No issues</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Drag issues here or create new ones
                      </p>
                    </div>
                  )}
                </KanbanColumn>
              );
            })}
          </div>

          <DragOverlay>
            {activeIssue ? (
              <div className="rotate-3 opacity-90">
                <IssueCard
                  issueKey={activeIssue.key}
                  title={activeIssue.title}
                  type={activeIssue.type}
                  priority={activeIssue.priority}
                  status={activeIssue.status}
                  assignee={activeIssue.assignee}
                  storyPoints={activeIssue.storyPoints}
                  layout="kanban"
                  hoverable={false}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Board;
