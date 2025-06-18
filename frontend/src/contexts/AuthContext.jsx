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

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have a stored user session
      const storedUser = localStorage.getItem('manifestlife_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verify with backend
        try {
          const response = await userAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // If backend call fails, clear stored data
          localStorage.removeItem('manifestlife_user');
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

  const login = async (email, name) => {
    try {
      setLoading(true);
      
      // Try to get existing user or create new one
      let userData;
      try {
        const response = await userAPI.getCurrentUser();
        userData = response.data;
      } catch (error) {
        // User doesn't exist, create new one
        const createResponse = await userAPI.createUser({
          email,
          name,
          bio: `Welcome to ManifestLife! I'm ${name} and I'm excited to start my manifestation journey.`,
          location: '',
          website: ''
        });
        userData = createResponse.data;
      }

      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('manifestlife_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('manifestlife_user');
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