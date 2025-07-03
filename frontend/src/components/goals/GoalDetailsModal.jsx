import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const GoalDetailsModal = ({ goal, onClose, onGoalUpdated }) => {
  const [progressData, setProgressData] = useState({
    progress: goal.progress,
    notes: '',
    milestone_updates: goal.milestones || []
  });
  const [progressHistory, setProgressHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgressHistory();
  }, [goal.id]);

  const fetchProgressHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/goals/${goal.id}/progress-history`);
      setProgressHistory(response.data.snapshots || []);
    } catch (error) {
      console.error('Error fetching progress history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setProgressData({
      ...progressData,
      progress: newProgress
    });
  };

  const handleNotesChange = (e) => {
    setProgressData({
      ...progressData,
      notes: e.target.value
    });
  };

  const toggleMilestone = (milestoneIndex) => {
    const updatedMilestones = [...progressData.milestone_updates];
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      completed: !updatedMilestones[milestoneIndex].completed,
      completed_date: !updatedMilestones[milestoneIndex].completed ? 
        new Date().toISOString() : null
    };
    
    setProgressData({
      ...progressData,
      milestone_updates: updatedMilestones
    });
  };

  const handleUpdateProgress = async () => {
    setError('');
    setUpdating(true);

    try {
      const response = await axios.post(`${API}/goals/${goal.id}/progress`, progressData);
      
      if (onGoalUpdated) {
        onGoalUpdated(response.data);
      }
      
      // Refresh progress history
      await fetchProgressHistory();
      
      // Reset notes after successful update
      setProgressData({
        ...progressData,
        notes: ''
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      setError(error.response?.data?.detail || 'Failed to update progress');
    } finally {
      setUpdating(false);
    }
  };

  const getProgressColor = () => {
    if (progressData.progress >= 90) return 'from-green-500 to-emerald-500';
    if (progressData.progress >= 70) return 'from-blue-500 to-cyan-500';
    if (progressData.progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-purple-500 to-pink-500';
  };

  const getStatusBadge = () => {
    if (goal.status === 'completed') return 'bg-green-100 text-green-800';
    if (goal.status === 'in_progress') return 'bg-blue-100 text-blue-800';
    if (goal.status === 'on_hold') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const completedMilestones = progressData.milestone_updates.filter(m => m.completed).length;
  const totalMilestones = progressData.milestone_updates.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{goal.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}>
                  {goal.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-x-4">
                <span>{goal.category}</span>
                <span>•</span>
                <span>Week {goal.start_week}-{goal.target_week}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold ml-4"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{goal.description}</p>
          </div>

          {/* Progress Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress & Timeline</h3>
              <div className="text-2xl font-bold text-gray-700">{progressData.progress}%</div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className={`bg-gradient-to-r ${getProgressColor()} h-4 rounded-full transition-all duration-500 relative`}
                style={{ width: `${progressData.progress}%` }}
              >
                {progressData.progress > 10 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                    {progressData.progress}%
                  </div>
                )}
              </div>
            </div>

            {/* Progress Update Controls */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Progress
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressData.progress}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{progressData.progress}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Notes
                </label>
                <textarea
                  value={progressData.notes}
                  onChange={handleNotesChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                  placeholder="Add a note about this progress update..."
                />
              </div>

              <button
                onClick={handleUpdateProgress}
                disabled={updating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : 'Update Progress'}
              </button>
            </div>
          </div>

          {/* Milestones */}
          {totalMilestones > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
                <span className="text-sm text-gray-600">
                  {completedMilestones}/{totalMilestones} completed
                </span>
              </div>
              
              <div className="space-y-3">
                {progressData.milestone_updates.map((milestone, index) => (
                  <div 
                    key={milestone.id || index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                      milestone.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleMilestone(index)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        milestone.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {milestone.completed && <span className="text-xs">✓</span>}
                    </button>
                    <div className="flex-1">
                      <span className={`${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {milestone.title}
                      </span>
                      {milestone.completed && milestone.completed_date && (
                        <div className="text-xs text-green-600 mt-1">
                          Completed {formatDate(milestone.completed_date)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Law of Attraction Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Law of Attraction Integration</h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-900 mb-2">💫 Your "Why" Statement</h4>
                <p className="text-purple-800 italic">"{goal.why_statement}"</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-medium text-blue-900 mb-2">🎭 Neville Goddard Visualization</h4>
                <p className="text-blue-800 italic">"{goal.visualization_note}"</p>
              </div>
            </div>
          </div>

          {/* Progress History */}
          {progressHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress History</h3>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {progressHistory.slice().reverse().map((snapshot, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {snapshot.progress}%
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Progress updated to {snapshot.progress}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(snapshot.date)}
                        </div>
                        {snapshot.notes && (
                          <div className="text-sm text-gray-700 mt-1 italic">
                            "{snapshot.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-700 italic mb-1">
              "Persist in your assumption and you will win the crown of victory."
            </p>
            <p className="text-xs text-gray-500">- Neville Goddard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailsModal;