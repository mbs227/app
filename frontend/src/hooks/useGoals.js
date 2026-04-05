import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api';

// Query keys
export const goalKeys = {
  all: ['goals'],
  lists: () => [...goalKeys.all, 'list'],
  list: (cycleId) => [...goalKeys.lists(), { cycleId }],
  details: () => [...goalKeys.all, 'detail'],
  detail: (id) => [...goalKeys.details(), id],
  progressHistory: (id) => [...goalKeys.all, 'progressHistory', id],
};

// Get all goals (optionally filtered by cycle)
export const useGoals = (cycleId) => {
  return useQuery({
    queryKey: goalKeys.list(cycleId),
    queryFn: () => goalsApi.getGoals(cycleId),
  });
};

// Get single goal
export const useGoal = (goalId) => {
  return useQuery({
    queryKey: goalKeys.detail(goalId),
    queryFn: () => goalsApi.getGoal(goalId),
    enabled: !!goalId,
  });
};

// Create goal mutation
export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
    },
  });
};

// Update goal mutation
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.updateGoal,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.setQueryData(goalKeys.detail(data.id), data);
    },
  });
};

// Update goal progress mutation
export const useUpdateGoalProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.updateProgress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      queryClient.setQueryData(goalKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: goalKeys.progressHistory(data.id) });
    },
  });
};

// Get goal progress history
export const useGoalProgressHistory = (goalId) => {
  return useQuery({
    queryKey: goalKeys.progressHistory(goalId),
    queryFn: () => goalsApi.getProgressHistory(goalId),
    enabled: !!goalId,
  });
};
