import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api';

// Query keys
export const analyticsKeys = {
  all: ['analytics'],
  dashboard: () => [...analyticsKeys.all, 'dashboard'],
};

// Get dashboard analytics
export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.getDashboardAnalytics,
  });
};
