// DO NOT EDIT — Location & Preferences core (map, offline, geolocation, privacy, sync).

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { registerPMTilesProtocol } from '@/lib/maps/pmtilesProtocol';
import { Wifi, WifiOff, MapPin } from 'lucide-react';

interface LiveMapProps {
  lat?: number;
  lng?: number;
  accuracy?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({ lat, lng, accuracy }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const accuracyCircle = useRef<string | null>(null);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register PMTiles protocol
    registerPMTilesProtocol();

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check WebGL support before initializing map
    const canvas = document.createElement('canvas');
    const webglSupported = !!(
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl') ||
      canvas.getContext('webgl2')
    );

    if (!webglSupported) {
      console.warn('WebGL not supported, map will show fallback');
      return;
    }

    // Check if offline style is available
    const useOfflineStyle = isOfflineReady || !isOnline;
    const styleUrl = useOfflineStyle 
      ? '/maps/offline-style.json'
      : 'https://demotiles.maplibre.org/style.json'; // Fallback to online tiles

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: [lng || 0, lat || 0],
        zoom: lat && lng ? 13 : 2,
        attributionControl: false,
        // Map options without unsupported properties
      });

      // Add attribution control
      map.current.addControl(new maplibregl.AttributionControl({
        compact: true,
      }));

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOfflineReady, isOnline]);

  useEffect(() => {
    if (!map.current || !lat || !lng) return;

    // Update map center
    map.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1000,
    });

    // Add or update marker
    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new maplibregl.Marker({
      color: 'hsl(var(--primary))',
    })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Add accuracy circle if accuracy is provided
    if (accuracy && map.current.isStyleLoaded()) {
      const circleId = 'accuracy-circle';
      
      // Remove existing circle
      if (accuracyCircle.current) {
        if (map.current.getLayer(accuracyCircle.current)) {
          map.current.removeLayer(accuracyCircle.current);
        }
        if (map.current.getSource(accuracyCircle.current)) {
          map.current.removeSource(accuracyCircle.current);
        }
      }

      // Add new accuracy circle
      map.current.addSource(circleId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        },
      });

      map.current.addLayer({
        id: circleId,
        type: 'circle',
        source: circleId,
        paint: {
          'circle-radius': Math.max(accuracy / 10, 5), // Approximate meter to pixel conversion
          'circle-color': 'hsl(var(--primary))',
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-color': 'hsl(var(--primary))',
          'circle-stroke-opacity': 0.3,
        },
      });

      accuracyCircle.current = circleId;
    }
  }, [lat, lng, accuracy]);

  // Check for offline style availability
  useEffect(() => {
    fetch('/maps/offline-style.json')
      .then(() => setIsOfflineReady(true))
      .catch(() => setIsOfflineReady(false));
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg bg-muted/50" />
      
      {/* Fallback content when no location data */}
      {!lat && !lng && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No location data</div>
            <div className="text-xs">Enable location sharing to see your position</div>
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs border">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3 text-green-600" />
            <span className="text-muted-foreground">
              {isOfflineReady ? 'Offline map ready' : 'Using live tiles'}
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 text-orange-600" />
            <span className="text-muted-foreground">
              {isOfflineReady ? 'Offline mode' : 'No connection'}
            </span>
          </>
        )}
      </div>

      {/* Coordinates display */}
      {lat && lng && (
        <div className="absolute bottom-2 right-2 z-10 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs border">
          <div className="text-muted-foreground">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
          {accuracy && (
            <div className="text-muted-foreground text-xs">
              ±{accuracy}m
            </div>
          )}
        </div>
      )}
    </div>
  );
};