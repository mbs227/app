import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
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
import { useUser } from '../../hooks/useApi';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const { user, loading: userLoading, refetchUser } = useUser();

  // Email and password validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      await login(formData.email, formData.password);
      await refetchUser(); // Update user state
      toast({
        title: "Welcome to ManifestLife! ✨",
        description: "You're now ready to start your manifestation journey",
        variant: "default",
      });
    } catch (error) {
      const detail = error.message || "Invalid email or password. Please try again.";
      if (error.response?.status === 401) {
        toast({
          title: "Unauthorized",
          description: "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: detail,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (preset) => {
    setIsLoading(true);
    try {
      await login(preset.email, preset.password);
      await refetchUser(); // Update user state
      toast({
        title: "Welcome to ManifestLife! ✨",
        description: `Logged in as ${preset.email}`,
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
    { email: 'sarah@example.com', password: 'password123' },
    { email: 'alex@example.com', password: 'password123' },
    { email: 'emma@example.com', password: 'password123' }
  ];

  useEffect(() => {
    if (user && !userLoading) {
      // Redirect or update UI on successful login (implement redirect logic if needed)
      console.log("Logged in as:", user.email);
    }
  }, [user, userLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4" role="main" aria-label="Login Form">
      <div className="w-full max-w-md space-y-6">
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
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : null}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? 'password-error' : null}
                      />
                      {errors.password && (
                        <p id="password-error" className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                    aria-label="Sign In"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Sign In
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
                  {presetUsers.map((preset, index) => {
                    const [demoLoading, setDemoLoading] = useState(false);
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start border-purple-200 hover:bg-purple-50"
                        onClick={async () => {
                          setDemoLoading(true);
                          try {
                            await handleQuickLogin(preset);
                          } finally {
                            setDemoLoading(false);
                          }
                        }}
                        disabled={isLoading || demoLoading}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {preset.email.split('@')[0].slice(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{preset.email}</div>
                            <div className="text-xs text-gray-500">Demo Account</div>
                          </div>
                          {demoLoading && <Loader className="w-4 h-4 ml-2 animate-spin" />}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>✨ Secure login with your email and password ✨</p>
          <p className="mt-1">Your manifestation journey is private and secure</p>
        </div>
        {user && !userLoading && (
          <div className="text-center text-green-600 mt-4">
            Logged in as: {user.email}
          </div>
        )}
      </div>
    </div>
  );
}
