import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ManualLocationInputProps {
  onLocationSet: (location: { lat: number; lng: number; city: string; country_code: string }) => void;
}

export const ManualLocationInput: React.FC<ManualLocationInputProps> = ({ onLocationSet }) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Mock geocoding function - in real app would use Google Places API or similar
  const geocodeLocation = async (query: string) => {
    setIsGeocoding(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response for common cities
      const mockLocations: Record<string, any> = {
        'new york': { lat: 40.7128, lng: -74.0060, city: 'New York', country_code: 'US' },
        'london': { lat: 51.5074, lng: -0.1278, city: 'London', country_code: 'GB' },
        'paris': { lat: 48.8566, lng: 2.3522, city: 'Paris', country_code: 'FR' },
        'tirana': { lat: 41.3275, lng: 19.8187, city: 'Tirana', country_code: 'AL' },
        'berlin': { lat: 52.5200, lng: 13.4050, city: 'Berlin', country_code: 'DE' },
      };

      const location = mockLocations[query.toLowerCase()];
      if (location) {
        onLocationSet(location);
        toast.success(`Location set to ${location.city}`);
        setLocationQuery('');
      } else {
        toast.error('Location not found. Try a major city name.');
      }
    } catch (error) {
      toast.error('Failed to geocode location');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationQuery.trim()) {
      geocodeLocation(locationQuery.trim());
    }
  };

  return (
    <div className="space-y-3 border-t pt-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Set location manually
      </Label>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter city or address..."
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!locationQuery.trim() || isGeocoding}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {isGeocoding ? 'Finding...' : 'Set'}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Try: New York, London, Paris, Tirana, Berlin
      </p>
    </div>
  );
};