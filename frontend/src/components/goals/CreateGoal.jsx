import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateGoal = ({ cycle, onClose, onGoalCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    start_week: 1,
    target_week: 12,
    why_statement: '',
    visualization_note: '',
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Career', 'Health & Fitness', 'Relationships', 'Finance', 
    'Personal Development', 'Education', 'Creative', 'Spiritual', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setFormData({
        ...formData,
        milestones: [
          ...formData.milestones,
          {
            id: Date.now().toString(),
            title: newMilestone.trim(),
            completed: false,
            completed_date: null
          }
        ]
      });
      setNewMilestone('');
    }
  };

  const removeMilestone = (id) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter(m => m.id !== id)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const goalData = {
        ...formData,
        cycle_id: cycle.id,
        start_week: parseInt(formData.start_week),
        target_week: parseInt(formData.target_week)
      };

      const response = await axios.post(`${API}/goals`, goalData);
      
      if (onGoalCreated) {
        onGoalCreated(response.data);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      setError(error.response?.data?.detail || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create New Goal
              </h2>
              <p className="text-gray-600 text-sm mt-1">For cycle: {cycle.title}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="e.g., Complete LinkedIn Profile Optimization"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Describe your goal in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_week" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Week
                </label>
                <select
                  id="start_week"
                  name="start_week"
                  value={formData.start_week}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>Week {i+1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="target_week" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Week
                </label>
                <select
                  id="target_week"
                  name="target_week"
                  value={formData.target_week}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>Week {i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="why_statement" className="block text-sm font-medium text-gray-700 mb-2">
                Law of Attraction "Why" Statement *
              </label>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-2">
                <p className="text-sm text-gray-600 italic mb-1">
                  💫 "Why do you deserve to achieve this goal? Connect with the deeper meaning and emotion."
                </p>
                <p className="text-xs text-gray-500">
                  Example: "I deserve recognition as a leader in my field because my skills and experience make me irresistible to dream employers."
                </p>
              </div>
              <textarea
                id="why_statement"
                name="why_statement"
                required
                rows={3}
                value={formData.why_statement}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="I deserve to achieve this because..."
              />
            </div>

            <div>
              <label htmlFor="visualization_note" className="block text-sm font-medium text-gray-700 mb-2">
                Neville Goddard Visualization *
              </label>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-2">
                <p className="text-sm text-gray-600 italic mb-1">
                  🎭 "See yourself as already having achieved this goal. What does it feel like? What do you see, hear, and experience?"
                </p>
                <p className="text-xs text-gray-500">
                  Example: "I see myself receiving congratulations, feel the satisfaction of my perfect profile, and experience the excitement of interview requests flowing in."
                </p>
              </div>
              <textarea
                id="visualization_note"
                name="visualization_note"
                required
                rows={3}
                value={formData.visualization_note}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="I see myself already having achieved this goal. I feel..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestones (Optional)
              </label>
              <div className="space-y-2">
                {formData.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {milestone.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                    placeholder="Add a milestone..."
                  />
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
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
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGoal;