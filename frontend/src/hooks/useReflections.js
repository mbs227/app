import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reflectionsApi } from '../api';

// Query keys
export const reflectionKeys = {
  all: ['reflections'],
  lists: () => [...reflectionKeys.all, 'list'],
  list: (cycleId) => [...reflectionKeys.lists(), { cycleId }],
  details: () => [...reflectionKeys.all, 'detail'],
  detail: (id) => [...reflectionKeys.details(), id],
};

// Get all reflections (optionally filtered by cycle)
export const useReflections = (cycleId) => {
  return useQuery({
    queryKey: reflectionKeys.list(cycleId),
    queryFn: () => reflectionsApi.getReflections(cycleId),
  });
};

// Get single reflection
export const useReflection = (reflectionId) => {
  return useQuery({
    queryKey: reflectionKeys.detail(reflectionId),
    queryFn: () => reflectionsApi.getReflection(reflectionId),
    enabled: !!reflectionId,
  });
};

// Create reflection mutation
export const useCreateReflection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reflectionsApi.createReflection,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reflectionKeys.lists() });
    },
  });
};
