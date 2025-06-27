import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('manifestlife_token');
      if (token) {
        try {
          const response = await userAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('manifestlife_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await userAPI.login({ username: email, password });
      const { access_token } = response.data;
      localStorage.setItem('manifestlife_token', access_token);
      userAPI.setToken(access_token);
      const userResponse = await userAPI.getCurrentUser();
      setUser(userResponse.data);
      setIsAuthenticated(true);
      return userResponse.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('manifestlife_token');
    userAPI.setToken(null);
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await userAPI.updateUser(updatedData);
      const newUserData = response.data;
      setUser(newUserData);
      localStorage.setItem('manifestlife_user', JSON.stringify(newUserData));
      return newUserData;
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
