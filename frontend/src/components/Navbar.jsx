import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Target, 
  Eye, 
  BookOpen, 
  MessageCircle, 
  Calendar, 
  Heart, 
  Users, 
  FileText,
  User,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useUser } from '../hooks/useApi';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Vision Board', href: '/vision-board', icon: Eye },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Affirmations', href: '/affirmations', icon: MessageCircle },
  { name: 'Habits', href: '/habits', icon: Calendar },
  { name: 'Gratitude', href: '/gratitude', icon: Heart },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Templates', href: '/templates', icon: FileText }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useUser();

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  // Default user data while loading
  const displayUser = user || {
    name: 'ManifestLife User',
    streak: 0,
    avatar: '/api/placeholder/50/50'
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ManifestLife
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loading && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-700">{displayUser.streak || 0} day streak</span>
              </div>
            )}
            
            <Link to="/profile" className="group">
              <Avatar className="w-8 h-8 ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all duration-200">
                <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                  {displayUser.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-purple-600"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-purple-100">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t border-purple-100">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                    {displayUser.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span>{displayUser.name}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}