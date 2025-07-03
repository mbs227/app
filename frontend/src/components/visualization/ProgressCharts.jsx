import React from 'react';

const ProgressCharts = ({ analytics }) => {
  const {
    total_cycles = 0,
    active_cycles = 0,
    completed_cycles = 0,
    total_goals = 0,
    completed_goals = 0,
    average_completion_rate = 0,
    mood_trend = [],
    recent_manifestations = []
  } = analytics || {};

  const getMoodEmoji = (rating) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🥰', '✨', '🎉', '🌟'];
    return emojis[rating - 1] || '😐';
  };

  const getMoodColor = (rating) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 6) return 'text-blue-500';
    if (rating >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'from-green-500 to-emerald-500';
    if (rate >= 60) return 'from-blue-500 to-cyan-500';
    if (rate >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-purple-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
          <div className="text-2xl font-bold text-purple-700">{total_cycles}</div>
          <div className="text-sm text-purple-600">Total Cycles</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
          <div className="text-2xl font-bold text-blue-700">{active_cycles}</div>
          <div className="text-sm text-blue-600">Active Cycles</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="text-2xl font-bold text-green-700">{completed_goals}</div>
          <div className="text-sm text-green-600">Goals Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100">
          <div className="text-2xl font-bold text-pink-700">{Math.round(average_completion_rate)}%</div>
          <div className="text-sm text-pink-600">Completion Rate</div>
        </div>
      </div>

      {/* Goal Completion Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Completion Overview</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completed Goals</span>
            <span className="text-sm font-medium">{completed_goals} / {total_goals}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`bg-gradient-to-r ${getCompletionColor(average_completion_rate)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${(completed_goals / Math.max(total_goals, 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-lg font-bold text-gray-700">
              {Math.round((completed_goals / Math.max(total_goals, 1)) * 100)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">overall completion</span>
          </div>
        </div>
      </div>

      {/* Mood Trend */}
      {mood_trend.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood Trend</h3>
          
          <div className="flex items-end space-x-2 h-24 mb-4">
            {mood_trend.slice(0, 10).map((mood, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full bg-gradient-to-t ${
                    mood >= 8 ? 'from-green-400 to-green-500' :
                    mood >= 6 ? 'from-blue-400 to-blue-500' :
                    mood >= 4 ? 'from-yellow-400 to-yellow-500' :
                    'from-red-400 to-red-500'
                  } rounded-t transition-all duration-300`}
                  style={{ height: `${(mood / 10) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Oldest</span>
            <span>Recent</span>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-4">
            {mood_trend.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className={`text-2xl ${getMoodColor(mood_trend[0])}`}>
                  {getMoodEmoji(mood_trend[0])}
                </span>
                <span className="text-sm text-gray-600">
                  Latest: {mood_trend[0]}/10
                </span>
              </div>
            )}
            
            {mood_trend.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Average: {Math.round(mood_trend.reduce((a, b) => a + b, 0) / mood_trend.length)}/10
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Manifestations */}
      {recent_manifestations.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Manifestations</h3>
          
          <div className="space-y-3">
            {recent_manifestations.slice(0, 5).map((manifestation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <span className="text-lg">✨</span>
                <p className="text-sm text-gray-700 italic">"{manifestation}"</p>
              </div>
            ))}
          </div>
          
          {recent_manifestations.length > 5 && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-500">
                +{recent_manifestations.length - 5} more manifestations
              </span>
            </div>
          )}
        </div>
      )}

      {/* Inspirational Section */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-6 rounded-xl border border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Manifestation Journey</h3>
          <p className="text-gray-700 italic mb-4">
            "Every moment of your life is a manifestation of your consciousness. You are constantly creating your reality."
          </p>
          <p className="text-sm text-gray-600">- Neville Goddard</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;