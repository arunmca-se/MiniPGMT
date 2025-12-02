import { useState, useEffect } from 'react';
import type { Project, Task } from '@/types';
import { Dashboard } from '@/components/Dashboard';
import { ProjectDetail } from '@/components/ProjectDetail';
import { downloadHtmlReport } from '@/utils/exportHtml';
import { projectsApi, subtasksApi } from '@/services/api';

type ViewMode = 'dashboard' | 'project-detail';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from API
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectsApi.getAll();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Load single project (for detail view)
  const loadProject = async (projectId: string) => {
    try {
      const projectData = await projectsApi.getById(projectId);
      setSelectedProject(projectData);
    } catch (err) {
      console.error('Error loading project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setViewMode('project-detail');
    // Load fresh project data for detail view
    loadProject(project.id);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
    setViewMode('dashboard');
  };

  const handleExportReport = () => {
    downloadHtmlReport(projects);
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const handleEditProject = () => {
    // This would typically open a modal or form with project data
    console.log('Edit project clicked - modal/form would open here');
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsApi.delete(selectedProject.id);
        setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
        handleBackToDashboard();
      } catch (err) {
        console.error('Error deleting project:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete project');
      }
    }
  };

  const handleTaskCreated = (_newTask: Task) => {
    // Refresh the project data to include the new task
    if (selectedProject) {
      loadProject(selectedProject.id);
    }
    // Also refresh the projects list to update counts
    loadProjects();
  };

  const handleEditTask = (task: Task) => {
    // This would typically open a modal or form with task data
    console.log('Edit task clicked:', task);
  };

  const handleDeleteTask = (taskId: string) => {
    if (selectedProject && window.confirm('Are you sure you want to delete this task?')) {
      const updatedProject = {
        ...selectedProject,
        tasks: selectedProject.tasks.filter(t => t.id !== taskId)
      };
      
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
    }
  };

  const handleToggleSubtask = async (_taskId: string, subtaskId: string) => {
    if (!selectedProject) return;

    try {
      await subtasksApi.toggle(subtaskId);
      
      // Reload project data to get updated progress
      await loadProject(selectedProject.id);
      
      // Also reload projects list to update dashboard
      await loadProjects();
    } catch (err) {
      console.error('Error toggling subtask:', err);
      setError(err instanceof Error ? err.message : 'Failed to update subtask');
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!selectedProject) return;

    // This is a simple implementation - in a real app, you'd want a modal/form
    const subtaskName = window.prompt('Enter subtask name:');
    if (!subtaskName) return;

    try {
      await subtasksApi.create({
        taskId,
        name: subtaskName,
        status: 'pending'
      });

      // Reload project data to get the new subtask
      await loadProject(selectedProject.id);
      
      // Also reload projects list to update dashboard
      await loadProjects();
    } catch (err) {
      console.error('Error adding subtask:', err);
      setError(err instanceof Error ? err.message : 'Failed to add subtask');
    }
  };

  if (viewMode === 'project-detail' && selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={handleBackToDashboard}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onTaskCreated={handleTaskCreated}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onToggleSubtask={handleToggleSubtask}
        onAddSubtask={handleAddSubtask}
      />
    );
  }

  return (
    <Dashboard
      projects={projects}
      onProjectClick={handleProjectClick}
      onProjectCreated={handleProjectCreated}
      onExport={handleExportReport}
      loading={loading}
      error={error}
      onRefresh={loadProjects}
    />
  );
}
