import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://app-seven-mu-88.vercel.app';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token = null;

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const userAPI = {
  setToken: (newToken) => {
    token = newToken;
  },
  login: async (credentials) => {
    return await api.post('/token', credentials);
  },
  getCurrentUser: async () => {
    return await api.get('/users/me');
  },
  createUser: async (userData) => {
    return await api.post('/users', userData);
  },
  updateUser: async (userData) => {
    return await api.put('/users/me', userData);
  },
};

export const goalsAPI = {
  getGoals: () => api.get('/goals'),
  getGoal: (id) => api.get(`/goals/${id}`),
  createGoal: (goalData) => api.post('/goals', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

export const visionBoardAPI = {
  getVisionBoards: () => api.get('/vision-boards'),
  getVisionBoard: (id) => api.get(`/vision-boards/${id}`),
  createVisionBoard: (boardData) => api.post('/vision-boards', boardData),
  updateVisionBoard: (id, boardData) => api.put(`/vision-boards/${id}`, boardData),
  deleteVisionBoard: (id) => api.delete(`/vision-boards/${id}`),
};

export const journalAPI = {
  getJournalEntries: () => api.get('/journal-entries'),
  getJournalEntry: (id) => api.get(`/journal-entries/${id}`),
  createJournalEntry: (entryData) => api.post('/journal-entries', entryData),
  updateJournalEntry: (id, entryData) => api.put(`/journal-entries/${id}`, entryData),
  deleteJournalEntry: (id) => api.delete(`/journal-entries/${id}`),
  likeJournalEntry: (id) => api.post(`/journal-entries/${id}/like`),
};

export const affirmationsAPI = {
  getAffirmations: () => api.get('/affirmations'),
  getAffirmation: (id) => api.get(`/affirmations/${id}`),
  createAffirmation: (affirmationData) => api.post('/affirmations', affirmationData),
  updateAffirmation: (id, affirmationData) => api.put(`/affirmations/${id}`, affirmationData),
  deleteAffirmation: (id) => api.delete(`/affirmations/${id}`),
};

export const habitsAPI = {
  getHabits: () => api.get('/habits'),
  getHabit: (id) => api.get(`/habits/${id}`),
  createHabit: (habitData) => api.post('/habits', habitData),
  updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => api.delete(`/habits/${id}`),
  toggleHabitCompletion: (id) => api.post(`/habits/${id}/toggle`),
};

export const gratitudeAPI = {
  getGratitudeEntries: () => api.get('/gratitude-entries'),
  getGratitudeEntry: (id) => api.get(`/gratitude-entries/${id}`),
  createGratitudeEntry: (entryData) => api.post('/gratitude-entries', entryData),
  updateGratitudeEntry: (id, entryData) => api.put(`/gratitude-entries/${id}`, entryData),
  deleteGratitudeEntry: (id) => api.delete(`/gratitude-entries/${id}`),
};

export const communityAPI = {
  getCommunityPosts: () => api.get('/community-posts'),
  getMyCommunityPosts: () => api.get('/community-posts/my'),
  getCommunityPost: (id) => api.get(`/community-posts/${id}`),
  createCommunityPost: (postData) => api.post('/community-posts', postData),
  updateCommunityPost: (id, postData) => api.put(`/community-posts/${id}`, postData),
  deleteCommunityPost: (id) => api.delete(`/community-posts/${id}`),
  likeCommunityPost: (id) => api.post(`/community-posts/${id}/like`),
};

export const templatesAPI = {
  getTemplates: () => api.get('/templates'),
  getTemplate: (id) => api.get(`/templates/${id}`),
};

export const templateSessionsAPI = {
  getTemplateSessions: () => api.get('/template-sessions'),
  getActiveTemplateSession: () => api.get('/template-sessions/active'),
  createTemplateSession: (sessionData) => api.post('/template-sessions', sessionData),
  updateTemplateSession: (id, sessionData) => api.put(`/template-sessions/${id}`, sessionData),
};

export const statsAPI = {
  getGlobalStats: () => api.get('/stats'),
  getUserStats: () => api.get('/stats/user'),
};

export const healthAPI = {
  getHealth: () => api.get('/health'),
  getRoot: () => api.get('/'),
};

export default api;
