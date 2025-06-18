import axios from 'axios';

// Backend API configuration - get directly from environment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (userData) => api.put('/users/me', userData),
  createUser: (userData) => api.post('/users', userData),
};

// Goals API
export const goalsAPI = {
  getGoals: () => api.get('/goals'),
  getGoal: (id) => api.get(`/goals/${id}`),
  createGoal: (goalData) => api.post('/goals', goalData),
  updateGoal: (id, goalData) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

// Vision Boards API
export const visionBoardAPI = {
  getVisionBoards: () => api.get('/vision-boards'),
  getVisionBoard: (id) => api.get(`/vision-boards/${id}`),
  createVisionBoard: (boardData) => api.post('/vision-boards', boardData),
  updateVisionBoard: (id, boardData) => api.put(`/vision-boards/${id}`, boardData),
  deleteVisionBoard: (id) => api.delete(`/vision-boards/${id}`),
};

// Journal API
export const journalAPI = {
  getJournalEntries: () => api.get('/journal-entries'),
  getJournalEntry: (id) => api.get(`/journal-entries/${id}`),
  createJournalEntry: (entryData) => api.post('/journal-entries', entryData),
  updateJournalEntry: (id, entryData) => api.put(`/journal-entries/${id}`, entryData),
  deleteJournalEntry: (id) => api.delete(`/journal-entries/${id}`),
  likeJournalEntry: (id) => api.post(`/journal-entries/${id}/like`),
};

// Affirmations API
export const affirmationsAPI = {
  getAffirmations: () => api.get('/affirmations'),
  getAffirmation: (id) => api.get(`/affirmations/${id}`),
  createAffirmation: (affirmationData) => api.post('/affirmations', affirmationData),
  updateAffirmation: (id, affirmationData) => api.put(`/affirmations/${id}`, affirmationData),
  deleteAffirmation: (id) => api.delete(`/affirmations/${id}`),
};

// Habits API
export const habitsAPI = {
  getHabits: () => api.get('/habits'),
  getHabit: (id) => api.get(`/habits/${id}`),
  createHabit: (habitData) => api.post('/habits', habitData),
  updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),
  deleteHabit: (id) => api.delete(`/habits/${id}`),
  toggleHabitCompletion: (id) => api.post(`/habits/${id}/toggle`),
};

// Gratitude API
export const gratitudeAPI = {
  getGratitudeEntries: () => api.get('/gratitude-entries'),
  getGratitudeEntry: (id) => api.get(`/gratitude-entries/${id}`),
  createGratitudeEntry: (entryData) => api.post('/gratitude-entries', entryData),
  updateGratitudeEntry: (id, entryData) => api.put(`/gratitude-entries/${id}`, entryData),
  deleteGratitudeEntry: (id) => api.delete(`/gratitude-entries/${id}`),
};

// Community API
export const communityAPI = {
  getCommunityPosts: () => api.get('/community-posts'),
  getMyCommunityPosts: () => api.get('/community-posts/my'),
  getCommunityPost: (id) => api.get(`/community-posts/${id}`),
  createCommunityPost: (postData) => api.post('/community-posts', postData),
  updateCommunityPost: (id, postData) => api.put(`/community-posts/${id}`, postData),
  deleteCommunityPost: (id) => api.delete(`/community-posts/${id}`),
  likeCommunityPost: (id) => api.post(`/community-posts/${id}/like`),
};

// Templates API
export const templatesAPI = {
  getTemplates: () => api.get('/templates'),
  getTemplate: (id) => api.get(`/templates/${id}`),
};

// Template Sessions API
export const templateSessionsAPI = {
  getTemplateSessions: () => api.get('/template-sessions'),
  getActiveTemplateSession: () => api.get('/template-sessions/active'),
  createTemplateSession: (sessionData) => api.post('/template-sessions', sessionData),
  updateTemplateSession: (id, sessionData) => api.put(`/template-sessions/${id}`, sessionData),
};

// Stats API
export const statsAPI = {
  getGlobalStats: () => api.get('/stats'),
  getUserStats: () => api.get('/stats/user'),
};

// Health API
export const healthAPI = {
  getHealth: () => api.get('/health'),
  getRoot: () => api.get('/'),
};

export default api;