import * as React from 'react';
import { Plus, Search, Grid3x3, List, Filter, ChevronDown } from 'lucide-react';
import { ProjectCard } from '../../design-system/patterns/ProjectCard';
import { Button } from '../../design-system/primitives/Button';
import { Input } from '../../design-system/primitives/Input';
import { Badge } from '../../design-system/primitives/Badge';
import { useProjects } from '../../hooks/useProjects';
import { cn } from '../../utils/cn';

/**
 * Projects Page - Connected to Real API
 *
 * List/grid view of all projects with filtering and search capabilities.
 */

type ViewMode = 'grid' | 'list';

export const Projects: React.FC = () => {
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'active' | 'archived'>('all');

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by active/archived status
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'active' && project.health !== 'completed') ||
        (selectedFilter === 'archived' && project.health === 'completed');

      return matchesSearch && matchesFilter;
    });
  }, [projects, searchQuery, selectedFilter]);

  const projectStats = React.useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.health !== 'completed').length,
      archived: projects.filter((p) => p.health === 'completed').length,
      onTrack: projects.filter((p) => p.health === 'onTrack').length,
      atRisk: projects.filter((p) => p.health === 'atRisk').length,
      behind: projects.filter((p) => p.health === 'behind').length,
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-error-main">Failed to load projects</p>
          <p className="mt-2 text-sm text-neutral-600">
            {(error as any)?.response?.data?.message || 'An error occurred while fetching projects'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-neutral-900">Projects</h1>
              <p className="text-sm text-neutral-600">
                Manage and monitor all your projects
              </p>
            </div>

            <Button leftIcon={<Plus className="h-4 w-4" />}>Create Project</Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Total:</span>
              <Badge variant="default">{projectStats.total}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">On Track:</span>
              <Badge variant="success">{projectStats.onTrack}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">At Risk:</span>
              <Badge variant="warning">{projectStats.atRisk}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">Behind:</span>
              <Badge variant="error">{projectStats.behind}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search projects..."
              leftElement={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={selectedFilter === 'archived' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('archived')}
              >
                Archived
              </Button>
            </div>

            <div className="h-6 w-px bg-neutral-300" />

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-50 p-1">
              <button
                className={cn(
                  'rounded p-1.5 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                className={cn(
                  'rounded p-1.5 transition-colors',
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort */}
            <Button variant="outline" size="sm" rightIcon={<ChevronDown className="h-4 w-4" />}>
              Sort
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredProjects.length > 0 ? (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'
                : 'space-y-4'
            )}
          >
            {filteredProjects.map((project) => (
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
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <Search className="h-8 w-8 text-neutral-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No projects found</h3>
              <p className="mt-2 text-sm text-neutral-500">
                {searchQuery
                  ? `No projects match "${searchQuery}"`
                  : 'Try adjusting your filters or create a new project'}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
