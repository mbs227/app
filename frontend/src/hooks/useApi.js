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
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.defaultData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { method = 'GET', payload, debounce = 0 } = options;

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        if (method === 'GET') {
          response = await apiCall();
        } else {
          response = await apiCall(payload, { method, signal: controller.signal });
        }
        setData(response.data);
      } catch (err) {
        setError(err);
        const detail = err.response?.data?.detail || err.message;
        console.error('API Error:', err);
        if (err.response?.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Please log in again.",
            variant: "destructive",
          });
          // Trigger login refresh (implement in AuthContext if needed)
        } else if (err.response?.status === 405) {
          toast({
            title: "Method Not Allowed",
            description: "The request method is not supported. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: detail || "An error occurred while fetching data",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchData(), debounce);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (method === 'GET') {
        response = await apiCall();
      } else {
        response = await apiCall(payload, { method });
      }
      setData(response.data);
    } catch (err) {
      setError(err);
      console.error('API Refetch Error:', err);
      toast({
        title: "Error",
        description: err.response?.data?.detail || "An error occurred while refetching data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
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
        const detail = err.response?.data?.detail || options.errorMessage || "An error occurred";
        toast({
          title: "Error",
          description: detail,
          variant: "destructive",
        });
      }
      
      return null; // Return null instead of throwing for better control
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

// Hook for user data
export const useUser = () => {
  const { data: user, loading, error, refetch: refetchUser } = useApi(
    () => userAPI.getCurrentUser(),
    [],
    { defaultData: null }
  );
  return { user, loading, error, refetchUser };
};

// Hook for goals data
export const useGoals = () => {
  const { data: goals, loading, error, refetch: refetchGoals } = useApi(
    () => goalsAPI.getGoals(),
    [],
    { defaultData: [] }
  );
  return { goals, loading, error, refetchGoals };
};

// Hook for habits data
export const useHabits = () => {
  const { data: habits, loading, error, refetch: refetchHabits } = useApi(
    () => habitsAPI.getHabits(),
    [],
    { defaultData: [] }
  );
  return { habits, loading, error, refetchHabits };
};

// Hook for journal entries data
export const useJournalEntries = () => {
  const { data: entries, loading, error, refetch: refetchEntries } = useApi(
    () => journalAPI.getJournalEntries(),
    [],
    { defaultData: [] }
  );
  return { entries, loading, error, refetchEntries };
};

// Hook for affirmations data
export const useAffirmations = () => {
  const { data: affirmations, loading, error, refetch: refetchAffirmations } = useApi(
    () => affirmationsAPI.getAffirmations(),
    [],
    { defaultData: [] }
  );
  return { affirmations, loading, error, refetchAffirmations };
};

// Hook for gratitude entries data
export const useGratitudeEntries = () => {
  const { data: entries, loading, error, refetch: refetchEntries } = useApi(
    () => gratitudeAPI.getGratitudeEntries(),
    [],
    { defaultData: [] }
  );
  return { entries, loading, error, refetchEntries };
};

// Hook for community posts data
export const useCommunityPosts = () => {
  const { data: posts, loading, error, refetch: refetchPosts } = useApi(
    () => communityAPI.getCommunityPosts(),
    [],
    { defaultData: [] }
  );
  return { posts, loading, error, refetchPosts };
};

// Hook for vision boards data
export const useVisionBoards = () => {
  const { data: boards, loading, error, refetch: refetchBoards } = useApi(
    () => visionBoardAPI.getVisionBoards(),
    [],
    { defaultData: [] }
  );
  return { boards, loading, error, refetchBoards };
};

// Hook for templates data
export const useTemplates = () => {
  const { data: templates, loading, error, refetch: refetchTemplates } = useApi(
    () => templatesAPI.getTemplates(),
    [],
    { defaultData: [] }
  );
  return { templates, loading, error, refetchTemplates };
};

// Hook for global stats
export const useGlobalStats = () => {
  const { data: stats, loading, error, refetch: refetchStats } = useApi(
    () => statsAPI.getGlobalStats(),
    [],
    { defaultData: {} }
  );
  return { stats, loading, error, refetchStats };
};

// Hook for user stats
export const useUserStats = () => {
  const { data: stats, loading, error, refetch: refetchStats } = useApi(
    () => statsAPI.getUserStats(),
    [],
    { defaultData: {} }
  );
  return { stats, loading, error, refetchStats };
};
