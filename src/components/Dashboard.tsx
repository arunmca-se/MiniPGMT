import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project, ProjectFilters } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, FolderOpen } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { AddProjectModal } from './AddProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { useDashboardStats } from '@/hooks/useDashboard';

// Dashboard Components
import { WelcomeHeader } from './dashboard/WelcomeHeader';
import { StatsCards } from './dashboard/StatsCards';
import { SprintVelocityChart } from './dashboard/SprintVelocityChart';
import { WorkloadChart } from './dashboard/WorkloadChart';
import { RecentIssues } from './dashboard/RecentIssues';
import { MyTeam } from './dashboard/MyTeam';

// Layout Components
import { Sidebar } from './layout/Sidebar';
import { TopHeader } from './layout/TopHeader';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: projects = [], error: projectsError } = useProjects();
  const { data: stats = { totalProjects: 0, inProgress: 0, completed: 0, overdue: 0 } } = useDashboardStats();
  const [filters, setFilters] = useState<ProjectFilters>({
    status: 'all',
    search: ''
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'projects'>('dashboard');

  const error = projectsError ? (projectsError as Error).message : null;

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesSearch = filters.search === '' ||
        project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [projects, filters]);

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleProjectClick = (projectToView: Project) => {
    navigate(`/projects/${projectToView.id}`);
  };

  const handleNavigate = (view: 'dashboard' | 'project-detail', projectId?: string) => {
    if (view === 'dashboard') {
      setViewMode('dashboard');
    } else if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  // Calculate stats for the new StatsCards
  const dashboardStats = {
    tasksInProgress: stats.inProgress,
    completedTasks: stats.completed,
    criticalBugs: stats.overdue,
    hoursLogged: 32,
    hoursTarget: 40,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        currentView="dashboard"
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div className="ml-60">
        {/* Top Header */}
        <TopHeader
          title="Dashboard"
          onCreateClick={() => setShowAddProjectModal(true)}
          searchQuery={filters.search}
          onSearchChange={handleSearchChange}
        />

        {/* Main Content Area */}
        <main className="p-6">
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

          {/* Welcome Header */}
          <WelcomeHeader userName="Alex" />

          {/* Stats Cards */}
          <StatsCards stats={dashboardStats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SprintVelocityChart />
            <WorkloadChart />
          </div>

          {/* Bottom Row: Recent Issues & My Team */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <RecentIssues
                projects={projects}
                onViewAll={() => setViewMode('projects')}
              />
            </div>
            <div>
              <MyTeam />
            </div>
          </div>

          {/* Projects Section (toggleable) */}
          {viewMode === 'projects' && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  All Projects ({filteredProjects.length})
                </h2>
                <button
                  onClick={() => setViewMode('dashboard')}
                  className="text-sm text-sky-500 hover:text-sky-600"
                >
                  Back to Dashboard
                </button>
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
                      onClick={() => handleProjectClick(project)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        open={showAddProjectModal}
        onOpenChange={setShowAddProjectModal}
      />
    </div>
  );
}
