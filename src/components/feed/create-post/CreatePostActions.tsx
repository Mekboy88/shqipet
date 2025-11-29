import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Video, Sparkles, PenSquare, Film, Mic, Smile, FileUp, ShoppingBag, Palette, MapPin, FileAudio, BarChart2, Clapperboard, Radio } from 'lucide-react';

interface CreatePostActionsProps {
  onFileSelect: () => void;
  onImageSelect: () => void;
  onVideoSelect: () => void;
  onAIAssistant?: () => void;
}

const CreatePostActions: React.FC<CreatePostActionsProps> = ({ onFileSelect, onImageSelect, onVideoSelect, onAIAssistant }) => {
  const topDialogActions = [
    {
      icon: Image,
      text: "Upload Images",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      onClick: onImageSelect
    },
    {
      icon: Video,
      text: "Upload Video", 
      color: "bg-green-100",
      iconColor: "text-green-500",
      onClick: onVideoSelect
    },
    {
      icon: Sparkles,
      text: "Generate Image",
      new: true,
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: PenSquare,
      text: "Generate Post",
      new: true,
      color: "bg-red-100", 
      iconColor: "text-red-600",
      onClick: onAIAssistant
    }
  ];

  const gridDialogActions = [
    {
      icon: Film,
      text: "GIF",
      color: "bg-gray-200",
      iconColor: "text-gray-800"
    },
    {
      icon: Mic,
      text: "Record voice",
      color: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Smile,
      text: "Feelings",
      color: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: FileUp,
      text: "Upload Files",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: ShoppingBag,
      text: "Sell product",
      color: "bg-orange-100",
      iconColor: "text-orange-500"
    },
    {
      icon: Palette,
      text: "Color",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: MapPin,
      text: "Location",
      color: "bg-red-100",
      iconColor: "text-red-500"
    },
    {
      icon: FileAudio,
      text: "Audio Upload",
      color: "bg-cyan-100",
      iconColor: "text-cyan-600"
    },
    {
      icon: BarChart2,
      text: "Create Poll",
      color: "bg-lime-100",
      iconColor: "text-lime-600"
    },
    {
      icon: Clapperboard,
      text: "Upload Reels",
      color: "bg-rose-100",
      iconColor: "text-rose-600"
    }
  ];

  const liveAction = {
    icon: Radio,
    text: "Live",
    color: "bg-red-100",
    iconColor: "text-red-600"
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        {topDialogActions.map(({ icon: Icon, text, new: isNew, iconColor, onClick }) => (
          <Button 
            key={text} 
            variant="secondary" 
            onClick={onClick}
            className="relative flex-1 justify-center h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-800 px-2"
          >
            <Icon className={`h-5 w-5 mr-1.5 ${iconColor ?? ''}`} />
            {text}
            {isNew && <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">NEW</span>}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-y-4 text-center">
        {gridDialogActions.slice(0, 10).map(({ icon: Icon, text, color, iconColor }) => (
          <div key={text} className="flex flex-col items-center cursor-pointer group">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 ${color}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <span className="text-xs mt-1 text-gray-600 font-medium">{text}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center cursor-pointer group">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 ${liveAction.color}`}>
            <liveAction.icon className={`h-5 w-5 ${liveAction.iconColor}`} />
          </div>
          <span className="text-xs mt-1 text-gray-600 font-medium">{liveAction.text}</span>
        </div>
      </div>
    </>
  );
};

export default CreatePostActions;
