import * as React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FolderKanban,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { StatCard } from '../../design-system/patterns/StatCard';
import { ProjectCard } from '../../design-system/patterns/ProjectCard';
import { IssueCard } from '../../design-system/patterns/IssueCard';
import { Button } from '../../design-system/primitives/Button';
import { Card, CardContent } from '../../design-system/primitives/Card';
import { useProjects } from '../../hooks/useProjects';
import { useMyIssues } from '../../hooks/useIssues';
import { useCurrentUser } from '../../hooks/useAuth';
import { formatDistanceToNow } from './utils';
import { CreateProjectModal } from '../../components/features/project/CreateProjectModal';
import { CreateIssueModal } from '../../components/features/issue/CreateIssueModal';

/**
 * Dashboard Page - Connected to Real API
 *
 * Main landing page showing project overview, assigned work, and activity feed.
 */

export const Dashboard: React.FC = () => {
  const currentUser = useCurrentUser();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: myIssues = [], isLoading: issuesLoading } = useMyIssues();

  // Modal state
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = React.useState(false);

  // Calculate dashboard stats from real data
  const dashboardStats = React.useMemo(() => {
    const activeProjects = projects.filter(p => p.health !== 'completed').length;
    const myAssignedIssues = myIssues.length;
    const completedThisWeek = myIssues.filter(i => i.status === 'done').length;
    const overdueIssues = myIssues.filter(i => {
      if (!i.dueDate) return false;
      return new Date(i.dueDate) < new Date() && i.status !== 'done';
    }).length;

    return {
      activeProjects,
      totalProjects: projects.length,
      myAssignedIssues,
      completedThisWeek,
      overdueIssues,
    };
  }, [projects, myIssues]);

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = currentUser?.name || 'User';

  if (projectsLoading || issuesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white lg:text-4xl">
                {getGreeting()}, {userName.split(' ')[0]}
              </h1>
              <p className="text-base text-primary-100 lg:text-lg">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                leftIcon={<FolderKanban className="h-4 w-4" />}
                onClick={() => setIsCreateProjectModalOpen(true)}
              >
                Create Project
              </Button>
              <Button
                variant="secondary"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => setIsCreateIssueModalOpen(true)}
              >
                Create Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8 lg:py-8">
        {/* Quick Stats Bar */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Projects"
            value={dashboardStats.activeProjects}
            trend="neutral"
            trendValue={`${dashboardStats.totalProjects} total`}
            icon={<Briefcase className="h-6 w-6 text-primary-600" />}
            variant="primary"
          />
          <StatCard
            label="My Assigned Issues"
            value={dashboardStats.myAssignedIssues}
            trend="neutral"
            trendValue="From all projects"
            icon={<CheckCircle2 className="h-6 w-6 text-success-main" />}
            variant="success"
          />
          <StatCard
            label="Completed This Week"
            value={dashboardStats.completedThisWeek}
            trend="up"
            trendValue="Great progress!"
            icon={<TrendingUp className="h-6 w-6 text-success-main" />}
            variant="success"
          />
          <StatCard
            label="Overdue Issues"
            value={dashboardStats.overdueIssues}
            trend={dashboardStats.overdueIssues > 0 ? 'up' : 'neutral'}
            trendValue={dashboardStats.overdueIssues > 0 ? 'Needs attention' : 'All on track'}
            icon={<AlertTriangle className="h-6 w-6 text-error-main" />}
            variant="error"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Projects & My Work */}
          <div className="space-y-8 lg:col-span-2">
            {/* Project Health Overview */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">Project Health</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {projects.slice(0, 4).map((project) => (
                    <ProjectCard
                      key={project.id}
                      projectKey={project.key}
                      name={project.name}
                      description={project.description}
                      health={project.health}
                      progress={project.progress}
                      dueDate={project.dueDate}
                      teamMembers={project.members || []}
                      issueCount={project.issueCount}
                      onClick={() => console.log('Navigate to project:', project.key)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-neutral-400" />
                    <p className="mt-4 text-lg font-medium text-neutral-600">
                      No projects yet
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">
                      Create your first project to get started.
                    </p>
                    <Button
                      className="mt-6"
                      variant="primary"
                      onClick={() => setIsCreateProjectModalOpen(true)}
                    >
                      Create Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* My Assigned Work */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900">My Assigned Work</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm">
                    Sort
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {myIssues.length > 0 ? (
                  myIssues.slice(0, 10).map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issueKey={issue.key}
                      title={issue.title}
                      type={issue.type}
                      priority={issue.priority}
                      status={issue.status}
                      assignee={issue.assignee}
                      storyPoints={issue.storyPoints}
                      layout="list"
                      onClick={() => console.log('Navigate to issue:', issue.key)}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-neutral-400" />
                      <p className="mt-4 text-lg font-medium text-neutral-600">
                        No issues assigned to you
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">
                        You're all caught up! Take a break or pick up new tasks.
                      </p>
                      <Button className="mt-6" variant="primary">
                        Browse Backlog
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Activity */}
          <div className="space-y-8">
            {/* Recent Activity Placeholder */}
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Recent Activity</h2>
              </div>
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-neutral-400" />
                  <p className="mt-4 text-sm text-neutral-600">
                    Activity feed coming soon
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
      />
      <CreateIssueModal
        isOpen={isCreateIssueModalOpen}
        onClose={() => setIsCreateIssueModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
