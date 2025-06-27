import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://app-seven-mu-88.vercel.app';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Token management
let token = null;
export const setToken = (newToken) => {
  token = newToken;
};

// Request interceptor to add Authorization header and debug
api.interceptors.request.use(
  (config) => {
    if (token && config.url !== '/token') { // Avoid token on login
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request Details:', {
      method: config.method.toUpperCase(),
      url: config.url,
      headers: config.headers,
      data: config.data,
      timestamp: new Date().toISOString(),
    }); // Detailed debug log
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log('Response Details:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      console.error('API Error Details:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        data: response.data,
        headers: response.headers,
        timestamp: new Date().toISOString(),
      });
      if (response.status === 401) {
        console.warn('Unauthorized - token may be invalid or expired');
      } else if (response.status === 405) {
        console.warn('Method Not Allowed - check server configuration and allowed methods:', response.headers.allow);
      }
    } else {
      console.error('API Error (no response):', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
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
