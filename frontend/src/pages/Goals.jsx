import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useGoals, useMutation } from '../hooks/useApi';
import { goalsAPI } from '../api/apiService';

export default function Goals() {
  const { goals, loading, refetchGoals } = useGoals();
  const { mutate } = useMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    target_date: ''
  });

  const categories = ['all', 'Career', 'Health', 'Lifestyle', 'Relationships', 'Spiritual', 'Personal'];
  
 const filteredGoals = Array.isArray(goals)
  ? goals.filter(goal => {
      const matchesSearch =
        goal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === 'all' || goal.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  : [];

  const handleCreateGoal = async () => {
    if (newGoal.title && newGoal.description) {
      try {
        await mutate(
          () => goalsAPI.createGoal(newGoal),
          {
            onSuccess: () => {
              setNewGoal({ title: '', description: '', category: '', target_date: '' });
              setIsCreateDialogOpen(false);
              refetchGoals();
            },
            successMessage: "Goal created successfully!"
          }
        );
      } catch (error) {
        console.error('Error creating goal:', error);
      }
    }
  };

  const updateGoalProgress = async (goalId, newProgress) => {
    try {
      await mutate(
        () => goalsAPI.updateGoal(goalId, { progress: newProgress }),
        {
          onSuccess: () => {
            refetchGoals();
          },
          successMessage: "Goal progress updated!"
        }
      );
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await mutate(
        () => goalsAPI.deleteGoal(goalId),
        {
          onSuccess: () => {
            refetchGoals();
          },
          successMessage: "Goal deleted successfully!"
        }
      );
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 50) return 'from-yellow-500 to-amber-500';
    return 'from-purple-500 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Your Goals ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your dreams into reality with focused intention and consistent action.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search goals..."
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
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal in detail"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
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
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateGoal} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <Card key={goal.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-gray-800">{goal.title}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        goal.category === 'Career' ? 'bg-blue-100 text-blue-700' :
                        goal.category === 'Health' ? 'bg-green-100 text-green-700' :
                        goal.category === 'Lifestyle' ? 'bg-purple-100 text-purple-700' :
                        'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {goal.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Edit className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-2">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-purple-600">{goal.progress || 0}%</span>
                  </div>
                  <Progress value={goal.progress || 0} className="h-2 bg-gray-200">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressColor(goal.progress || 0)} transition-all duration-300 rounded-full`}
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </Progress>
                </div>

                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Milestones</span>
                    <div className="space-y-1">
                      {goal.milestones.slice(0, 2).map((milestone) => (
                        <div key={milestone.id} className="flex items-center space-x-2">
                          <CheckCircle className={`w-4 h-4 ${milestone.completed ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className={`text-xs ${milestone.completed ? 'text-green-700' : 'text-gray-500'}`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                      {goal.milestones.length > 2 && (
                        <span className="text-xs text-gray-400">+{goal.milestones.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">
                      Due: {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'No date set'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateGoalProgress(goal.id, Math.min(100, (goal.progress || 0) + 10))}
                      className="text-xs px-2 py-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +10%
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No goals found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first goal to start manifesting your dreams!'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
