import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AddTaskModal } from './AddTaskModal';
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Plus,
  Edit3,
  Trash2,
  Loader2
} from 'lucide-react';
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '@/utils/calculations';
import { useProject, useDeleteProject } from '@/hooks/useProjects';
import { useDeleteTask } from '@/hooks/useTasks';
import { useToggleSubtask, useCreateSubtask } from '@/hooks/useSubtasks';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id);
  const deleteProject = useDeleteProject();
  const deleteTask = useDeleteTask();
  const toggleSubtask = useToggleSubtask();
  const createSubtask = useCreateSubtask();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load project</h3>
              <p className="text-red-600 mb-4">{error ? (error as Error).message : 'Project not found'}</p>
              <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks.length;

  const totalSubtasks = project.tasks.reduce((acc, task) => acc + task.subtasks.length, 0);
  const completedSubtasks = project.tasks.reduce(
    (acc, task) => acc + task.subtasks.filter(subtask => subtask.status === 'completed').length,
    0
  );

  const isProjectOverdue = isOverdue(project.dueDate) && project.status !== 'completed';

  const getTaskProgress = (task: Task): number => {
    if (task.subtasks.length === 0) return task.status === 'done' ? 100 : 0;
    const completed = task.subtasks.filter(sub => sub.status === 'completed').length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(project.id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync({ taskId, projectId: project.id });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleSubtask = async (_taskId: string, subtaskId: string) => {
    try {
      await toggleSubtask.mutateAsync({ id: subtaskId, projectId: project.id });
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    const subtaskName = window.prompt('Enter subtask name:');
    if (!subtaskName) return;

    try {
      await createSubtask.mutateAsync({
        taskId,
        projectId: project.id,
        name: subtaskName,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => console.log('Edit project')}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button variant="destructive" onClick={handleDeleteProject}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview */}
        <Card className={`mb-8 ${isProjectOverdue ? 'border-red-200 bg-red-50/30' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {project.name}
                </CardTitle>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className={`font-medium ${isProjectOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(project.dueDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Tasks Progress</p>
                  <p className="font-medium">{completedTasks}/{totalTasks} completed</p>
                </div>
              </div>
              
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="font-medium">{project.teamMembers.length} members</p>
                  </div>
                </div>
              )}
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>

            {/* Subtasks Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Subtasks Progress</span>
                <span className="text-sm font-medium">{completedSubtasks}/{totalSubtasks} completed</span>
              </div>
              <Progress 
                value={totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0} 
                className="h-2" 
              />
            </div>

            {/* Team Members */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.teamMembers.map((member, index) => (
                    <Badge key={index} variant="outline">{member}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks ({project.tasks.length})</CardTitle>
              <Button onClick={() => setShowAddTaskModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.tasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first task to this project.</p>
                <Button onClick={() => setShowAddTaskModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Task
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {project.tasks.map((task) => (
                  <AccordionItem key={task.id} value={task.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-left">
                            <h4 className="font-medium text-gray-900">{task.name}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">{getTaskProgress(task)}%</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent>
                      <div className="pt-4 space-y-6">
                        {/* Task Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Assignee:</span>
                            <span className="ml-2 font-medium">{task.assignee || 'Unassigned'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Due Date:</span>
                            <span className={`ml-2 font-medium ${
                              task.dueDate && isOverdue(task.dueDate) && task.status !== 'done' 
                                ? 'text-red-600' 
                                : ''
                            }`}>
                              {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Estimated Hours:</span>
                            <span className="ml-2 font-medium">
                              {task.estimatedHours ? `${task.estimatedHours}h` : 'Not estimated'}
                            </span>
                          </div>
                        </div>

                        {/* Task Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Task Progress</span>
                            <span className="text-sm">{getTaskProgress(task)}%</span>
                          </div>
                          <Progress value={getTaskProgress(task)} className="h-2" />
                        </div>

                        {/* Subtasks */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-900">
                              Subtasks ({task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length} completed)
                            </h5>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddSubtask(task.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Subtask
                            </Button>
                          </div>
                          
                          {task.subtasks.length === 0 ? (
                            <p className="text-sm text-gray-500 py-4 text-center">
                              No subtasks yet. Click "Add Subtask" to get started.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {task.subtasks.map((subtask) => (
                                <div
                                  key={subtask.id}
                                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                  <button
                                    onClick={() => handleToggleSubtask(task.id, subtask.id)}
                                    className="flex-shrink-0"
                                  >
                                    {subtask.status === 'completed' ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <span className={`text-sm ${
                                      subtask.status === 'completed' 
                                        ? 'line-through text-gray-500' 
                                        : 'text-gray-900'
                                    }`}>
                                      {subtask.name}
                                    </span>
                                    {subtask.assignee && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        - {subtask.assignee}
                                      </span>
                                    )}
                                    {subtask.notes && (
                                      <p className="text-xs text-gray-500 mt-1">{subtask.notes}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Task Actions */}
                        <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log('Edit task:', task)}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit Task
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Add Task Modal */}
        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          projectId={project.id}
        />
      </div>
    </div>
  );
}