import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const response = await axios.get(`${API}/cycles`);
      setCycles(response.data);
    } catch (error) {
      console.error('Error fetching cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Manifest 12
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.full_name}!</span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}! ✨
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • Your transformation journey continues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Cycles</h3>
            <p className="text-3xl font-bold text-purple-600">{cycles.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Cycles</h3>
            <p className="text-3xl font-bold text-green-600">{cycles.filter(c => c.status === 'completed').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Cycles</h3>
            <p className="text-3xl font-bold text-blue-600">{cycles.length}</p>
          </div>
        </div>

        {/* Current Cycles */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your 12-Week Cycles</h3>
          
          {cycles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No cycles yet</h4>
              <p className="text-gray-600 mb-6">Start your transformation journey by creating your first 12-week cycle</p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                Create Your First Cycle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{cycle.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cycle.status === 'active' ? 'bg-purple-100 text-purple-800' :
                      cycle.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cycle.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{cycle.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Week {cycle.current_week}/12</span>
                      <span className="text-sm font-medium text-gray-700">{Math.round((cycle.current_week / 12) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(cycle.current_week / 12) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Law of Attraction Statement */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 italic">
                      💫 "{cycle.law_of_attraction_statement}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
              New Cycle
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Weekly Check-in
            </button>
            <button className="bg-gradient-to-r from-pink-600 to-blue-600 text-white p-4 rounded-lg font-medium hover:from-pink-700 hover:to-blue-700 transition-all duration-200">
              Add Goal
            </button>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200">
              View Calendar
            </button>
          </div>
        </div>

        {/* Daily Inspiration */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Focus</h3>
            <p className="text-gray-700 italic">
              "What you assume to be true becomes your experience" - Neville Goddard
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;