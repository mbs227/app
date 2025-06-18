import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { 
  userAPI, 
  goalsAPI, 
  habitsAPI, 
  journalAPI, 
  affirmationsAPI, 
  gratitudeAPI, 
  communityAPI, 
  visionBoardAPI, 
  templatesAPI, 
  templateSessionsAPI,
  statsAPI 
} from '../api/apiService';

// Custom hook for API calls with loading and error handling
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error('API Error:', err);
        toast({
          title: "Error",
          description: err.response?.data?.detail || "An error occurred while fetching data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error('API Error:', err);
        toast({
          title: "Error",
          description: err.response?.data?.detail || "An error occurred while fetching data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }};
};

// Custom hook for mutations (create, update, delete operations)
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const mutate = async (apiCall, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }
      
      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "default",
        });
      }
      
      return response.data;
    } catch (err) {
      setError(err);
      console.error('Mutation Error:', err);
      
      if (options.onError) {
        options.onError(err);
      } else {
        toast({
          title: "Error",
          description: err.response?.data?.detail || options.errorMessage || "An error occurred",
          variant: "destructive",
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

// Hook for user data
export const useUser = () => {
  const { data: user, loading, error, refetch } = useApi(() => userAPI.getCurrentUser());
  return { user, loading, error, refetchUser: refetch };
};

// Hook for goals data
export const useGoals = () => {
  const { data: goals, loading, error, refetch } = useApi(() => goalsAPI.getGoals());
  return { goals: goals || [], loading, error, refetchGoals: refetch };
};

// Hook for habits data
export const useHabits = () => {
  const { data: habits, loading, error, refetch } = useApi(() => habitsAPI.getHabits());
  return { habits: habits || [], loading, error, refetchHabits: refetch };
};

// Hook for journal entries data
export const useJournalEntries = () => {
  const { data: entries, loading, error, refetch } = useApi(() => journalAPI.getJournalEntries());
  return { entries: entries || [], loading, error, refetchEntries: refetch };
};

// Hook for affirmations data
export const useAffirmations = () => {
  const { data: affirmations, loading, error, refetch } = useApi(() => affirmationsAPI.getAffirmations());
  return { affirmations: affirmations || [], loading, error, refetchAffirmations: refetch };
};

// Hook for gratitude entries data
export const useGratitudeEntries = () => {
  const { data: entries, loading, error, refetch } = useApi(() => gratitudeAPI.getGratitudeEntries());
  return { entries: entries || [], loading, error, refetchEntries: refetch };
};

// Hook for community posts data
export const useCommunityPosts = () => {
  const { data: posts, loading, error, refetch } = useApi(() => communityAPI.getCommunityPosts());
  return { posts: posts || [], loading, error, refetchPosts: refetch };
};

// Hook for vision boards data
export const useVisionBoards = () => {
  const { data: boards, loading, error, refetch } = useApi(() => visionBoardAPI.getVisionBoards());
  return { boards: boards || [], loading, error, refetchBoards: refetch };
};

// Hook for templates data
export const useTemplates = () => {
  const { data: templates, loading, error, refetch } = useApi(() => templatesAPI.getTemplates());
  return { templates: templates || [], loading, error, refetchTemplates: refetch };
};

// Hook for global stats
export const useGlobalStats = () => {
  const { data: stats, loading, error, refetch } = useApi(() => statsAPI.getGlobalStats());
  return { stats: stats || {}, loading, error, refetchStats: refetch };
};

// Hook for user stats
export const useUserStats = () => {
  const { data: stats, loading, error, refetch } = useApi(() => statsAPI.getUserStats());
  return { stats: stats || {}, loading, error, refetchStats: refetch };
};