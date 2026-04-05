import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';

// Query keys
export const authKeys = {
  all: ['auth'],
  user: () => [...authKeys.all, 'user'],
};

// Get current user
export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    enabled: enabled && !!localStorage.getItem('token'),
    retry: false,
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token);
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(authKeys.user(), null);
    queryClient.clear();
  };
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }) => authApi.resetPassword(token, newPassword),
  });
};

// Validate reset token
export const useValidateResetToken = (token) => {
  return useQuery({
    queryKey: ['resetToken', token],
    queryFn: () => authApi.validateResetToken(token),
    enabled: !!token,
    retry: false,
  });
};
