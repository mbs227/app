import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import VisionBoard from './pages/VisionBoard';
import Journal from './pages/Journal';
import Affirmations from './pages/Affirmations';
import Habits from './pages/Habits';
import Gratitude from './pages/Gratitude';
import Community from './pages/Community';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import './App.css';

// Backend API configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE_URL = `${BACKEND_URL}/api`;

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/vision-board" element={<VisionBoard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/affirmations" element={<Affirmations />} />
              <Route path="/habits" element={<Habits />} />
              <Route path="/gratitude" element={<Gratitude />} />
              <Route path="/community" element={<Community />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;