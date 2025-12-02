import { useState, useMemo, useEffect } from 'react';
import type { Project, ProjectFilters, DashboardStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from './ProjectCard';
import { AddProjectModal } from './AddProjectModal';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Download,
  Plus,
  RefreshCw
} from 'lucide-react';
import { dashboardApi } from '@/services/api';

interface DashboardProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  onProjectCreated?: (project: Project) => void;
  onExport?: () => void;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function Dashboard({ projects, onProjectClick, onProjectCreated, onExport, loading, error, onRefresh }: DashboardProps) {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: 'all',
    search: ''
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Load stats from API
  const loadStats = async () => {
    try {
      const statsData = await dashboardApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      // Fallback to calculating from projects data
      const fallbackStats = {
        totalProjects: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        overdue: projects.filter(p => {
          const today = new Date();
          const dueDate = new Date(p.dueDate);
          return today > dueDate && p.status !== 'completed';
        }).length
      };
      setStats(fallbackStats);
    }
  };

  useEffect(() => {
    loadStats();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesSearch = filters.search === '' || 
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [projects, filters]);

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status: status as ProjectFilters['status'] }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'progress' | 'tasks'>) => {
    try {
      // Import projectsApi here to avoid circular dependencies
      const { projectsApi } = await import('@/services/api');
      const newProject = await projectsApi.create(projectData);
      
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      // Refresh data
      await loadStats();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error; // Let the modal handle the error display
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
              <p className="text-sm text-gray-600">Appzcart Development Dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={onRefresh} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={onExport} variant="outline" size="sm" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={() => setShowAddProjectModal(true)} size="sm" disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filters.status} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Projects ({filteredProjects.length})
            </h2>
            {filters.status !== 'all' && (
              <Badge variant="secondary">
                Filtered by: {filters.status.replace('-', ' ')}
              </Badge>
            )}
          </div>
          
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    {filters.search || filters.status !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding your first project.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick?.(project)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Project Modal */}
        <AddProjectModal
          open={showAddProjectModal}
          onOpenChange={setShowAddProjectModal}
          onSubmit={handleCreateProject}
        />
      </div>
    </div>
  );
}