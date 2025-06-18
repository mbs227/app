import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Target, 
  Award, 
  Flame, 
  Edit, 
  Settings, 
  Mail,
  MapPin,
  Link,
  Camera,
  Save,
  TrendingUp,
  Heart,
  Star,
  BookOpen,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockUser, mockGoals, mockJournalEntries, mockHabits } from '../mock/mockData';

export default function Profile() {
  const [user, setUser] = useState({
    ...mockUser,
    bio: 'Passionate manifestor on a journey to create my dream life. Believer in the power of positive thinking and aligned action. 🌟',
    location: 'San Francisco, CA',
    website: 'sarahjohnson.co',
    joinDate: '2024-01-15'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const totalJournalEntries = mockJournalEntries.length;
  const totalHabits = mockHabits.length;
  const averageProgress = Math.round(mockGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockGoals.length);
  const longestStreak = Math.max(...mockHabits.map(h => h.streak));

  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditingProfile(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm({...editForm, avatar: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const getLevel = (totalGoals, completedGoals, streak) => {
    const score = completedGoals * 10 + streak * 2 + totalGoals;
    if (score >= 100) return { name: 'Manifestation Master', color: 'from-yellow-400 to-orange-500', icon: <Award className="w-5 h-5" /> };
    if (score >= 50) return { name: 'Vision Keeper', color: 'from-purple-400 to-pink-500', icon: <Star className="w-5 h-5" /> };
    return { name: 'Rising Star', color: 'from-blue-400 to-indigo-500', icon: <TrendingUp className="w-5 h-5" /> };
  };

  const userLevel = getLevel(user.totalGoals, user.completedGoals, user.streak);

  const achievements = [
    { name: 'First Goal', description: 'Created your first goal', achieved: true, icon: <Target className="w-6 h-6" /> },
    { name: 'Week Warrior', description: '7-day streak achieved', achieved: user.streak >= 7, icon: <Flame className="w-6 h-6" /> },
    { name: 'Goal Crusher', description: 'Completed 5 goals', achieved: user.completedGoals >= 5, icon: <Award className="w-6 h-6" /> },
    { name: 'Journaler', description: 'Written 10 journal entries', achieved: totalJournalEntries >= 10, icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Habit Master', description: '21-day streak achieved', achieved: user.streak >= 21, icon: <Star className="w-6 h-6" /> },
    { name: 'Community Star', description: 'Shared 5 public posts', achieved: false, icon: <Heart className="w-6 h-6" /> }
  ];

  const recentActivity = [
    { type: 'goal', action: 'Updated goal progress', item: 'Launch My Dream Business', time: '2 hours ago' },
    { type: 'journal', action: 'Created journal entry', item: 'Amazing Synchronicity Today!', time: '5 hours ago' },
    { type: 'habit', action: 'Completed habit', item: 'Morning Meditation', time: '1 day ago' },
    { type: 'affirmation', action: 'Added new affirmation', item: 'I am worthy of abundance', time: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar className="w-32 h-32 ring-4 ring-purple-200 shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <label className="absolute -bottom-2 -right-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 shadow-lg">
                      <Camera className="w-5 h-5" />
                    </div>
                  </label>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <Badge className={`bg-gradient-to-r ${userLevel.color} text-white flex items-center space-x-1`}>
                        {userLevel.icon}
                        <span>{userLevel.name}</span>
                      </Badge>
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Flame className="w-4 h-4" />
                        <span className="font-bold">{user.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={editForm.website}
                            onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                          />
                        </div>
                        <Button onClick={handleSaveProfile} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <p className="text-gray-600 mb-4 max-w-2xl">{user.bio}</p>
                
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link className="w-4 h-4" />
                    <span>{user.website}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{user.totalGoals}</h3>
              <p className="text-purple-100 text-sm">Total Goals</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{user.completedGoals}</h3>
              <p className="text-green-100 text-sm">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{totalJournalEntries}</h3>
              <p className="text-pink-100 text-sm">Journal Entries</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{longestStreak}</h3>
              <p className="text-blue-100 text-sm">Longest Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Goal Completion Rate</span>
                    <span className="text-sm font-bold text-purple-600">{Math.round((user.completedGoals / user.totalGoals) * 100)}%</span>
                  </div>
                  <Progress value={(user.completedGoals / user.totalGoals) * 100} className="h-2 bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full" 
                         style={{ width: `${(user.completedGoals / user.totalGoals) * 100}%` }} />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Average Goal Progress</span>
                    <span className="text-sm font-bold text-blue-600">{averageProgress}%</span>
                  </div>
                  <Progress value={averageProgress} className="h-2 bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full" 
                         style={{ width: `${averageProgress}%` }} />
                  </Progress>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Habit Consistency</span>
                    <span className="text-sm font-bold text-green-600">78%</span>
                  </div>
                  <Progress value={78} className="h-2 bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full" 
                         style={{ width: '78%' }} />
                  </Progress>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'goal' ? 'bg-purple-500' :
                        activity.type === 'journal' ? 'bg-pink-500' :
                        activity.type === 'habit' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">"{activity.item}"</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-xl border text-center ${
                      achievement.achieved 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}>
                      <div className={`mx-auto mb-2 ${achievement.achieved ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="text-xs font-semibold text-gray-800">{achievement.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full text-white hover:bg-white/20 justify-start">
                  <Target className="w-4 h-4 mr-3" />
                  Create New Goal
                </Button>
                <Button variant="ghost" className="w-full text-white hover:bg-white/20 justify-start">
                  <BookOpen className="w-4 h-4 mr-3" />
                  Write Journal Entry
                </Button>
                <Button variant="ghost" className="w-full text-white hover:bg-white/20 justify-start">
                  <Eye className="w-4 h-4 mr-3" />
                  Update Vision Board
                </Button>
                <Button variant="ghost" className="w-full text-white hover:bg-white/20 justify-start">
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}