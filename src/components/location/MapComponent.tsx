import React, { useEffect, useRef } from 'react';
import { MapPin, Wifi } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  location: Location | null;
  accuracy?: number;
  isSharing: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  location, 
  accuracy, 
  isSharing 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Placeholder map implementation
  // In a real app, this would integrate with Google Maps or Mapbox
  return (
    <div 
      ref={mapRef}
      className="w-full h-full bg-muted flex items-center justify-center relative"
    >
      {location ? (
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div className="text-sm font-medium">
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>
          {accuracy && (
            <div className="text-xs text-muted-foreground">
              Accuracy: ±{accuracy}m
            </div>
          )}
          {isSharing && (
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
              <Wifi className="h-3 w-3" />
              Live sharing
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No location data</div>
          <div className="text-xs">Enable location sharing to see your position</div>
        </div>
      )}
    </div>
  );
};