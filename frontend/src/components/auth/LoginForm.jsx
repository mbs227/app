import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Sparkles, 
  LogIn,
  UserPlus,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.name);
      toast({
        title: "Welcome to ManifestLife! ✨",
        description: "You're now ready to start your manifestation journey",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (preset) => {
    setIsLoading(true);
    try {
      await login(preset.email, preset.name);
      toast({
        title: "Welcome to ManifestLife! ✨",
        description: `Logged in as ${preset.name}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const presetUsers = [
    { name: 'Sarah Johnson', email: 'sarah@example.com' },
    { name: 'Alex Chen', email: 'alex@example.com' },
    { name: 'Emma Rodriguez', email: 'emma@example.com' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to ManifestLife
            </h1>
            <p className="text-gray-600 mt-2">
              Transform your dreams into reality through the power of intention
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">Start Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Quick Demo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Creating your manifestation space...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Begin My Journey
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="demo" className="space-y-4">
                <p className="text-center text-gray-600 text-sm mb-4">
                  Try ManifestLife instantly with a demo account
                </p>
                
                <div className="space-y-3">
                  {presetUsers.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start border-purple-200 hover:bg-purple-50"
                      onClick={() => handleQuickLogin(preset)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {preset.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{preset.name}</div>
                          <div className="text-xs text-gray-500">{preset.email}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>✨ No passwords required - Just your name and email ✨</p>
          <p className="mt-1">Your manifestation journey is private and secure</p>
        </div>
      </div>
    </div>
  );
}