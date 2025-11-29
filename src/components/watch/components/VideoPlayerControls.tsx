
import VolumeControl from "./VolumeControl";
import VideoSettingsPanel from "./VideoSettingsPanel";

interface VideoPlayerControlsProps {
  volume: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVolumeChange: (volume: number) => void;
  onPictureInPicture: () => void;
  videoId?: string;
}

export default function VideoPlayerControls({
  volume,
  videoRef,
  onVolumeChange,
  onPictureInPicture,
  videoId = "main-video"
}: VideoPlayerControlsProps) {
  return (
    <div 
      className="absolute bottom-2 right-2 flex gap-2 items-center"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <VolumeControl
        volume={volume}
        videoRef={videoRef}
        onVolumeChange={onVolumeChange}
        videoId={videoId}
      />
      
      <VideoSettingsPanel
        videoRef={videoRef}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPictureInPicture();
        }}
        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
        title="Picture-in-Picture"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          <rect x="14" y="14" width="4" height="4" rx="1"/>
        </svg>
      </button>
    </div>
  );
}
