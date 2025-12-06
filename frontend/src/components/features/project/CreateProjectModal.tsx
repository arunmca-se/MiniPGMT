import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '../../../design-system/primitives/Button/Button';
import { Input } from '../../../design-system/primitives/Input/Input';
import { useCreateProject } from '../../../hooks/useProjects';
import type { Project } from '../../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormData {
  key: string;
  name: string;
  description: string;
  dueDate: string;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>();
  const createProject = useCreateProject();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync({
        key: data.key.toUpperCase(),
        name: data.name,
        description: data.description,
        health: 'ON_TRACK',
        progress: 0,
        dueDate: data.dueDate || undefined,
      } as Partial<Project>);

      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
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
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Create Project</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Project Key */}
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-neutral-700 mb-1">
              Project Key <span className="text-red-500">*</span>
            </label>
            <Input
              id="key"
              placeholder="e.g., PROJ"
              {...register('key', {
                required: 'Project key is required',
                pattern: {
                  value: /^[A-Z0-9]{2,10}$/,
                  message: 'Key must be 2-10 uppercase letters/numbers'
                }
              })}
              className="uppercase"
            />
            {errors.key && (
              <p className="text-sm text-red-600 mt-1">{errors.key.message}</p>
            )}
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="Enter project name"
              {...register('name', {
                required: 'Project name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Enter project description"
              {...register('description')}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
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
          {createProject.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                Failed to create project. Please try again.
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
              disabled={createProject.isPending}
              className="flex-1"
            >
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
