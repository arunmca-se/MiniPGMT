import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface TopHeaderProps {
  title: string;
  onCreateClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TopHeader({ title, onCreateClick, searchQuery, onSearchChange }: TopHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, projects, or team members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Create Button */}
        <Button
          onClick={onCreateClick}
          className="bg-sky-500 hover:bg-sky-600 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Issue
        </Button>
      </div>
    </header>
  );
}
