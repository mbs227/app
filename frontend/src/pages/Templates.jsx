import React, { useState } from 'react';
import { 
  FileText, 
  Play, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Copy,
  Download,
  BookOpen,
  Target,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { mockTemplates } from '../mock/mockData';

export default function Templates() {
  const [templates] = useState(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const startTemplate = (template) => {
    setActiveSession({
      templateId: template.id,
      templateName: template.name,
      currentDay: 1,
      totalDays: template.duration.includes('day') ? parseInt(template.duration) : 1,
      isActive: true,
      startDate: new Date().toISOString()
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification in real app
    console.log('Copied to clipboard:', text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Manifestation Templates ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Proven manifestation methods and step-by-step guides to accelerate your journey to success.
          </p>
        </div>

        {/* Active Session Alert */}
        {activeSession && (
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Active Session: {activeSession.templateName}</h3>
                  <p className="text-green-100">Day {activeSession.currentDay} of {activeSession.totalDays}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{Math.round((activeSession.currentDay / activeSession.totalDays) * 100)}%</div>
                    <div className="text-green-100 text-sm">Complete</div>
                  </div>
                  <Button variant="ghost" className="text-white hover:bg-white/20">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <Progress value={(activeSession.currentDay / activeSession.totalDays) * 100} className="mt-4 bg-green-600">
                <div className="h-full bg-white transition-all duration-300 rounded-full" 
                     style={{ width: `${(activeSession.currentDay / activeSession.totalDays) * 100}%` }} />
              </Progress>
            </CardContent>
          </Card>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 text-gray-800">{template.name}</CardTitle>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-purple-200 text-purple-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {template.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">What you'll learn:</span>
                  <ul className="space-y-1">
                    {template.steps.slice(0, 2).map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{step}</span>
                      </li>
                    ))}
                    {template.steps.length > 2 && (
                      <li className="text-sm text-gray-500">+{template.steps.length - 2} more steps</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>2.3k users</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTemplate(template)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{template.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <p className="text-gray-600 leading-relaxed">{template.description}</p>
                          <div className="flex items-center space-x-4 mt-4">
                            <Badge className={getDifficultyColor(template.difficulty)}>
                              {template.difficulty}
                            </Badge>
                            <Badge variant="outline" className="border-purple-200 text-purple-600">
                              <Clock className="w-3 h-3 mr-1" />
                              {template.duration}
                            </Badge>
                            <Badge variant="outline" className="border-blue-200 text-blue-600">
                              <Target className="w-3 h-3 mr-1" />
                              {template.category}
                            </Badge>
                          </div>
                        </div>

                        <Tabs defaultValue="steps" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="steps">Steps</TabsTrigger>
                            <TabsTrigger value="example">Example</TabsTrigger>
                            <TabsTrigger value="tips">Tips</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="steps" className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                                Step-by-Step Guide
                              </h3>
                              <ol className="space-y-3">
                                {template.steps.map((step, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                                      {index + 1}
                                    </div>
                                    <p className="text-gray-700 flex-1">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="example" className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Example
                              </h3>
                              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                                <p className="text-gray-700 italic">"{template.example}"</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(template.example)}
                                  className="mt-2 text-blue-600 hover:text-blue-700"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Example
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="tips" className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-3 flex items-center">
                                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                                Pro Tips
                              </h3>
                              <ul className="space-y-2">
                                {template.tips.map((tip, index) => (
                                  <li key={index} className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                    <p className="text-gray-700">{tip}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                          <Button 
                            onClick={() => startTemplate(template)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Template
                          </Button>
                          <Button variant="outline" className="border-gray-300">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Goal Manifestation</h3>
              <p className="text-purple-100 mb-4">Templates focused on achieving specific goals and dreams</p>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Explore <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Daily Practices</h3>
              <p className="text-pink-100 mb-4">Simple daily routines to maintain high vibration</p>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Explore <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Advanced Methods</h3>
              <p className="text-blue-100 mb-4">Powerful techniques for experienced manifesters</p>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                Explore <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Template Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  template: '5x55 Method',
                  user: 'Sarah M.',
                  result: 'Manifested dream job in 2 weeks!',
                  rating: 5
                },
                {
                  template: 'Scripting Method',
                  user: 'Mike R.',
                  result: 'Found soulmate using this technique',
                  rating: 5
                },
                {
                  template: '369 Method',
                  user: 'Luna K.',
                  result: 'Doubled my income in 3 months',
                  rating: 5
                }
              ].map((story, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 text-center">
                  <div className="flex justify-center mb-2">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-semibold text-gray-800">{story.template}</h4>
                  <p className="text-sm text-gray-600 my-2">"{story.result}"</p>
                  <p className="text-xs text-gray-500">- {story.user}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}