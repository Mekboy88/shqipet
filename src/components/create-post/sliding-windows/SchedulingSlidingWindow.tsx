import React, { useState } from 'react';
import SlidingWindow from './SlidingWindow';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface SchedulingSlidingWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: Date, time: string) => void;
  icon?: React.ReactNode;
}

const SchedulingSlidingWindow: React.FC<SchedulingSlidingWindowProps> = ({
  isOpen,
  onClose,
  onSchedule,
  icon
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('12:00');

  const handleSchedule = () => {
    if (date) {
      onSchedule(date, time);
      onClose();
    }
  };

  return (
    <SlidingWindow
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Post"
      icon={icon}
      className=""
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Choose when you want this post to be published.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Date</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const compareDate = new Date(date);
                compareDate.setHours(0, 0, 0, 0);
                return compareDate < today;
              }}
              className="rounded-md border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Time</label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button 
              onClick={handleSchedule}
              className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 text-foreground font-semibold border-2 border-orange-200"
              disabled={!date}
            >
              Schedule Post
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </SlidingWindow>
  );
};

export default SchedulingSlidingWindow;
