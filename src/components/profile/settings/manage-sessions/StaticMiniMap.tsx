import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface StaticMiniMapProps {
  latitude?: number;
  longitude?: number;
  className?: string;
}

export const StaticMiniMap = ({ latitude, longitude, className = '' }: StaticMiniMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    // Initialize map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [longitude, latitude],
      zoom: 11,
      interactive: false, // Static map
      attributionControl: false,
    });

    // Add marker
    new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat([longitude, latitude])
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <p className="text-xs text-muted-foreground">No location</p>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
};
