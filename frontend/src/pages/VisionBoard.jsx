import React, { useState, useRef } from 'react';
import { 
  Eye, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Move, 
  Quote,
  Sparkles,
  Save,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { mockVisionBoard } from '../mock/mockData';

export default function VisionBoard() {
  const [visionBoard, setVisionBoard] = useState(mockVisionBoard);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isAddingAffirmation, setIsAddingAffirmation] = useState(false);
  const [newAffirmation, setNewAffirmation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [draggedImage, setDraggedImage] = useState(null);
  const boardRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString(),
          url: e.target.result,
          title: 'New Image',
          x: Math.random() * 300,
          y: Math.random() * 200
        };
        setVisionBoard({
          ...visionBoard,
          images: [...visionBoard.images, newImage]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrag = (e, imageId) => {
    e.preventDefault();
    setDraggedImage(imageId);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    if (draggedImage && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setVisionBoard({
        ...visionBoard,
        images: visionBoard.images.map(img => 
          img.id === draggedImage 
            ? { ...img, x: Math.max(0, x - 50), y: Math.max(0, y - 50) }
            : img
        )
      });
      setDraggedImage(null);
    }
  };

  const handleImageDoubleClick = (imageId) => {
    const newTitle = prompt('Enter image title:');
    if (newTitle) {
      setVisionBoard({
        ...visionBoard,
        images: visionBoard.images.map(img => 
          img.id === imageId ? { ...img, title: newTitle } : img
        )
      });
    }
  };

  const deleteImage = (imageId) => {
    setVisionBoard({
      ...visionBoard,
      images: visionBoard.images.filter(img => img.id !== imageId)
    });
  };

  const addAffirmation = () => {
    if (newAffirmation.trim()) {
      setVisionBoard({
        ...visionBoard,
        affirmations: [...visionBoard.affirmations, newAffirmation.trim()]
      });
      setNewAffirmation('');
      setIsAddingAffirmation(false);
    }
  };

  const deleteAffirmation = (index) => {
    setVisionBoard({
      ...visionBoard,
      affirmations: visionBoard.affirmations.filter((_, i) => i !== index)
    });
  };

  const saveVisionBoard = () => {
    // Mock save functionality
    console.log('Saving vision board:', visionBoard);
    alert('Vision board saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Vision Board ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize your dreams and manifest your reality through the power of imagery and intention.
          </p>
        </div>

        {/* Board Info */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{visionBoard.title}</CardTitle>
                <p className="text-gray-600">{visionBoard.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={saveVisionBoard}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Toolbar */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                  <Upload className="w-4 h-4" />
                  <span>Add Image</span>
                </div>
              </label>
              
              <Dialog open={isAddingAffirmation} onOpenChange={setIsAddingAffirmation}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                    <Quote className="w-4 h-4 mr-2" />
                    Add Affirmation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Affirmation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="affirmation">Affirmation</Label>
                      <Textarea
                        id="affirmation"
                        placeholder="Enter your powerful affirmation..."
                        value={newAffirmation}
                        onChange={(e) => setNewAffirmation(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button onClick={addAffirmation} className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
                      Add Affirmation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Move className="w-4 h-4" />
                <span>Drag images to reposition them</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision Board Canvas */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div
              ref={boardRef}
              className="relative w-full h-96 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl border-2 border-dashed border-purple-300 overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
            >
              {visionBoard.images.map((image) => (
                <div
                  key={image.id}
                  className="absolute cursor-move group"
                  style={{ left: image.x, top: image.y }}
                  draggable
                  onDragStart={(e) => handleImageDrag(e, image.id)}
                  onDoubleClick={() => handleImageDoubleClick(image.id)}
                >
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-32 h-24 object-cover rounded-lg shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteImage(image.id)}
                        className="text-white hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                      <span className="text-xs bg-white/90 px-2 py-1 rounded-full text-gray-700 font-medium">
                        {image.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {visionBoard.images.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-purple-600 mb-2">Create Your Vision</h3>
                    <p className="text-purple-500">Upload images to start building your vision board</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Affirmations */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Affirmations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionBoard.affirmations.map((affirmation, index) => (
                <div key={index} className="group relative">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <p className="text-gray-700 font-medium italic">"{affirmation}"</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAffirmation(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {visionBoard.affirmations.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Quote className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                  <p className="text-purple-600 font-medium">No affirmations yet</p>
                  <p className="text-purple-500 text-sm">Add powerful affirmations to strengthen your manifestation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Board Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold">{visionBoard.images.length}</h3>
              <p className="text-purple-100">Vision Images</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold">{visionBoard.affirmations.length}</h3>
              <p className="text-pink-100">Affirmations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold">
                {Math.floor((Date.now() - new Date(visionBoard.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </h3>
              <p className="text-blue-100">Days Active</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}