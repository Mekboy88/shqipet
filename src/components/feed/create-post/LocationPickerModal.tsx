import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Search, Navigation, Globe, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface LocationData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  placeType: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationData) => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Initialize map with OpenStreetMap style
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [-74.006, 40.7128], // Default to NYC
        zoom: 12
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      return;
    }

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    // Add geolocate control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    });
    
    map.current.addControl(geolocate, 'top-right');

    // Handle map clicks
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      await handleMapClick([lng, lat]);
    });

    // Get user's current location on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          setCurrentLocation(coords);
          map.current?.flyTo({ center: coords, zoom: 14 });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }

    return () => {
      map.current?.remove();
    };
  }, [isOpen]);

  const handleMapClick = async (coordinates: [number, number]) => {
    setIsLoading(true);
    
    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    marker.current = new maplibregl.Marker({
      color: '#8B5CF6'
    })
      .setLngLat(coordinates)
      .addTo(map.current!);

    try {
      // Use Nominatim for reverse geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        const location: LocationData = {
          id: data.place_id?.toString() || `${coordinates[0]}-${coordinates[1]}`,
          name: data.name || data.address?.road || 'Selected Location',
          address: data.display_name,
          coordinates: coordinates,
          placeType: data.type || 'place'
        };
        
        setSelectedLocation(location);
      } else {
        // Fallback for coordinates without specific place data
        const location: LocationData = {
          id: `${coordinates[0]}-${coordinates[1]}`,
          name: 'Selected Location',
          address: `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`,
          coordinates: coordinates,
          placeType: 'coordinates'
        };
        
        setSelectedLocation(location);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Fallback on error
      const location: LocationData = {
        id: `${coordinates[0]}-${coordinates[1]}`,
        name: 'Selected Location',
        address: `${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`,
        coordinates: coordinates,
        placeType: 'coordinates'
      };
      setSelectedLocation(location);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use Nominatim for place search (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const results: LocationData[] = data.map((item: any) => ({
          id: item.place_id?.toString() || item.osm_id?.toString(),
          name: item.name || item.display_name.split(',')[0],
          address: item.display_name,
          coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
          placeType: item.type || 'place'
        }));
        
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSearchResult = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchResults([]);
    setSearchQuery(location.name);
    
    // Fly to location on map
    map.current?.flyTo({
      center: location.coordinates,
      zoom: 15
    });
    
    // Add marker
    if (marker.current) {
      marker.current.remove();
    }
    
    marker.current = new maplibregl.Marker({
      color: '#8B5CF6'
    })
      .setLngLat(location.coordinates)
      .addTo(map.current!);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  const getLocationIcon = (placeType: string) => {
    switch (placeType) {
      case 'poi':
        return <MapPin className="h-4 w-4" />;
      case 'address':
        return <Home className="h-4 w-4" />;
      case 'place':
        return <Globe className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh]">
        <div className="bg-white rounded-2xl shadow-2xl border border-border mx-4 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Add Location</h2>
                <p className="text-sm text-muted-foreground">Choose where this happened</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>


          {/* Content */}
          <div className="flex h-[500px]">
            
            {/* Left Side - Search & Results */}
            <div className="w-1/3 border-border flex flex-col">
              <div className="p-4">
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Search for a place
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search places..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchLocations(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Current Location Button */}
              <div className="px-4 pb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentLocation) {
                      handleMapClick(currentLocation);
                      map.current?.flyTo({ center: currentLocation, zoom: 14 });
                    } else {
                      navigator.geolocation?.getCurrentPosition((position) => {
                        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
                        setCurrentLocation(coords);
                        handleMapClick(coords);
                        map.current?.flyTo({ center: coords, zoom: 14 });
                      });
                    }
                  }}
                  className="w-full justify-start"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Use Current Location
                </Button>
              </div>
              
              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {isLoading && (
                  <div className="p-4 text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                )}
                
                {searchResults.length > 0 && (
                  <div className="space-y-1 p-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => selectSearchResult(result)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                          selectedLocation?.id === result.id ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-muted-foreground">
                            {getLocationIcon(result.placeType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{result.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{result.address}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {searchQuery && !isLoading && searchResults.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No places found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Side - Map */}
            <div className="flex-1 relative">
              <div ref={mapContainer} className="absolute inset-0" />
              
              {/* Map Instructions Overlay */}
              {!selectedLocation && (
                <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm z-10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Click on the map or search to select a location
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Location Preview */}
          {selectedLocation && (
            <div className="p-4 bg-muted/30 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-orange-600">
                    {getLocationIcon(selectedLocation.placeType)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedLocation.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLocation.address}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedLocation.coordinates[1].toFixed(4)}, {selectedLocation.coordinates[0].toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Click on the map or search to select a location
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmLocation}
                disabled={!selectedLocation}
                variant="ghost"
                className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200"
              >
                Add Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPickerModal;