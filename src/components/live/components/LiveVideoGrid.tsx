
import React from "react";
import { LiveVideo } from "../types";
import LiveVideoCard from "./LiveVideoCard";

interface LiveVideoGridProps {
  videos: LiveVideo[];
  gridLayout: "1x1" | "2x2" | "3x3" | "4x4";
  getGridClass: () => string;
}

const LiveVideoGrid: React.FC<LiveVideoGridProps> = ({
  videos,
  gridLayout,
  getGridClass
}) => {
  // Determine how many videos to show based on grid layout
  const getVideoCount = () => {
    switch (gridLayout) {
      case "2x2": return 4;
      case "3x3": return 9;
      case "4x4": return 16;
      default: return videos.length;
    }
  };

  return (
    <div className={`grid-container ${getGridClass()}`}>
      {videos.slice(0, Math.min(16, getVideoCount())).map((video) => (
        <div key={video.id} className="grid-item">
          <LiveVideoCard video={video} isGridView={true} />
        </div>
      ))}
    </div>
  );
};

export default LiveVideoGrid;
