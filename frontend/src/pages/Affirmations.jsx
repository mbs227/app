import React, { useState } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Edit, 
  Trash2, 
  Filter,
  Search,
  RotateCcw,
  Star,
  Clock,
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
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import { mockAffirmations } from '../mock/mockData';

const categories = ['all', 'Self-Worth', 'Career', 'Health', 'Relationships', 'Abundance', 'Spiritual'];
const frequencies = ['daily', 'morning', 'evening', 'weekly', 'as-needed'];

export default function Affirmations() {
  const [affirmations, setAffirmations] = useState(mockAffirmations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [isMuted, setIsMuted] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState({
    text: '',
    category: '',
    frequency: 'daily',
    isActive: true
  });

  const filteredAffirmations = affirmations.filter(affirmation => {
    const matchesSearch = affirmation.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || affirmation.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const activeAffirmations = filteredAffirmations.filter(a => a.isActive);

  const handleCreateAffirmation = () => {
    if (newAffirmation.text.trim()) {
      const affirmation = {
        id: Date.now().toString(),
        text: newAffirmation.text.trim(),
        category: newAffirmation.category,
        frequency: newAffirmation.frequency,
        isActive: newAffirmation.isActive,
        createdAt: new Date().toISOString()
      };
      setAffirmations([...affirmations, affirmation]);
      setNewAffirmation({
        text: '',
        category: '',
        frequency: 'daily',
        isActive: true
      });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleAffirmationActive = (id) => {
    setAffirmations(affirmations.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const deleteAffirmation = (id) => {
    setAffirmations(affirmations.filter(a => a.id !== id));
  };

  const playAffirmation = (affirmation) => {
    // Mock play functionality - in real app would use Text-to-Speech API
    setCurrentlyPlaying(affirmation.id);
    console.log(`Playing: "${affirmation.text}"`);
    
    // Simulate playback
    setTimeout(() => {
      setCurrentlyPlaying(null);
    }, 3000);
  };

  const playAllAffirmations = () => {
    setIsPlayingAll(true);
    // Mock play all functionality
    console.log('Playing all active affirmations');
    
    setTimeout(() => {
      setIsPlayingAll(false);
    }, activeAffirmations.length * 4000);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Self-Worth': 'bg-purple-100 text-purple-700',
      'Career': 'bg-blue-100 text-blue-700',
      'Health': 'bg-green-100 text-green-700',
      'Relationships': 'bg-pink-100 text-pink-700',
      'Abundance': 'bg-yellow-100 text-yellow-700',
      'Spiritual': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily': return <Star className="w-4 h-4" />;
      case 'morning': return <Clock className="w-4 h-4" />;
      case 'evening': return <Clock className="w-4 h-4" />;
      case 'weekly': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Daily Affirmations ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reprogram your mind with powerful, positive statements that align with your highest self.
          </p>
        </div>

        {/* Audio Controls */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={playAllAffirmations}
                  disabled={activeAffirmations.length === 0 || isPlayingAll}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isPlayingAll ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isPlayingAll ? 'Playing...' : 'Play All Active'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsMuted(!isMuted)}
                  className="border-gray-300"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Speed:</span>
                <div className="w-24">
                  <Slider
                    value={playbackSpeed}
                    onValueChange={setPlaybackSpeed}
                    max={2}
                    min={0.5}
                    step={0.25}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{playbackSpeed[0]}x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search affirmations..."
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
                Create Affirmation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Affirmation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text">Affirmation Text</Label>
                  <Textarea
                    id="text"
                    placeholder="I am worthy of all the abundance life has to offer..."
                    value={newAffirmation.text}
                    onChange={(e) => setNewAffirmation({...newAffirmation, text: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newAffirmation.category} onValueChange={(value) => setNewAffirmation({...newAffirmation, category: value})}>
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
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newAffirmation.frequency} onValueChange={(value) => setNewAffirmation({...newAffirmation, frequency: value})}>
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
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newAffirmation.isActive}
                    onCheckedChange={(checked) => setNewAffirmation({...newAffirmation, isActive: checked})}
                  />
                  <Label htmlFor="active">Make this affirmation active</Label>
                </div>
                <Button onClick={handleCreateAffirmation} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Affirmation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{affirmations.length}</h3>
              <p className="text-purple-100">Total Affirmations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{activeAffirmations.length}</h3>
              <p className="text-green-100">Active Today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{affirmations.filter(a => a.frequency === 'daily').length}</h3>
              <p className="text-pink-100">Daily Practice</p>
            </CardContent>
          </Card>
        </div>

        {/* Affirmations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAffirmations.map((affirmation) => (
            <Card key={affirmation.id} className={`shadow-lg border-0 transition-all duration-300 hover:shadow-xl ${
              affirmation.isActive 
                ? 'bg-white/70 backdrop-blur-sm' 
                : 'bg-gray-50/70 backdrop-blur-sm opacity-60'
            } ${currentlyPlaying === affirmation.id ? 'ring-2 ring-purple-400 ring-opacity-75' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(affirmation.category)}>
                        {affirmation.category}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        {getFrequencyIcon(affirmation.frequency)}
                        <span className="capitalize">{affirmation.frequency}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Switch
                      checked={affirmation.isActive}
                      onCheckedChange={() => toggleAffirmationActive(affirmation.id)}
                    />
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Edit className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-8 w-8"
                      onClick={() => deleteAffirmation(affirmation.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  affirmation.isActive 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100' 
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <blockquote className="text-lg font-medium text-gray-800 italic leading-relaxed">
                    "{affirmation.text}"
                  </blockquote>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created {new Date(affirmation.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playAffirmation(affirmation)}
                    disabled={currentlyPlaying === affirmation.id || !affirmation.isActive}
                    className={`${
                      currentlyPlaying === affirmation.id 
                        ? 'bg-purple-100 border-purple-300 text-purple-700' 
                        : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {currentlyPlaying === affirmation.id ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAffirmations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No affirmations found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first affirmation to start reprogramming your mind!'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Affirmation
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}