import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WeeklyCheckIn = ({ cycle, weekNumber, onClose, onReflectionCreated }) => {
  const [formData, setFormData] = useState({
    progress_review: '',
    law_of_attraction_manifestations: [''],
    neville_goddard_practice: '',
    challenges: '',
    insights: '',
    next_week_focus: [''],
    mood_rating: 7
  });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCycleGoals();
  }, [cycle]);

  const fetchCycleGoals = async () => {
    try {
      const response = await axios.get(`${API}/goals?cycle_id=${cycle.id}`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'range' || type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const addArrayItem = (arrayName) => {
    setFormData({
      ...formData,
      [arrayName]: [...formData[arrayName], '']
    });
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData({ ...formData, [arrayName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reflectionData = {
        cycle_id: cycle.id,
        week_number: weekNumber,
        ...formData,
        law_of_attraction_manifestations: formData.law_of_attraction_manifestations.filter(m => m.trim()),
        next_week_focus: formData.next_week_focus.filter(f => f.trim())
      };

      const response = await axios.post(`${API}/reflections`, reflectionData);
      
      if (onReflectionCreated) {
        onReflectionCreated(response.data);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating reflection:', error);
      setError(error.response?.data?.detail || 'Failed to save reflection');
    } finally {
      setLoading(false);
    }
  };

  const weekDates = () => {
    if (!cycle.start_date) return '';
    const startDate = new Date(cycle.start_date);
    const weekStart = new Date(startDate.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getMoodEmoji = (rating) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🥰', '✨', '🎉', '🌟'];
    return emojis[rating - 1] || '😐';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Week {weekNumber} Check-in
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {cycle.title} • {weekDates()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Progress Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📊 Progress Review *
              </label>
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-blue-800 mb-2">How did you progress on your goals this week?</p>
                {goals.length > 0 && (
                  <div className="space-y-1">
                    {goals.map((goal) => (
                      <div key={goal.id} className="text-xs text-blue-700">
                        • {goal.title} ({goal.category}) - Currently at {goal.progress}%
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                name="progress_review"
                required
                rows={4}
                value={formData.progress_review}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Reflect on your progress this week..."
              />
            </div>

            {/* Law of Attraction Manifestations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                💫 Law of Attraction Manifestations
              </label>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-purple-800">What did you attract or manifest this week?</p>
              </div>
              <div className="space-y-2">
                {formData.law_of_attraction_manifestations.map((manifestation, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={manifestation}
                      onChange={(e) => handleArrayChange('law_of_attraction_manifestations', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                      placeholder="I attracted..."
                    />
                    {formData.law_of_attraction_manifestations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('law_of_attraction_manifestations', index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('law_of_attraction_manifestations')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  + Add another manifestation
                </button>
              </div>
            </div>

            {/* Neville Goddard Practice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🎭 Neville Goddard Daily Practice *
              </label>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-blue-800 mb-1">How was your visualization and "living in the end" practice?</p>
                <p className="text-xs text-blue-600 italic">
                  Remember: "Assume the feeling of the wish fulfilled"
                </p>
              </div>
              <textarea
                name="neville_goddard_practice"
                required
                rows={3}
                value={formData.neville_goddard_practice}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Describe your visualization practice and how you felt living in the end..."
              />
            </div>

            {/* Challenges and Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚡ Challenges
                </label>
                <textarea
                  name="challenges"
                  rows={3}
                  value={formData.challenges}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="What challenges did you face?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💡 Insights & Breakthroughs
                </label>
                <textarea
                  name="insights"
                  rows={3}
                  value={formData.insights}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="What insights or breakthroughs did you have?"
                />
              </div>
            </div>

            {/* Next Week Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🎯 Next Week's Focus
              </label>
              <div className="space-y-2">
                {formData.next_week_focus.map((focus, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={focus}
                      onChange={(e) => handleArrayChange('next_week_focus', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                      placeholder="What will you focus on next week?"
                    />
                    {formData.next_week_focus.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('next_week_focus', index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('next_week_focus')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  + Add another focus area
                </button>
              </div>
            </div>

            {/* Mood Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🌈 Overall Mood This Week
              </label>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">How are you feeling overall?</span>
                  <span className="text-2xl">{getMoodEmoji(formData.mood_rating)}</span>
                </div>
                <input
                  type="range"
                  name="mood_rating"
                  min="1"
                  max="10"
                  value={formData.mood_rating}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low (1)</span>
                  <span className="font-medium text-purple-700">{formData.mood_rating}/10</span>
                  <span>High (10)</span>
                </div>
              </div>
            </div>

            {/* Quote Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 italic mb-1">
                "The world is yourself pushed out. Ask yourself what you want and then give it to yourself!"
              </p>
              <p className="text-xs text-gray-500">- Neville Goddard</p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Complete Check-in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCheckIn;