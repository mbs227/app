import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CreateCycle from '../components/cycles/CreateCycle';
import CreateGoal from '../components/goals/CreateGoal';
import TwelveWeekCalendar from '../components/calendar/TwelveWeekCalendar';
import WeeklyCheckIn from '../components/reflections/WeeklyCheckIn';
import GoalDetailsModal from '../components/goals/GoalDetailsModal';
import AnalyticsDashboard from '../components/visualization/AnalyticsDashboard';
import CycleProgressRing from '../components/visualization/CycleProgressRing';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [cycles, setCycles] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCycle, setShowCreateCycle] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showWeeklyCheckIn, setShowWeeklyCheckIn] = useState(false);
  const [showGoalDetails, setShowGoalDetails] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cyclesResponse, goalsResponse] = await Promise.all([
        axios.get(`${API}/cycles`),
        axios.get(`${API}/goals`)
      ]);
      
      setCycles(cyclesResponse.data);
      setGoals(goalsResponse.data);
      
      if (cyclesResponse.data.length > 0 && !selectedCycle) {
        setSelectedCycle(cyclesResponse.data.find(c => c.status === 'active') || cyclesResponse.data[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCycleCreated = (newCycle) => {
    setCycles([...cycles, newCycle]);
    setSelectedCycle(newCycle);
    fetchData(); // Refresh data
  };

  const handleGoalCreated = (newGoal) => {
    setGoals([...goals, newGoal]);
    fetchData(); // Refresh data
  };

  const handleLogout = () => {
    logout();
  };

  const activeCycles = cycles.filter(c => c.status === 'active');
  const completedCycles = cycles.filter(c => c.status === 'completed');
  const cycleGoals = selectedCycle ? goals.filter(g => g.cycle_id === selectedCycle.id) : [];

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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              12-Week Calendar
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Goals & Progress
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'overview' && (
          <>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Cycles</h3>
                <p className="text-3xl font-bold text-purple-600">{activeCycles.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Cycles</h3>
                <p className="text-3xl font-bold text-green-600">{completedCycles.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Goals</h3>
                <p className="text-3xl font-bold text-blue-600">{goals.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Goals Completed</h3>
                <p className="text-3xl font-bold text-pink-600">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
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
                  <button 
                    onClick={() => setShowCreateCycle(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    Create Your First Cycle
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cycles.map((cycle) => (
                    <div 
                      key={cycle.id} 
                      onClick={() => setSelectedCycle(cycle)}
                      className={`border-2 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer ${
                        selectedCycle?.id === cycle.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
                      }`}
                    >
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
                <button 
                  onClick={() => setShowCreateCycle(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  New Cycle
                </button>
                <button 
                  onClick={() => selectedCycle && setShowCreateGoal(true)}
                  disabled={!selectedCycle}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Goal
                </button>
                <button 
                  onClick={() => setActiveTab('calendar')}
                  className="bg-gradient-to-r from-pink-600 to-blue-600 text-white p-4 rounded-lg font-medium hover:from-pink-700 hover:to-blue-700 transition-all duration-200"
                >
                  View Calendar
                </button>
                <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200">
                  Weekly Check-in
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'calendar' && selectedCycle && (
          <TwelveWeekCalendar cycle={selectedCycle} goals={cycleGoals} />
        )}

        {activeTab === 'goals' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Goals & Progress</h3>
              {selectedCycle && (
                <button
                  onClick={() => setShowCreateGoal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Add Goal
                </button>
              )}
            </div>

            {selectedCycle ? (
              <div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Showing goals for: </span>
                  <span className="font-medium text-gray-900">{selectedCycle.title}</span>
                </div>

                {cycleGoals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No goals created for this cycle yet.</p>
                    <button
                      onClick={() => setShowCreateGoal(true)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Your First Goal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cycleGoals.map((goal) => (
                      <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.category} • Week {goal.start_week}-{goal.target_week}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                            goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {goal.progress}%
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{goal.description}</p>

                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-purple-900 mb-1">💫 Law of Attraction "Why":</p>
                            <p className="text-sm text-purple-800 italic">"{goal.why_statement}"</p>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">🎭 Neville Goddard Visualization:</p>
                            <p className="text-sm text-blue-800 italic">"{goal.visualization_note}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Select a cycle to view its goals.</p>
              </div>
            )}
          </div>
        )}

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

      {/* Modals */}
      {showCreateCycle && (
        <CreateCycle
          onClose={() => setShowCreateCycle(false)}
          onCycleCreated={handleCycleCreated}
        />
      )}

      {showCreateGoal && selectedCycle && (
        <CreateGoal
          cycle={selectedCycle}
          onClose={() => setShowCreateGoal(false)}
          onGoalCreated={handleGoalCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;