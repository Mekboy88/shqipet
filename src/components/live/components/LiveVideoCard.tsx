
import React from "react";
import { LiveVideo } from "../types";
import { cn } from "@/lib/utils";

interface LiveVideoCardProps {
  video: LiveVideo;
  isGridView?: boolean;
}

const LiveVideoCard: React.FC<LiveVideoCardProps> = ({ video, isGridView = false }) => {
  return (
    <div className="relative rounded-lg overflow-hidden cursor-pointer shadow-sm h-full bg-white live-video-card">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className={`w-full ${isGridView ? 'h-full' : 'h-[200px]'} object-cover live-thumbnail`} 
        />
        
        {/* Smoke shade overlay with lighter edge effect */}
        <div className="absolute inset-0 bg-black bg-opacity-10 smoke-shade"></div>
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 10px 3px rgba(0, 0, 0, 0.2)" }}></div>
        
        {video.isLive && (
          <div 
            className={cn(
              "absolute top-2 left-2 text-white text-xs font-medium px-1.5 py-0.5 rounded-sm live-indicator",
              video.isLive ? "bg-red-500" : "bg-transparent opacity-0"
            )}
          >
            LIVE
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-sm flex items-center">
          <span>{video.views}</span>
        </div>
      </div>
      
      <div className="p-2">
        <h3 className="font-medium text-sm truncate transition-transform duration-200 ease-out hover:scale-105">{video.title}</h3>
        <p className="text-xs text-gray-600 truncate transition-transform duration-200 ease-out hover:scale-105">{video.host}</p>
      </div>
    </div>
  );
};

export default LiveVideoCard;
