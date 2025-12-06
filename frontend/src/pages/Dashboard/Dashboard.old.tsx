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
import { Avatar } from '../../design-system/primitives/Avatar';
import { Badge } from '../../design-system/primitives/Badge';
import { Button } from '../../design-system/primitives/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../design-system/primitives/Card';
import {
  mockProjects,
  mockDashboardStats,
  getMyAssignedIssues,
  getAttentionRequiredIssues,
  getUpcomingDeadlines,
  mockActivities,
  getCurrentUser,
} from '../../mocks/data';
import { formatDistanceToNow } from './utils';

/**
 * Dashboard Page
 *
 * Main landing page showing project overview, assigned work, and activity feed.
 * Implements all sections from the comprehensive requirements.
 */

export const Dashboard: React.FC = () => {
  const currentUser = getCurrentUser();
  const myIssues = getMyAssignedIssues();
  const attentionRequired = getAttentionRequiredIssues();
  const upcomingDeadlines = getUpcomingDeadlines();

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-neutral-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white lg:text-4xl">
                {getGreeting()}, {currentUser.name.split(' ')[0]}
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
              <Button variant="secondary" leftIcon={<FolderKanban className="h-4 w-4" />}>
                Create Project
              </Button>
              <Button variant="secondary" leftIcon={<CheckCircle2 className="h-4 w-4" />}>
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
            value={mockDashboardStats.activeProjects}
            trend="neutral"
            trendValue={`${mockDashboardStats.totalProjects} total`}
            icon={<Briefcase className="h-6 w-6 text-primary-600" />}
            variant="primary"
          />
          <StatCard
            label="My Assigned Issues"
            value={mockDashboardStats.myAssignedIssues}
            trend="up"
            trendValue="+2 this week"
            icon={<CheckCircle2 className="h-6 w-6 text-success-main" />}
            variant="success"
          />
          <StatCard
            label="Completed This Week"
            value={mockDashboardStats.completedThisWeek}
            trend="up"
            trendValue="+15% from last week"
            icon={<TrendingUp className="h-6 w-6 text-success-main" />}
            variant="success"
          />
          <StatCard
            label="Overdue Issues"
            value={mockDashboardStats.overdueIssues}
            trend="down"
            trendValue="-2 from last week"
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {mockProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    projectKey={project.key}
                    name={project.name}
                    description={project.description}
                    health={project.health}
                    progress={project.progress}
                    dueDate={project.dueDate}
                    teamMembers={project.teamMembers}
                    issueCount={project.issueCount}
                    onClick={() => console.log('Navigate to project:', project.key)}
                  />
                ))}
              </div>
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
                  myIssues.map((issue) => (
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

          {/* Right Column: Attention Required & Activity */}
          <div className="space-y-8">
            {/* Attention Required */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-error-main" />
                    <CardTitle className="text-lg">Attention Required</CardTitle>
                  </div>
                  <CardDescription>High priority issues that need immediate action</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attentionRequired.length > 0 ? (
                    attentionRequired.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issueKey={issue.key}
                        title={issue.title}
                        type={issue.type}
                        priority={issue.priority}
                        status={issue.status}
                        assignee={issue.assignee}
                        layout="compact"
                        onClick={() => console.log('Navigate to issue:', issue.key)}
                      />
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-success-main" />
                      <p className="mt-3 text-sm font-medium text-neutral-600">All clear!</p>
                      <p className="mt-1 text-xs text-neutral-500">No urgent issues</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Upcoming Deadlines */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-warning-main" />
                    <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
                  </div>
                  <CardDescription>Issues due in the next 7 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-start gap-3 rounded-md border border-neutral-200 p-3 transition-all hover:border-primary-300 hover:bg-neutral-50 cursor-pointer"
                        onClick={() => console.log('Navigate to issue:', issue.key)}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-neutral-500">
                              {issue.key}
                            </span>
                            <Badge variant="status" size="sm" status={issue.status} />
                          </div>
                          <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                            {issue.title}
                          </p>
                          <p className="text-xs text-neutral-500">Due: {issue.dueDate}</p>
                        </div>
                        {issue.assignee && (
                          <Avatar src={issue.assignee.avatar} alt={issue.assignee.name} size="sm" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <Clock className="mx-auto h-8 w-8 text-neutral-400" />
                      <p className="mt-3 text-sm font-medium text-neutral-600">No upcoming deadlines</p>
                      <p className="mt-1 text-xs text-neutral-500">Next 7 days are clear</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Activity Feed */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivities.slice(0, 10).map((activity, index) => (
                      <div
                        key={activity.id}
                        className={cn(
                          'flex gap-3 pb-4',
                          index !== mockActivities.slice(0, 10).length - 1 && 'border-b border-neutral-100'
                        )}
                      >
                        <Avatar
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          size="sm"
                        />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-neutral-900">
                            <span className="font-semibold">{activity.user.name}</span>{' '}
                            {activity.description}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(activity.timestamp))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function needed for imports
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Dashboard;
