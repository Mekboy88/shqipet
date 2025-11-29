import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, Play } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceToTextDictationProps {
  onTextGenerated: (text: string) => void;
}

const VoiceToTextDictation: React.FC<VoiceToTextDictationProps> = ({ onTextGenerated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started', {
        description: 'Speak clearly into your microphone'
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording', {
        description: 'Please check your microphone permissions'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          resolve(base64);
        };
      });
      reader.readAsArrayBuffer(audioBlob);
      const base64Audio = await base64Promise;

      // For demo purposes, simulate speech-to-text
      // In a real app, you'd call a speech-to-text service like OpenAI Whisper
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockText = "This is a sample transcribed text from your voice recording. In a real implementation, this would be the actual transcription from your speech.";
      
      onTextGenerated(mockText);
      toast.success('Speech transcribed successfully!');
      setAudioBlob(null);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className="h-8"
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Voice Input
            </>
          )}
        </Button>

        {audioBlob && !isRecording && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              className="h-8"
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={processAudio}
              disabled={isProcessing}
              className="h-8"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Transcribe'
              )}
            </Button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Recording in progress...</span>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="text-sm text-muted-foreground">
          Audio recorded. Click "Transcribe" to convert to text.
        </div>
      )}
    </div>
  );
};

export default VoiceToTextDictation;