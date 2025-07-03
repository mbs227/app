import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TwelveWeekCalendar = ({ cycle, goals = [] }) => {
  const [selectedWeek, setSelectedWeek] = useState(cycle?.current_week || 1);
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    if (cycle) {
      fetchReflections();
    }
  }, [cycle]);

  const fetchReflections = async () => {
    try {
      const response = await axios.get(`${API}/reflections?cycle_id=${cycle.id}`);
      setReflections(response.data);
    } catch (error) {
      console.error('Error fetching reflections:', error);
    }
  };

  const getWeekStatus = (weekNumber) => {
    if (weekNumber < cycle.current_week) return 'completed';
    if (weekNumber === cycle.current_week) return 'current';
    return 'upcoming';
  };

  const getWeekStatusIcon = (weekNumber) => {
    const status = getWeekStatus(weekNumber);
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '🔄';
      case 'upcoming': return '⏳';
      default: return '⏳';
    }
  };

  const getWeekStatusColor = (weekNumber) => {
    const status = getWeekStatus(weekNumber);
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'current': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'upcoming': return 'bg-gray-100 border-gray-300 text-gray-600';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getGoalsForWeek = (weekNumber) => {
    return goals.filter(goal => 
      weekNumber >= goal.start_week && weekNumber <= goal.target_week
    );
  };

  const hasReflection = (weekNumber) => {
    return reflections.some(r => r.week_number === weekNumber);
  };

  const getWeekDates = (weekNumber) => {
    if (!cycle.start_date) return null;
    const startDate = new Date(cycle.start_date);
    const weekStart = new Date(startDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    return {
      start: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const selectedWeekGoals = getGoalsForWeek(selectedWeek);
  const selectedWeekDates = getWeekDates(selectedWeek);
  const selectedWeekReflection = reflections.find(r => r.week_number === selectedWeek);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">12-Week Calendar</h3>
        <div className="text-sm text-gray-600">
          {cycle.title} • Week {cycle.current_week}/12
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
        {Array.from({ length: 12 }, (_, index) => {
          const weekNumber = index + 1;
          const weekGoals = getGoalsForWeek(weekNumber);
          const weekDates = getWeekDates(weekNumber);
          
          return (
            <div
              key={weekNumber}
              onClick={() => setSelectedWeek(weekNumber)}
              className={`
                relative p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedWeek === weekNumber 
                  ? 'ring-2 ring-purple-500 ring-offset-2' 
                  : ''
                }
                ${getWeekStatusColor(weekNumber)}
              `}
            >
              <div className="text-center">
                <div className="font-semibold text-sm">W{weekNumber}</div>
                <div className="text-lg">{getWeekStatusIcon(weekNumber)}</div>
                
                {weekDates && (
                  <div className="text-xs mt-1">
                    {weekDates.start}-{weekDates.end}
                  </div>
                )}
                
                {/* Goals indicator */}
                {weekGoals.length > 0 && (
                  <div className="mt-1">
                    {weekGoals.map((goal, idx) => (
                      <div key={idx} className="text-xs truncate">
                        {goal.category.charAt(0)}: {goal.progress}%
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reflection indicator */}
                {hasReflection(weekNumber) && (
                  <div className="absolute top-1 right-1">
                    <span className="text-xs">📝</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center space-x-2">
          <span>✅</span>
          <span className="text-gray-600">Completed Week</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>🔄</span>
          <span className="text-gray-600">Current Week</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>⏳</span>
          <span className="text-gray-600">Upcoming Week</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>📝</span>
          <span className="text-gray-600">Reflection Available</span>
        </div>
      </div>

      {/* Selected Week Details */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Week {selectedWeek} Details
          {selectedWeekDates && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({selectedWeekDates.start} - {selectedWeekDates.end})
            </span>
          )}
        </h4>

        {selectedWeekGoals.length > 0 ? (
          <div className="space-y-3 mb-4">
            <h5 className="font-medium text-gray-700">Goals for this week:</h5>
            {selectedWeekGoals.map((goal) => (
              <div key={goal.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900">{goal.title}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    goal.progress === 100 ? 'bg-green-100 text-green-800' :
                    goal.progress > 0 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.progress}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 text-sm mb-4">
            No goals scheduled for this week.
          </div>
        )}

        {/* Law of Attraction Focus */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
          <h5 className="font-medium text-gray-900 mb-2">Law of Attraction Focus:</h5>
          <p className="text-gray-700 italic">
            💫 "{cycle.law_of_attraction_statement}"
          </p>
        </div>

        {/* Reflection Status */}
        {selectedWeekReflection ? (
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">✅ Week {selectedWeek} Reflection Complete</h5>
            <p className="text-green-700 text-sm">
              Mood: {selectedWeekReflection.mood_rating}/10 • 
              Completed on {new Date(selectedWeekReflection.created_at).toLocaleDateString()}
            </p>
          </div>
        ) : getWeekStatus(selectedWeek) === 'completed' ? (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-medium text-yellow-900 mb-2">📝 Reflection Pending</h5>
            <p className="text-yellow-700 text-sm">
              Week {selectedWeek} is complete. Consider adding a reflection to capture your insights.
            </p>
          </div>
        ) : getWeekStatus(selectedWeek) === 'current' ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">🔄 Current Week in Progress</h5>
            <p className="text-blue-700 text-sm">
              Focus on your goals and practice your visualization daily.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">⏳ Upcoming Week</h5>
            <p className="text-gray-700 text-sm">
              Prepare mentally for the goals and milestones ahead.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwelveWeekCalendar;