import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Edit,
  Trash2,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { mockJournalEntries, mockUser } from '../mock/mockData';

const moods = ['Grateful', 'Excited', 'Peaceful', 'Energized', 'Hopeful', 'Inspired', 'Content', 'Motivated'];
const manifestationMethods = ['Visualization', 'Affirmations', 'Scripting', '5x55 Method', '369 Method', 'Gratitude'];

export default function Journal() {
  const [entries, setEntries] = useState(mockJournalEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    isPublic: false,
    manifestationMethod: '',
    tags: ''
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  const handleCreateEntry = () => {
    if (newEntry.title && newEntry.content) {
      const entry = {
        id: Date.now().toString(),
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        isPublic: newEntry.isPublic,
        likes: 0,
        comments: 0,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        manifestationMethod: newEntry.manifestationMethod,
        images: []
      };
      setEntries([entry, ...entries]);
      setNewEntry({
        title: '',
        content: '',
        mood: '',
        isPublic: false,
        manifestationMethod: '',
        tags: ''
      });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleLike = (entryId) => {
    setEntries(entries.map(entry => 
      entry.id === entryId 
        ? { ...entry, likes: entry.likes + 1 }
        : entry
    ));
  };

  const deleteEntry = (entryId) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood) => {
    const colors = {
      'Grateful': 'bg-green-100 text-green-700',
      'Excited': 'bg-orange-100 text-orange-700',
      'Peaceful': 'bg-blue-100 text-blue-700',
      'Energized': 'bg-yellow-100 text-yellow-700',
      'Hopeful': 'bg-purple-100 text-purple-700',
      'Inspired': 'bg-pink-100 text-pink-700',
      'Content': 'bg-indigo-100 text-indigo-700',
      'Motivated': 'bg-red-100 text-red-700'
    };
    return colors[mood] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Manifestation Journal ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Document your journey, celebrate your wins, and watch your dreams unfold through the power of words.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search entries..."
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
                <SelectItem value="all">All Moods</SelectItem>
                {moods.map(mood => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
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
                <DialogTitle>Create New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your entry a meaningful title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your manifestation experience, insights, or gratitude..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mood">Mood</Label>
                    <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({...newEntry, mood: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map(mood => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="method">Method Used</Label>
                    <Select value={newEntry.manifestationMethod} onValueChange={(value) => setNewEntry({...newEntry, manifestationMethod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {manifestationMethods.map(method => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="success, gratitude, breakthrough, etc."
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newEntry.isPublic}
                    onCheckedChange={(checked) => setNewEntry({...newEntry, isPublic: checked})}
                  />
                  <Label htmlFor="public" className="flex items-center space-x-2">
                    {newEntry.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>Make this entry public</span>
                  </Label>
                </div>
                <Button onClick={handleCreateEntry} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Create Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{entry.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">{formatDate(entry.createdAt)}</span>
                        <div className="flex items-center space-x-1">
                          {entry.isPublic ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500">
                            {entry.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                {entry.images && entry.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {entry.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Entry image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge className={getMoodColor(entry.mood)}>
                    {entry.mood}
                  </Badge>
                  {entry.manifestationMethod && (
                    <Badge variant="outline" className="border-purple-200 text-purple-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {entry.manifestationMethod}
                    </Badge>
                  )}
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-pink-200 text-pink-600">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(entry.id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {entry.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {entry.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-500">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No journal entries found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterMood !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start documenting your manifestation journey!'
              }
            </p>
            {!searchTerm && filterMood === 'all' && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Your First Entry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}