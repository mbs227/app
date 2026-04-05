import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cyclesApi } from '../api';

// Query keys
export const cycleKeys = {
  all: ['cycles'],
  lists: () => [...cycleKeys.all, 'list'],
  list: () => [...cycleKeys.lists()],
  details: () => [...cycleKeys.all, 'detail'],
  detail: (id) => [...cycleKeys.details(), id],
  analytics: (id) => [...cycleKeys.all, 'analytics', id],
};

// Get all cycles
export const useCycles = () => {
  return useQuery({
    queryKey: cycleKeys.list(),
    queryFn: cyclesApi.getCycles,
  });
};

// Get single cycle
export const useCycle = (cycleId) => {
  return useQuery({
    queryKey: cycleKeys.detail(cycleId),
    queryFn: () => cyclesApi.getCycle(cycleId),
    enabled: !!cycleId,
  });
};

// Create cycle mutation
export const useCreateCycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cyclesApi.createCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
    },
  });
};

// Update cycle mutation
export const useUpdateCycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cyclesApi.updateCycle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
      queryClient.setQueryData(cycleKeys.detail(data.id), data);
    },
  });
};

// Get cycle analytics
export const useCycleAnalytics = (cycleId) => {
  return useQuery({
    queryKey: cycleKeys.analytics(cycleId),
    queryFn: () => cyclesApi.getCycleAnalytics(cycleId),
    enabled: !!cycleId,
  });
};

// Complete cycle mutation
export const useCompleteCycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cyclesApi.completeCycle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cycleKeys.lists() });
      queryClient.setQueryData(cycleKeys.detail(data.id), data);
    },
  });
};
