import { useState } from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

type TimeFilter = 'today' | 'week' | 'month';

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('today');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {userName}! <span className="inline-block animate-wave">👋</span>
        </h2>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['today', 'week', 'month'] as TimeFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeFilter === filter
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
