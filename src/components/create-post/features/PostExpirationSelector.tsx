import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Infinity, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostExpirationSelectorProps {
  expiration: string | null;
  onExpirationChange: (expiration: string | null) => void;
}

const PostExpirationSelector: React.FC<PostExpirationSelectorProps> = ({ expiration, onExpirationChange }) => {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [customTime, setCustomTime] = useState('');

  const expirationOptions = [
    { value: null, label: 'Never expires', icon: Infinity },
    { value: '1h', label: '1 hour', icon: Clock },
    { value: '24h', label: '24 hours', icon: Clock },
    { value: '7d', label: '7 days', icon: Clock },
    { value: '30d', label: '30 days', icon: Clock },
    { value: '90d', label: '90 days', icon: Clock },
    { value: '1y', label: '1 year', icon: Clock }
  ];

  const formatExpiration = (exp: string | null) => {
    if (!exp || exp === 'never') return 'Never expires';
    
    if (exp.startsWith('custom:')) {
      const customDateTime = exp.replace('custom:', '');
      const date = new Date(customDateTime);
      return `Expires ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    const now = new Date();
    const future = new Date(now);
    
    if (exp.endsWith('h')) {
      future.setHours(now.getHours() + parseInt(exp));
    } else if (exp.endsWith('d')) {
      future.setDate(now.getDate() + parseInt(exp));
    } else if (exp.endsWith('y')) {
      future.setFullYear(now.getFullYear() + parseInt(exp));
    }
    
    return `Expires ${future.toLocaleDateString()} at ${future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleCustomDateSubmit = () => {
    if (customDate && customTime) {
      const [hours, minutes] = customTime.split(':');
      const selectedDate = new Date(customDate);
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      onExpirationChange(`custom:${selectedDate.toISOString()}`);
      setShowCustomDate(false);
      setCustomDate(undefined);
      setCustomTime('');
    }
  };

  const isNeverExpire = !expiration || expiration === 'never';
  const hasExpiration = expiration && expiration !== 'never';

  return (
    <div className="space-y-2">
      {hasExpiration ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <Clock className="w-4 h-4 text-red-600" />
          <span className="text-red-700">{formatExpiration(expiration)}</span>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
          <Infinity className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-medium">Post will never expire</span>
        </div>
      )}

      {showCustomDate && (
        <div className="space-y-2 p-3 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Set Custom Expiration</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-blue-700 mb-1 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm h-10",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-none p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs text-blue-700 mb-1 block">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="text-sm pl-10"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              onClick={handleCustomDateSubmit}
              disabled={!customDate || !customTime}
              size="sm"
              className="flex-1 h-8"
            >
              Set Expiration
            </Button>
            <Button
              onClick={() => {
                setShowCustomDate(false);
                setCustomDate(undefined);
                setCustomTime('');
              }}
              variant="outline"
              size="sm"
              className="flex-1 h-8"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!showCustomDate && (
        <Button
          onClick={() => setShowCustomDate(true)}
          variant="outline"
          size="sm"
          className="w-full h-8 text-sm"
        >
          <Calendar className="w-3 h-3 mr-2" />
          Set Custom Date
        </Button>
      )}
    </div>
  );
};

export default PostExpirationSelector;