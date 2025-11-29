import React from 'react';
import { Clock, MapPin, Users, Activity } from 'lucide-react';

const OnlineStatusSection: React.FC = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-green-500" />
        Informacione
      </h3>
      
      <div className="space-y-3">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600">Online tani</span>
          </div>
          <span className="text-xs text-gray-400">Aktiv</span>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm text-gray-600">Aktiviteti i fundit</span>
          </div>
          <span className="text-xs text-gray-400">5 min më parë</span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-red-500" />
            <span className="text-sm text-gray-600">Vendndodhja</span>
          </div>
          <span className="text-xs text-blue-600">Prishtinë, Kosovë</span>
        </div>

        {/* Connections Today */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            <span className="text-sm text-gray-600">Lidhje sot</span>
          </div>
          <span className="text-xs font-semibold text-purple-600">12</span>
        </div>

        {/* Profile Views */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-2 text-orange-500" />
            <span className="text-sm text-gray-600">Shikime profili</span>
          </div>
          <span className="text-xs font-semibold text-orange-600">47 sot</span>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-600">156</div>
            <div className="text-xs text-blue-500">Postime</div>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-600">2.3K</div>
            <div className="text-xs text-green-500">Ndjekës</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-600">89</div>
            <div className="text-xs text-purple-500">Duke ndjekur</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineStatusSection;