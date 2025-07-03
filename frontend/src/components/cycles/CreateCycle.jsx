import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateCycle = ({ onClose, onCycleCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    law_of_attraction_statement: '',
    start_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cycleData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString()
      };

      const response = await axios.post(`${API}/cycles`, cycleData);
      
      if (onCycleCreated) {
        onCycleCreated(response.data);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating cycle:', error);
      setError(error.response?.data?.detail || 'Failed to create cycle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New 12-Week Cycle
            </h2>
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

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Cycle Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="e.g., Career Transformation, Health & Vitality"
              />
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
                placeholder="Describe what you want to achieve in this 12-week cycle..."
              />
            </div>

            <div>
              <label htmlFor="law_of_attraction_statement" className="block text-sm font-medium text-gray-700 mb-2">
                Law of Attraction Statement *
              </label>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-2">
                <p className="text-sm text-gray-600 italic mb-2">
                  💫 "Write your manifestation statement as if it has already happened. Feel the emotion of having achieved your goals."
                </p>
                <p className="text-xs text-gray-500">
                  Example: "I am already living my dream life, feeling abundant and fulfilled in every area."
                </p>
              </div>
              <textarea
                id="law_of_attraction_statement"
                name="law_of_attraction_statement"
                required
                rows={3}
                value={formData.law_of_attraction_statement}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="I am already..."
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your 12-week cycle will automatically end on {new Date(new Date(formData.start_date).getTime() + 84 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎯 What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Create specific goals for this cycle</li>
                <li>• Set weekly milestones and track progress</li>
                <li>• Complete weekly reflections with Neville Goddard prompts</li>
                <li>• Use the 12-week calendar to visualize your journey</li>
              </ul>
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
                {loading ? 'Creating...' : 'Create 12-Week Cycle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCycle;