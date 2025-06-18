import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  BookOpen, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Award, 
  Flame,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockUser, mockGoals, mockHabits, mockStats, mockJournalEntries } from '../mock/mockData';

export default function Dashboard() {
  const completedHabitsToday = mockHabits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;

  const totalHabits = mockHabits.length;
  const recentGoals = mockGoals.slice(0, 3);
  const recentJournalEntry = mockJournalEntries[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-center mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-purple-200 shadow-lg">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Welcome back, {mockUser.name.split(' ')[0]}! ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your manifestation journey continues. Today is full of infinite possibilities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Current Streak</p>
                  <p className="text-3xl font-bold flex items-center">
                    {mockUser.streak}
                    <Flame className="w-6 h-6 ml-2 text-orange-300" />
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Active Goals</p>
                  <p className="text-3xl font-bold">{mockGoals.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Habits Today</p>
                  <p className="text-3xl font-bold">{completedHabitsToday}/{totalHabits}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Goals Completed</p>
                  <p className="text-3xl font-bold">{mockUser.completedGoals}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Progress */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span>Goal Progress</span>
                  </CardTitle>
                  <Link to="/goals">
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentGoals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                      <span className="text-sm font-medium text-purple-600">{goal.progress}%</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    <Progress value={goal.progress} className="h-2 bg-white">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full" 
                           style={{ width: `${goal.progress}%` }} />
                    </Progress>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      <span className="text-xs font-medium text-purple-600">{goal.category}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Journal Entry */}
            {recentJournalEntry && (
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-xl">
                      <BookOpen className="w-5 h-5 text-pink-600" />
                      <span>Latest Journal Entry</span>
                    </CardTitle>
                    <Link to="/journal">
                      <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                        View All <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl border border-pink-100">
                    <h3 className="font-semibold text-gray-800 mb-2">{recentJournalEntry.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {recentJournalEntry.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                          {recentJournalEntry.mood}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(recentJournalEntry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Heart className="w-3 h-3" />
                        <span>{recentJournalEntry.likes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Daily Habits */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Today's Habits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockHabits.slice(0, 3).map((habit) => {
                  const isCompleted = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
                  return (
                    <div key={habit.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 hover:border-blue-400'
                        }`}>
                          {isCompleted && (
                            <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{habit.name}</p>
                          <p className="text-xs text-gray-500">{habit.streak} day streak</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Link to="/habits">
                  <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700 mt-2">
                    View All Habits <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/goals">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Goal
                  </Button>
                </Link>
                <Link to="/journal">
                  <Button variant="outline" className="w-full border-pink-200 text-pink-600 hover:bg-pink-50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Write Journal Entry
                  </Button>
                </Link>
                <Link to="/vision-board">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-2" />
                    Update Vision Board
                  </Button>
                </Link>
                <Link to="/gratitude">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                    <Heart className="w-4 h-4 mr-2" />
                    Add Gratitude Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Sparkles className="w-5 h-5" />
                  <span>Community Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Total Members</span>
                  <span className="font-bold">{mockStats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Goals Achieved</span>
                  <span className="font-bold">{mockStats.goalsAchieved.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Success Stories</span>
                  <span className="font-bold">{mockStats.successStories.toLocaleString()}</span>
                </div>
                <Link to="/community">
                  <Button variant="ghost" className="w-full text-white hover:bg-white/20 mt-3">
                    Join Community <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}