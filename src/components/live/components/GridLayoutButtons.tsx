
import React from "react";
import { Video, Grid2X2, Grid3X3 } from "lucide-react";

interface GridLayoutButtonsProps {
  gridLayout: "1x1" | "2x2" | "3x3" | "4x4";
  setGridLayout: (layout: "1x1" | "2x2" | "3x3" | "4x4") => void;
}

const GridLayoutButtons: React.FC<GridLayoutButtonsProps> = ({ 
  gridLayout, 
  setGridLayout 
}) => {
  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => setGridLayout("1x1")} 
        className={`grid-button ${gridLayout === "1x1" ? "active" : ""}`}
        aria-label="Show single stream view"
        title="Single stream view"
      >
        <Video size={16} />
      </button>
      <button 
        onClick={() => setGridLayout("2x2")} 
        className={`grid-button ${gridLayout === "2x2" ? "active" : ""}`}
        aria-label="Show 2x2 grid view"
        title="2x2 grid view"
      >
        <Grid2X2 size={16} />
      </button>
      <button 
        onClick={() => setGridLayout("3x3")} 
        className={`grid-button ${gridLayout === "3x3" ? "active" : ""}`}
        aria-label="Show 3x3 grid view"
        title="3x3 grid view"
      >
        <Grid3X3 size={16} />
      </button>
      <button 
        onClick={() => setGridLayout("4x4")} 
        className={`grid-button ${gridLayout === "4x4" ? "active" : ""}`}
        aria-label="Show 4x4 grid view"
        title="4x4 grid view"
      >
        <Grid3X3 size={16} />
      </button>
    </div>
  );
};

export default GridLayoutButtons;
