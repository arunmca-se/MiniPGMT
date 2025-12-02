import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  Users,
  Calendar,
  Settings,
  ChevronRight
} from 'lucide-react';
import type { Project } from '../../types';

interface SidebarProps {
  projects: Project[];
  currentView: 'dashboard' | 'project-detail';
  onNavigate: (view: 'dashboard' | 'project-detail', projectId?: string) => void;
  selectedProjectId?: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'My Tasks', icon: ListTodo },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

const getProjectColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'on-hold': return 'bg-yellow-500';
    case 'not-started': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

export function Sidebar({ projects, currentView, onNavigate, selectedProjectId }: SidebarProps) {
  const activeProjects = projects.filter(p => p.status !== 'completed').slice(0, 5);

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-lg">MiniPGMT</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'dashboard' && currentView === 'dashboard';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'dashboard') {
                  onNavigate('dashboard');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}

        {/* Active Projects Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Active Projects
          </h3>
          <div className="space-y-1">
            {activeProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => onNavigate('project-detail', project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${getProjectColor(project.status)}`} />
                <span className="truncate flex-1 text-left">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            AK
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900">Alex Kumar</p>
            <p className="text-xs text-gray-500">Product Lead</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </aside>
  );
}
