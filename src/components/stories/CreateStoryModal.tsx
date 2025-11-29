import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Camera, Video, Music, Palette, Type, Smile, Sparkles, Save, Rocket, Play, Pause, Square, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [selectedElement, setSelectedElement] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [currentStory, setCurrentStory] = useState({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: 'Your Story',
    textStyle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }
  });
  const [isRecording, setIsRecording] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#667eea');
  const [transparency, setTransparency] = useState(80);
  const [textContent, setTextContent] = useState('Tap to add text');
  const [isEditing, setIsEditing] = useState(false);
  
  const storyFrameRef = useRef(null);
  const textElementRef = useRef(null);
  
  const previousPathRef = useRef(location.pathname);
  
  // Close modal when navigation changes
  useEffect(() => {
    if (isOpen && location.pathname !== previousPathRef.current) {
      onClose();
    }
    previousPathRef.current = location.pathname;
  }, [location.pathname, isOpen, onClose]);

  const quickMusicTracks = [
    { id: 'summer-vibes', title: 'Summer Vibes', artist: 'Upbeat Track' },
    { id: 'chill-beats', title: 'Chill Beats', artist: 'Relaxing Sounds' },
    { id: 'dance-hit', title: 'Dance Hit', artist: 'Electronic' },
    { id: 'pop-anthem', title: 'Pop Anthem', artist: 'Top Charts' },
    { id: 'lo-fi', title: 'Lo-Fi Study', artist: 'Ambient' }
  ];

  const backgroundGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  ];

  const textStyles = [
    { name: 'Bold', style: { fontWeight: 'bold', fontSize: '32px' } },
    { name: 'Italic', style: { fontStyle: 'italic', fontSize: '28px' } },
    { name: 'Outline', style: { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', fontSize: '30px' } },
    { name: 'Shadow', style: { textShadow: '3px 3px 6px rgba(0,0,0,0.5)', fontSize: '28px' } },
    { name: 'Glow', style: { textShadow: '0 0 10px rgba(255,255,255,0.8)', fontSize: '30px' } }
  ];

  const applyBackground = (gradient) => {
    setCurrentStory(prev => ({ ...prev, background: gradient }));
  };

  const applyTextStyle = (style) => {
    setCurrentStory(prev => ({
      ...prev,
      textStyle: { ...prev.textStyle, ...style }
    }));
  };

  const applyCustomColor = () => {
    const alpha = transparency / 100;
    const color = customColor + Math.round(alpha * 255).toString(16).padStart(2, '0');
    applyBackground(color);
    setShowColorPicker(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setTextContent(e.target.value);
    setCurrentStory(prev => ({ ...prev, text: e.target.value }));
  };

  const handleTextBlur = () => {
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        fullScreen
        className="bg-gray-50 border-none p-0 m-0 w-screen h-screen max-h-screen overflow-hidden"
      >
        {/* Close button */}
        <DialogClose className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 transition-all shadow-lg">
          <X className="w-5 h-5 text-gray-700" />
        </DialogClose>

        <div className="h-screen max-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
          {/* Mobile Layout */}
          <div className="flex flex-col h-full lg:hidden">
            {/* Top Panel - Tools */}
            <div className="bg-gradient-to-b from-white to-gray-50 p-4 border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                <button className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm whitespace-nowrap">
                  <Camera className="w-3 h-3" />
                  Photo
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm whitespace-nowrap">
                  <Video className="w-3 h-3" />
                  Video
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg text-sm whitespace-nowrap">
                  <Type className="w-3 h-3" />
                  Text
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm whitespace-nowrap">
                  <Palette className="w-3 h-3" />
                  Colors
                </button>
                <button className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm whitespace-nowrap">
                  <Music className="w-3 h-3" />
                  Music
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 min-h-0">
              {/* Story Frame */}
              <div 
                ref={storyFrameRef}
                className="w-full max-w-[280px] h-[400px] bg-white rounded-3xl overflow-hidden relative border-4 border-gray-200"
                style={{ 
                  background: currentStory.background,
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }}
              >
                <div className="w-full h-full relative flex items-center justify-center p-4">
                  {isEditing ? (
                    <input
                      ref={textElementRef}
                      type="text"
                      value={textContent}
                      onChange={handleTextChange}
                      onBlur={handleTextBlur}
                      onKeyPress={(e) => e.key === 'Enter' && handleTextBlur()}
                      className="bg-transparent border-none outline-none text-center text-white text-2xl font-bold w-full"
                      style={currentStory.textStyle}
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={handleTextClick}
                      className="cursor-pointer text-center select-none"
                      style={currentStory.textStyle}
                    >
                      {currentStory.text}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Panel - Publish */}
            <div className="bg-gradient-to-b from-white to-gray-50 p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-3 font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl p-3 font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Publish
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-row h-full w-full">
            {/* Left Sidebar - Desktop */}
            <div className="w-80 bg-gradient-to-b from-white to-gray-50 p-6 border-r border-gray-200 overflow-y-auto h-full">
              {/* Media Upload Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Media</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-semibold">Photo</span>
                  </button>
                  <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                    <Video className="w-4 h-4" />
                    <span className="text-sm font-semibold">Video</span>
                  </button>
                </div>

                {/* Recording Controls */}
                <div className="bg-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-center mb-3">
                    <button
                      onClick={toggleRecording}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {isRecording ? 'Recording...' : 'Tap to record'}
                  </p>
                </div>
              </div>

              {/* Background Colors */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-pink-500 to-red-700 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Backgrounds</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {backgroundGradients.map((gradient, index) => (
                    <button
                      key={index}
                      onClick={() => applyBackground(gradient)}
                      className="w-12 h-12 rounded-xl hover:scale-110 transition-transform duration-200 border-2 border-white shadow-lg"
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => setShowColorPicker(true)}
                  className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-3 text-gray-600 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Custom Color
                </button>
              </div>

              {/* Quick Music */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Music</h3>
                </div>
                
                <div className="space-y-2">
                  {quickMusicTracks.slice(0, 3).map((track) => (
                    <div key={track.id} className="bg-white rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{track.title}</p>
                          <p className="text-xs text-gray-500">{track.artist}</p>
                        </div>
                        <Play className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Canvas - Desktop */}
            <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center relative overflow-y-auto h-full min-w-0">
              {/* Music Search */}
              <div className="w-full max-w-md mt-5 z-50 px-4">
                <input
                  type="text"
                  placeholder="Search music..."
                  className="w-full px-4 py-2 text-sm rounded-full bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
              </div>

              {/* Story Frame Container */}
              <div className="flex-1 flex items-center justify-center py-4 min-h-0">
                {/* Story Frame */}
                <div 
                  ref={storyFrameRef}
                  className="w-96 h-[500px] bg-white rounded-3xl overflow-hidden relative border-4 border-gray-200"
                  style={{ 
                    background: currentStory.background,
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                  }}
                >
                  <div className="w-full h-full relative flex items-center justify-center p-4">
                    {isEditing ? (
                      <input
                        ref={textElementRef}
                        type="text"
                        value={textContent}
                        onChange={handleTextChange}
                        onBlur={handleTextBlur}
                        onKeyPress={(e) => e.key === 'Enter' && handleTextBlur()}
                        className="bg-transparent border-none outline-none text-center text-white text-2xl font-bold w-full"
                        style={currentStory.textStyle}
                        autoFocus
                      />
                    ) : (
                      <div
                        onClick={handleTextClick}
                        className="cursor-pointer text-center select-none"
                        style={currentStory.textStyle}
                      >
                        {currentStory.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Desktop */}
            <div className="w-80 bg-gradient-to-b from-white to-gray-50 p-6 border-l border-gray-200 overflow-y-auto h-full">
              {/* Typography */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-700 rounded-lg flex items-center justify-center">
                    <Type className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Typography</h3>
                </div>
                
                <div className="space-y-2">
                  {textStyles.map((style, index) => (
                    <button
                      key={index}
                      onClick={() => applyTextStyle(style.style)}
                      className="w-full text-left p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 border hover:border-purple-200"
                    >
                      <span style={style.style} className="text-gray-800">
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-yellow-500 to-orange-700 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Effects</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-white p-3 rounded-xl hover:shadow-md transition-shadow text-center">
                    <Smile className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                    <span className="text-xs text-gray-600">Emoji</span>
                  </button>
                  <button className="bg-white p-3 rounded-xl hover:shadow-md transition-shadow text-center">
                    <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                    <span className="text-xs text-gray-600">Sparkle</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => alert('💾 Story saved to drafts!')}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-2xl p-4 font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
                <button 
                  onClick={() => alert('🚀 Story published successfully!')}
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-2xl p-4 font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 w-96 max-w-90vw shadow-2xl">
              <h3 className="text-xl font-bold text-center mb-6">🎨 Custom Background Color</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Choose Color:</label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-full h-12 border border-gray-200 rounded-xl cursor-pointer"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Transparency: {transparency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={transparency}
                  onChange={(e) => setTransparency(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-gray-600 font-semibold hover:bg-gray-50 hover:border-red-400 hover:text-red-400 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={applyCustomColor}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-3 font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Apply Color
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryModal;