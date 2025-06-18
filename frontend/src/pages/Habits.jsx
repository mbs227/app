import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  CheckCircle, 
  Circle, 
  Target, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  Flame,
  Award,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { mockHabits } from '../mock/mockData';

const categories = ['all', 'Spiritual', 'Health', 'Mindfulness', 'Manifestation', 'Personal Growth'];
const frequencies = ['daily', 'weekly', 'monthly'];

export default function Habits() {
  const [habits, setHabits] = useState(mockHabits);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: '',
    frequency: 'daily',
    target: 30
  });

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || habit.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateHabit = () => {
    if (newHabit.name.trim()) {
      const habit = {
        id: Date.now().toString(),
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        category: newHabit.category,
        frequency: newHabit.frequency,
        streak: 0,
        completedDates: [],
        target: newHabit.target,
        progress: 0
      };
      setHabits([...habits, habit]);
      setNewHabit({
        name: '',
        description: '',
        category: '',
        frequency: 'daily',
        target: 30
      });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleHabitCompletion = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        let newCompletedDates;
        let newStreak = habit.streak;
        
        if (isCompleted) {
          // Remove today's completion
          newCompletedDates = habit.completedDates.filter(date => date !== today);
          newStreak = Math.max(0, habit.streak - 1);
        } else {
          // Add today's completion
          newCompletedDates = [...habit.completedDates, today];
          newStreak = habit.streak + 1;
        }
        
        const newProgress = Math.round((newCompletedDates.length / habit.target) * 100);
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
          progress: Math.min(100, newProgress)
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Spiritual': 'bg-purple-100 text-purple-700',
      'Health': 'bg-green-100 text-green-700',
      'Mindfulness': 'bg-blue-100 text-blue-700',
      'Manifestation': 'bg-pink-100 text-pink-700',
      'Personal Growth': 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 21) return '⭐';
    if (streak >= 7) return '💫';
    return '✨';
  };

  const generateCalendar = (habit) => {
    const today = new Date();
    const days = [];
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const isCompleted = habit.completedDates.includes(dateString);
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isCompleted,
        isToday: dateString === today.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Habit Tracker ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build powerful habits that support your manifestation journey and create lasting transformation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white/70 backdrop-blur-sm border-purple-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Habit Name</Label>
                  <Input
                    id="name"
                    placeholder="Morning meditation, daily gratitude..."
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your habit and why it's important..."
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newHabit.category} onValueChange={(value) => setNewHabit({...newHabit, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newHabit.frequency} onValueChange={(value) => setNewHabit({...newHabit, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(frequency => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="target">Target Days</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      max="365"
                      value={newHabit.target}
                      onChange={(e) => setNewHabit({...newHabit, target: parseInt(e.target.value) || 30})}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateHabit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Habit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Habits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHabits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(new Date().toISOString().split('T')[0]);
            const calendar = generateCalendar(habit);
            
            return (
              <Card key={habit.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 text-gray-800">{habit.name}</CardTitle>
                      <p className="text-gray-600 text-sm mb-2">{habit.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(habit.category)}>
                          {habit.category}
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span className="capitalize">{habit.frequency}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                        <Edit className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-8 w-8"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Today's Check */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className="p-0 h-auto hover:bg-transparent"
                      >
                        {isCompletedToday ? (
                          <CheckCircle className="w-8 h-8 text-green-500 hover:text-green-600" />
                        ) : (
                          <Circle className="w-8 h-8 text-gray-400 hover:text-purple-500" />
                        )}
                      </Button>
                      <div>
                        <p className="font-medium text-gray-800">Today's Practice</p>
                        <p className="text-sm text-gray-600">
                          {isCompletedToday ? 'Completed! Great job!' : 'Mark as complete'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Flame className="w-5 h-5" />
                        <span className="font-bold text-lg">{habit.streak}</span>
                      </div>
                      <p className="text-xs text-gray-500">day streak {getStreakEmoji(habit.streak)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Progress ({habit.completedDates.length}/{habit.target})
                      </span>
                      <span className="text-sm font-bold text-purple-600">{habit.progress}%</span>
                    </div>
                    <Progress value={habit.progress} className="h-2 bg-gray-200">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                        style={{ width: `${habit.progress}%` }}
                      />
                    </Progress>
                  </div>

                  {/* Mini Calendar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Last 30 Days</span>
                      <Button variant="ghost" size="sm" className="p-1 h-6 text-xs text-purple-600">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {calendar.slice(-30).map((day, index) => (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                            day.isCompleted
                              ? 'bg-green-500 text-white'
                              : day.isToday
                              ? 'bg-purple-200 text-purple-700 ring-2 ring-purple-400'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          title={`${day.date} - ${day.isCompleted ? 'Completed' : 'Not completed'}`}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{habit.streak}</div>
                      <div className="text-xs text-gray-500">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{habit.completedDates.length}</div>
                      <div className="text-xs text-gray-500">Total Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{habit.progress}%</div>
                      <div className="text-xs text-gray-500">Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredHabits.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No habits found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first habit to start building positive momentum!'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Habit
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}