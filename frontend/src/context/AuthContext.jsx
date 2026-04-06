import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser, useLogin, useRegister, useLogout, authKeys } from '../hooks/useAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  // Get current user with React Query
  const { 
    data: user, 
    isLoading: loading,
    refetch: refetchUser 
  } = useCurrentUser();
  
  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const performLogout = useLogout();

  // Register handler
  const register = useCallback(async (userData) => {
    try {
      const data = await registerMutation.mutateAsync(userData);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  }, [registerMutation]);

  // Login handler
  const login = useCallback(async (credentials) => {
    try {
      const data = await loginMutation.mutateAsync(credentials);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  }, [loginMutation]);

  // Logout handler
  const logout = useCallback(() => {
    performLogout();
  }, [performLogout]);

  // Get token from localStorage
  const token = useMemo(() => localStorage.getItem('token'), [user]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refetchUser,
  }), [user, token, loading, login, register, logout, refetchUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
