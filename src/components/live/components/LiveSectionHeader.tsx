
import React from "react";
import GridLayoutButtons from "./GridLayoutButtons";

interface LiveSectionHeaderProps {
  gridLayout: "1x1" | "2x2" | "3x3" | "4x4";
  setGridLayout: (layout: "1x1" | "2x2" | "3x3" | "4x4") => void;
}

const LiveSectionHeader: React.FC<LiveSectionHeaderProps> = ({
  gridLayout,
  setGridLayout
}) => {
  return (
    <div className="relative z-10 flex items-center justify-end p-0 mb-4 leading-none">
      <GridLayoutButtons 
        gridLayout={gridLayout} 
        setGridLayout={setGridLayout} 
      />
    </div>
  );
};

export default LiveSectionHeader;
