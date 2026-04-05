import apiClient from './client';

export const reflectionsApi = {
  // Get all reflections (optionally filtered by cycle)
  getReflections: async (cycleId) => {
    const params = cycleId ? { cycle_id: cycleId } : {};
    const response = await apiClient.get('/reflections', { params });
    return response.data;
  },

  // Get single reflection by ID
  getReflection: async (reflectionId) => {
    const response = await apiClient.get(`/reflections/${reflectionId}`);
    return response.data;
  },

  // Create new reflection
  createReflection: async (reflectionData) => {
    const response = await apiClient.post('/reflections', reflectionData);
    return response.data;
  },
};
