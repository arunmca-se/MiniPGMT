import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '../../../design-system/primitives/Button/Button';
import { Input } from '../../../design-system/primitives/Input/Input';
import { useCreateIssue } from '../../../hooks/useIssues';
import { useProjects } from '../../../hooks/useProjects';
import type { Issue } from '../../../types';
import type { IssueType } from '../../../design-system/patterns/IssueCard';
import type { PriorityLevel, StatusType } from '../../../design-system/tokens/colors';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectKey?: string;
}

interface IssueFormData {
  title: string;
  description: string;
  projectKey: string;
  type: IssueType;
  priority: PriorityLevel;
  status: StatusType;
  storyPoints?: number;
  dueDate?: string;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  isOpen,
  onClose,
  defaultProjectKey
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IssueFormData>({
    defaultValues: {
      projectKey: defaultProjectKey || '',
      type: 'task',
      priority: 'medium',
      status: 'todo',
    }
  });
  const createIssue = useCreateIssue();
  const { data: projects } = useProjects();

  const onSubmit = async (data: IssueFormData) => {
    try {
      await createIssue.mutateAsync({
        title: data.title,
        description: data.description,
        projectKey: data.projectKey,
        type: data.type,
        priority: data.priority,
        status: data.status,
        storyPoints: data.storyPoints ? Number(data.storyPoints) : undefined,
        dueDate: data.dueDate || undefined,
      } as Partial<Issue>);

      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Create Issue</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Project Selection */}
          <div>
            <label htmlFor="projectKey" className="block text-sm font-medium text-neutral-700 mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              id="projectKey"
              {...register('projectKey', {
                required: 'Project is required'
              })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a project</option>
              {projects?.map((project) => (
                <option key={project.key} value={project.key}>
                  {project.key} - {project.name}
                </option>
              ))}
            </select>
            {errors.projectKey && (
              <p className="text-sm text-red-600 mt-1">{errors.projectKey.message}</p>
            )}
          </div>

          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter issue title"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              })}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Enter issue description"
              {...register('description')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Issue Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                {...register('type', {
                  required: 'Type is required'
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="epic">Epic</option>
                <option value="story">Story</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="subtask">Subtask</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                {...register('priority', {
                  required: 'Priority is required'
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="highest">Highest</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="lowest">Lowest</option>
              </select>
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                {...register('status', {
                  required: 'Status is required'
                })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="inReview">In Review</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>

            {/* Story Points */}
            <div>
              <label htmlFor="storyPoints" className="block text-sm font-medium text-neutral-700 mb-1">
                Story Points
              </label>
              <Input
                id="storyPoints"
                type="number"
                min="0"
                placeholder="e.g., 5"
                {...register('storyPoints')}
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
            />
          </div>

          {/* Error Message */}
          {createIssue.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                Failed to create issue. Please try again.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createIssue.isPending}
              className="flex-1"
            >
              {createIssue.isPending ? 'Creating...' : 'Create Issue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
