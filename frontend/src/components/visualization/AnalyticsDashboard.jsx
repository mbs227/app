import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CycleProgressRing from './CycleProgressRing';
import ProgressCharts from './ProgressCharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsDashboard = ({ selectedCycle }) => {
  const [dashboardAnalytics, setDashboardAnalytics] = useState(null);
  const [cycleAnalytics, setCycleAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedCycle]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const dashboardPromise = axios.get(`${API}/analytics/dashboard`);
      const cyclePromise = selectedCycle ? 
        axios.get(`${API}/cycles/${selectedCycle.id}/analytics`) : 
        Promise.resolve(null);

      const [dashboardResponse, cycleResponse] = await Promise.all([
        dashboardPromise,
        cyclePromise
      ]);

      setDashboardAnalytics(dashboardResponse.data);
      setCycleAnalytics(cycleResponse?.data || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cycle Progress Rings */}
      {selectedCycle && cycleAnalytics && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Cycle Progress</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall Cycle Progress */}
            <div className="text-center">
              <CycleProgressRing
                progress={(selectedCycle.current_week / 12) * 100}
                currentWeek={selectedCycle.current_week}
                totalWeeks={12}
                cycleTitle="Time Progress"
                size={140}
              />
            </div>

            {/* Goal Completion Progress */}
            <div className="text-center">
              <CycleProgressRing
                progress={cycleAnalytics.completion_rate}
                currentWeek={cycleAnalytics.goals_completed}
                totalWeeks={cycleAnalytics.goals_total}
                cycleTitle="Goal Completion"
                size={140}
              />
            </div>

            {/* Manifestation Progress */}
            <div className="text-center">
              <CycleProgressRing
                progress={Math.min((cycleAnalytics.manifestation_count / 12) * 100, 100)}
                currentWeek={cycleAnalytics.manifestation_count}
                totalWeeks={12}
                cycleTitle="Manifestations"
                size={140}
              />
            </div>
          </div>

          {/* Cycle Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">
                {cycleAnalytics.weeks_completed}
              </div>
              <div className="text-sm text-purple-600">Weeks Completed</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">
                {cycleAnalytics.goals_completed}/{cycleAnalytics.goals_total}
              </div>
              <div className="text-sm text-blue-600">Goals Completed</div>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-700">
                {cycleAnalytics.manifestation_count}
              </div>
              <div className="text-sm text-pink-600">Manifestations</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">
                {Math.round(cycleAnalytics.average_mood)}/10
              </div>
              <div className="text-sm text-green-600">Average Mood</div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Analytics */}
      {dashboardAnalytics && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Overall Progress Analytics</h3>
          <ProgressCharts analytics={dashboardAnalytics} />
        </div>
      )}

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Insights & Recommendations</h3>
        
        <div className="space-y-4">
          {/* Cycle Insights */}
          {selectedCycle && cycleAnalytics && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Cycle Performance</h4>
              <div className="space-y-2 text-sm text-purple-800">
                {cycleAnalytics.completion_rate >= 80 ? (
                  <p>✨ Excellent progress! You're crushing your goals this cycle.</p>
                ) : cycleAnalytics.completion_rate >= 60 ? (
                  <p>💪 Good momentum! Keep focusing on your daily visualization practice.</p>
                ) : cycleAnalytics.completion_rate >= 40 ? (
                  <p>🌱 You're making progress. Consider breaking goals into smaller milestones.</p>
                ) : (
                  <p>🎯 Time to refocus. Remember Neville's teaching: "Assume the feeling of the wish fulfilled."</p>
                )}
                
                {cycleAnalytics.manifestation_count < 3 && (
                  <p>📝 Try documenting more manifestations in your weekly reflections - even small wins count!</p>
                )}
              </div>
            </div>
          )}

          {/* Mood Insights */}
          {dashboardAnalytics && dashboardAnalytics.mood_trend.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🌈 Mood Insights</h4>
              <div className="text-sm text-blue-800">
                {(() => {
                  const avgMood = dashboardAnalytics.mood_trend.reduce((a, b) => a + b, 0) / dashboardAnalytics.mood_trend.length;
                  if (avgMood >= 8) {
                    return <p>🎉 Your energy is radiant! You're in perfect alignment with your manifestations.</p>;
                  } else if (avgMood >= 6) {
                    return <p>😊 You're maintaining positive energy. Keep up the visualization practice!</p>;
                  } else if (avgMood >= 4) {
                    return <p>🌱 Consider spending more time in gratitude and visualization to raise your vibration.</p>;
                  } else {
                    return <p>💝 Remember: "Your mood is your manifestation power. Choose thoughts that feel good."</p>;
                  }
                })()}
              </div>
            </div>
          )}

          {/* Goal Completion Insights */}
          {dashboardAnalytics && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🎯 Goal Achievement</h4>
              <div className="text-sm text-green-800">
                {dashboardAnalytics.average_completion_rate >= 80 ? (
                  <p>🏆 You're a manifestation master! Your consistency is paying off beautifully.</p>
                ) : dashboardAnalytics.average_completion_rate >= 60 ? (
                  <p>🚀 Strong progress! Consider celebrating small wins to maintain momentum.</p>
                ) : dashboardAnalytics.average_completion_rate >= 40 ? (
                  <p>💫 You're building momentum. Trust the process and stay consistent.</p>
                ) : (
                  <p>🌟 Every master was once a beginner. Focus on feeling grateful for progress made.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Neville Goddard Wisdom */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-6 rounded-xl border border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💫 Daily Manifestation Wisdom</h3>
          <p className="text-gray-700 italic mb-2">
            "The secret of imagining is the greatest of all problems, to the solution of which every one should aspire, for supreme power, supreme wisdom, supreme delight lie in the far-off solution of this mystery."
          </p>
          <p className="text-sm text-gray-600">- Neville Goddard</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;