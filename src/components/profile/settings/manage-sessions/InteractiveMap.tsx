import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
  className?: string;
}

export const InteractiveMap = ({ latitude, longitude, className = '' }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    // Initialize interactive map
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [longitude, latitude],
      zoom: 13,
      attributionControl: false,
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add marker with popup
    const marker = new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat([longitude, latitude])
      .addTo(map);

    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`
        <div class="p-2">
          <p class="text-sm font-semibold">Device Location</p>
          <p class="text-xs text-muted-foreground">${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°</p>
        </div>
      `);

    marker.setPopup(popup);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <p className="text-muted-foreground">No location available</p>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
};
