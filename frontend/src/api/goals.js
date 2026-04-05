import apiClient from './client';

export const goalsApi = {
  // Get all goals (optionally filtered by cycle)
  getGoals: async (cycleId) => {
    const params = cycleId ? { cycle_id: cycleId } : {};
    const response = await apiClient.get('/goals', { params });
    return response.data;
  },

  // Get single goal by ID
  getGoal: async (goalId) => {
    const response = await apiClient.get(`/goals/${goalId}`);
    return response.data;
  },

  // Create new goal
  createGoal: async (goalData) => {
    const response = await apiClient.post('/goals', goalData);
    return response.data;
  },

  // Update goal
  updateGoal: async ({ goalId, ...updateData }) => {
    const response = await apiClient.put(`/goals/${goalId}`, updateData);
    return response.data;
  },

  // Update goal progress
  updateProgress: async ({ goalId, progressData }) => {
    const response = await apiClient.post(`/goals/${goalId}/progress`, progressData);
    return response.data;
  },

  // Get goal progress history
  getProgressHistory: async (goalId) => {
    const response = await apiClient.get(`/goals/${goalId}/progress-history`);
    return response.data;
  },
};
