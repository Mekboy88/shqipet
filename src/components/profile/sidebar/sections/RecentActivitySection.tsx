import React from 'react';
import { Heart, MessageCircle, Share, UserPlus, Camera, Activity } from 'lucide-react';

const RecentActivitySection: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'like',
      icon: Heart,
      iconColor: 'text-red-500',
      text: 'Pëlqeu një foto',
      time: '2 min më parë',
      bgColor: 'bg-red-50'
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircle,
      iconColor: 'text-blue-500',
      text: 'Komentoi në një postim',
      time: '15 min më parë',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'friend',
      icon: UserPlus,
      iconColor: 'text-green-500',
      text: 'U bë mik me Ana Gashi',
      time: '1 orë më parë',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      type: 'photo',
      icon: Camera,
      iconColor: 'text-purple-500',
      text: 'Shtoi një foto të re',
      time: '3 orë më parë',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'share',
      icon: Share,
      iconColor: 'text-orange-500',
      text: 'Ndau një përmbajtje',
      time: '5 orë më parë',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-500" />
        Aktiviteti i Fundit
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Shiko të gjithë aktivitetin
        </button>
      </div>
    </div>
  );
};

export default RecentActivitySection;