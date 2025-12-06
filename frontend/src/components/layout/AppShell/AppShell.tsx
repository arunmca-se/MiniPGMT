import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import { Avatar } from '../../../design-system/primitives/Avatar';
import { Button } from '../../../design-system/primitives/Button';
import { Input } from '../../../design-system/primitives/Input';
import {
  LayoutDashboard,
  FolderKanban,
  Trello,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { getCurrentUser } from '../../../mocks/data';

/**
 * AppShell Component
 *
 * Main layout wrapper with sidebar navigation and top bar.
 * Provides consistent navigation across all authenticated pages.
 */

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Projects', icon: FolderKanban, href: '/projects' },
  { label: 'Board', icon: Trello, href: '/board' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-white border-r border-neutral-200 transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">MiniPGMT</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 mx-auto">
              <span className="text-lg font-bold text-white">M</span>
            </div>
          )}
        </div>

        {/* Create Button */}
        <div className="p-4">
          {!sidebarCollapsed ? (
            <Button
              className="w-full"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => console.log('Create issue')}
            >
              Create Issue
            </Button>
          ) : (
            <Button
              size="icon"
              className="w-full"
              onClick={() => console.log('Create issue')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
                  sidebarCollapsed && 'justify-center'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'text-primary-600')} />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-error-main text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-neutral-200 p-4">
          <Button
            variant="ghost"
            size={sidebarCollapsed ? 'icon' : 'sm'}
            className="w-full"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* User Profile */}
        <div className="border-t border-neutral-200 p-4">
          <Link
            to="/profile"
            className={cn(
              'flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-100',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              size="sm"
              status="online"
            />
            {!sidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-neutral-500">{currentUser.email}</p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white transition-transform duration-300 lg:hidden',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">MiniPGMT</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Create Button */}
        <div className="p-4">
          <Button
            className="w-full"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => console.log('Create issue')}
          >
            Create Issue
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'text-primary-600')} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-error-main text-xs text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-neutral-200 p-4">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-neutral-100"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.name}
              size="sm"
              status="online"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-neutral-900">
                {currentUser.name}
              </p>
              <p className="truncate text-xs text-neutral-500">{currentUser.email}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-xl lg:block">
            <Input
              placeholder="Search issues, projects..."
              leftElement={<Search className="h-4 w-4" />}
              inputSize="sm"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-main opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-error-main"></span>
              </span>
            </Button>

            {/* User Menu - Desktop Only */}
            <div className="hidden lg:flex items-center gap-3 ml-2 pl-2 border-l border-neutral-200">
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.name}
                size="sm"
                status="online"
              />
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-neutral-900">{currentUser.name}</p>
                <p className="text-xs text-neutral-500">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
