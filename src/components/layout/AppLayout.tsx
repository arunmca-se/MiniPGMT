import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import type { Project } from '../../types';

interface AppLayoutProps {
  children: ReactNode;
  projects: Project[];
  currentView: 'dashboard' | 'project-detail';
  onNavigate: (view: 'dashboard' | 'project-detail', projectId?: string) => void;
  selectedProjectId?: string;
  pageTitle: string;
  onCreateClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AppLayout({
  children,
  projects,
  currentView,
  onNavigate,
  selectedProjectId,
  pageTitle,
  onCreateClick,
  searchQuery,
  onSearchChange,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        currentView={currentView}
        onNavigate={onNavigate}
        selectedProjectId={selectedProjectId}
      />

      {/* Main Content */}
      <div className="ml-60">
        <TopHeader
          title={pageTitle}
          onCreateClick={onCreateClick}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
