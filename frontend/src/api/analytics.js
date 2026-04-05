import apiClient from './client';

export const analyticsApi = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },
};
