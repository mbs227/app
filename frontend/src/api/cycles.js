import apiClient from './client';

export const cyclesApi = {
  // Get all cycles for current user
  getCycles: async () => {
    const response = await apiClient.get('/cycles');
    return response.data;
  },

  // Get single cycle by ID
  getCycle: async (cycleId) => {
    const response = await apiClient.get(`/cycles/${cycleId}`);
    return response.data;
  },

  // Create new cycle
  createCycle: async (cycleData) => {
    const response = await apiClient.post('/cycles', cycleData);
    return response.data;
  },

  // Update cycle
  updateCycle: async ({ cycleId, ...updateData }) => {
    const response = await apiClient.put(`/cycles/${cycleId}`, updateData);
    return response.data;
  },

  // Get cycle analytics
  getCycleAnalytics: async (cycleId) => {
    const response = await apiClient.get(`/cycles/${cycleId}/analytics`);
    return response.data;
  },

  // Complete cycle
  completeCycle: async ({ cycleId, completionData }) => {
    const response = await apiClient.post(`/cycles/${cycleId}/complete`, completionData);
    return response.data;
  },
};
