import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api';

// Query key for dashboard stats
export const dashboardKeys = {
  stats: ['dashboard', 'stats'] as const,
};

// Hook to get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: () => dashboardApi.getStats(),
  });
}
