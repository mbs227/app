import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Calendar, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Upload,
  Smile,
  Sun,
  Star,
  Camera,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { mockGratitudeEntries, mockUser } from '../mock/mockData';

const moods = ['all', 'Peaceful', 'Joyful', 'Content', 'Inspired', 'Blessed', 'Grateful', 'Hopeful'];

export default function Gratitude() {
  const [entries, setEntries] = useState(mockGratitudeEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    entries: ['', '', ''],
    mood: '',
    image: ''
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.entries.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const handleCreateEntry = () => {
    if (newEntry.title && newEntry.entries.some(e => e.trim())) {
      const entry = {
        id: Date.now().toString(),
        title: newEntry.title,
        entries: newEntry.entries.filter(e => e.trim()),
        mood: newEntry.mood,
        createdAt: new Date().toISOString(),
        image: newEntry.image
      };
      setEntries([entry, ...entries]);
      setNewEntry({
        title: '',
        entries: ['', '', ''],
        mood: '',
        image: ''
      });
      setIsCreateDialogOpen(false);
    }
  };

  const deleteEntry = (entryId) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEntry({...newEntry, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      'Peaceful': 'bg-blue-100 text-blue-700',
      'Joyful': 'bg-yellow-100 text-yellow-700',
      'Content': 'bg-green-100 text-green-700',
      'Inspired': 'bg-purple-100 text-purple-700',
      'Blessed': 'bg-indigo-100 text-indigo-700',
      'Grateful': 'bg-pink-100 text-pink-700',
      'Hopeful': 'bg-orange-100 text-orange-700'
    };
    return colors[mood] || 'bg-gray-100 text-gray-700';
  };

  const getMoodIcon = (mood) => {
    const icons = {
      'Peaceful': <Sun className="w-4 h-4" />,
      'Joyful': <Smile className="w-4 h-4" />,
      'Content': <Heart className="w-4 h-4" />,
      'Inspired': <Star className="w-4 h-4" />,
      'Blessed': <Sparkles className="w-4 h-4" />,
      'Grateful': <Heart className="w-4 h-4" />,
      'Hopeful': <Sun className="w-4 h-4" />
    };
    return icons[mood] || <Heart className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Gratitude Journal ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cultivate abundance consciousness by celebrating the blessings that surround you every day.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search gratitude entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200"
              />
            </div>
            <Select value={filterMood} onValueChange={setFilterMood}>
              <SelectTrigger className="w-full md:w-48 bg-white/70 backdrop-blur-sm border-purple-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map(mood => (
                  <SelectItem key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Gratitude Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Entry Title</Label>
                  <Input
                    id="title"
                    placeholder="Today's Blessings, Simple Joys, etc."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Three Things I'm Grateful For:</Label>
                  {newEntry.entries.map((entry, index) => (
                    <div key={index}>
                      <Textarea
                        placeholder={`Gratitude #${index + 1}...`}
                        value={entry}
                        onChange={(e) => {
                          const newEntries = [...newEntry.entries];
                          newEntries[index] = e.target.value;
                          setNewEntry({...newEntry, entries: newEntries});
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({...newEntry, mood: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="How are you feeling?" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.slice(1).map(mood => (
                        <SelectItem key={mood} value={mood}>
                          <div className="flex items-center space-x-2">
                            {getMoodIcon(mood)}
                            <span>{mood}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image">Add Photo (Optional)</Label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">Choose Photo</span>
                      </div>
                    </label>
                    {newEntry.image && (
                      <img src={newEntry.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                    )}
                  </div>
                </div>

                <Button onClick={handleCreateEntry} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{entries.length}</h3>
              <p className="text-pink-100">Total Entries</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {Math.floor((Date.now() - new Date(entries[entries.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
              </h3>
              <p className="text-purple-100">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {entries.reduce((sum, entry) => sum + entry.entries.length, 0)}
              </h3>
              <p className="text-blue-100">Gratitudes Shared</p>
            </CardContent>
          </Card>
        </div>

        {/* Gratitude Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(entry.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getMoodColor(entry.mood)}>
                      {getMoodIcon(entry.mood)}
                      <span className="ml-1">{entry.mood}</span>
                    </Badge>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Edit className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {entry.entries.map((gratitude, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed flex-1">{gratitude}</p>
                      </div>
                    ))}
                  </div>
                  
                  {entry.image && (
                    <div className="flex justify-center">
                      <img
                        src={entry.image}
                        alt="Gratitude moment"
                        className="w-full max-w-sm h-64 object-cover rounded-xl shadow-md"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No gratitude entries found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterMood !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your gratitude practice today and watch abundance flow into your life!'
              }
            </p>
            {!searchTerm && filterMood === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Entry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}