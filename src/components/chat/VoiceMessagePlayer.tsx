import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  duration?: number;
  className?: string;
}

const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({ 
  audioUrl, 
  duration = 0, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-3 bg-muted/30 rounded-lg border ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-primary/20 flex-shrink-0"
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-primary" />
        ) : (
          <Play className="h-4 w-4 text-primary" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        {/* Waveform visualization */}
        <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-1">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-200"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Simple waveform bars */}
          <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted-foreground/30 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: '4px',
                  height: `${Math.sin((currentTime * 2 + i) * 0.5) * 8 + 12}px`,
                  transform: isPlaying ? 'scaleY(1.2)' : 'scaleY(0.8)',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessagePlayer;