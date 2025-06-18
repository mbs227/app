import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Award,
  Flame,
  Eye,
  BookmarkPlus,
  Send,
  ThumbsUp,
  Star
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockCommunityPosts, mockUser, mockStats } from '../mock/mockData';

const categories = ['all', 'success-story', 'gratitude', 'motivation', 'tips', 'question', 'celebration'];

export default function Community() {
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.tags.includes(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        id: Date.now().toString(),
        author: {
          name: mockUser.name,
          avatar: mockUser.avatar,
          level: 'Rising Star'
        },
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        comments: 0,
        shares: 0,
        timeAgo: 'Just now',
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: []
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', tags: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getCategoryColor = (category) => {
    const colors = {
      'success-story': 'bg-green-100 text-green-700',
      'gratitude': 'bg-pink-100 text-pink-700',
      'motivation': 'bg-orange-100 text-orange-700',
      'tips': 'bg-blue-100 text-blue-700',
      'question': 'bg-purple-100 text-purple-700',
      'celebration': 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getLevelBadge = (level, likes) => {
    if (level === 'Manifestation Master' || likes > 100) {
      return { color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: <Award className="w-4 h-4" /> };
    } else if (level === 'Vision Keeper' || likes > 50) {
      return { color: 'bg-gradient-to-r from-purple-400 to-pink-500', icon: <Star className="w-4 h-4" /> };
    } else {
      return { color: 'bg-gradient-to-r from-blue-400 to-indigo-500', icon: <TrendingUp className="w-4 h-4" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Community ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with like-minded manifesters, share your wins, and inspire each other on this beautiful journey.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2" />
              <h3 className="text-lg font-bold">{mockStats.totalUsers.toLocaleString()}</h3>
              <p className="text-purple-100 text-sm">Members</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-emerald-700 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2" />
              <h3 className="text-lg font-bold">{mockStats.successStories.toLocaleString()}</h3>
              <p className="text-green-100 text-sm">Success Stories</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-6 h-6 mx-auto mb-2" />
              <h3 className="text-lg font-bold">{mockStats.communityPosts.toLocaleString()}</h3>
              <p className="text-pink-100 text-sm">Posts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2" />
              <h3 className="text-lg font-bold">{mockStats.goalsAchieved.toLocaleString()}</h3>
              <p className="text-blue-100 text-sm">Goals Achieved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search community..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 backdrop-blur-sm border-purple-200"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-white/70 backdrop-blur-sm border-purple-200">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter posts" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Share Story
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Share Your Story</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Share your manifestation win or insight..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        placeholder="Tell your story and inspire others..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        rows={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="success-story, gratitude, manifestation..."
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleCreatePost} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Share Story
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post) => {
                const levelBadge = getLevelBadge(post.author.level, post.likes);
                
                return (
                  <Card key={post.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12 ring-2 ring-purple-200">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-800">{post.author.name}</h3>
                            <Badge className={`text-white text-xs ${levelBadge.color} flex items-center space-x-1`}>
                              {levelBadge.icon}
                              <span>{post.author.level}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{post.timeAgo}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      </div>

                      {post.images && post.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} className={getCategoryColor(tag)}>
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className="text-gray-600 hover:text-red-500"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                            <Share2 className="w-4 h-4 mr-2" />
                            {post.shares}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-500">
                            <BookmarkPlus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Be the first to share your manifestation story!'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top Contributors */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Contributors</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Emma Thompson', level: 'Manifestation Master', contributions: 42 },
                  { name: 'Michael Chen', level: 'Vision Keeper', contributions: 28 },
                  { name: 'Luna Rodriguez', level: 'Rising Star', contributions: 19 }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        {contributor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">{contributor.name}</p>
                      <p className="text-xs text-gray-500">{contributor.contributions} posts</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Trending Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['success-story', 'gratitude', 'manifestation', 'vision-board', 'affirmations', 'breakthrough'].map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-purple-50 border-purple-200 text-purple-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Heart className="w-5 h-5" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>🌟 Share authentic manifestation experiences</p>
                <p>💫 Support and uplift fellow manifesters</p>
                <p>✨ Keep discussions positive and inspiring</p>
                <p>🙏 Respect different manifestation approaches</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}