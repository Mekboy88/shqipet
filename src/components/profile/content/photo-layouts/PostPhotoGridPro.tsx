import React from 'react';
import { MediaItemProps } from './types';

interface PostPhotoGridProProps {
  media: MediaItemProps[];
  gap?: number; // px
  rowHeight?: number; // px
  onMediaClick?: (index: number) => void;
}

// Aspect ratio classifications
type Orientation = 'H' | 'P' | 'S'; // Horizontal, Portrait, Square

interface ClassifiedMedia extends MediaItemProps {
  orientation: Orientation;
  aspectRatio: number;
  index: number;
}

interface GridItem {
  media: ClassifiedMedia;
  colSpan: number;
  rowSpan: number;
  isHero?: boolean;
}

const PostPhotoGridPro: React.FC<PostPhotoGridProProps> = ({
  media,
  gap = 8,
  rowHeight = 160,
  onMediaClick
}) => {
  // Classify media by aspect ratio
  const classifyMedia = (mediaItems: MediaItemProps[]): ClassifiedMedia[] => {
    return mediaItems.map((item, index) => {
      // For now, we'll use a heuristic based on URL or assume square
      // In a real implementation, you'd want to load the image to get dimensions
      const aspectRatio = 1; // Placeholder - would need actual image dimensions
      
      let orientation: Orientation = 'S';
      if (aspectRatio >= 1.15) orientation = 'H';
      else if (aspectRatio <= 0.85) orientation = 'P';
      
      return {
        ...item,
        orientation,
        aspectRatio,
        index
      };
    });
  };

  // Determine grid columns based on count and mix
  const getGridColumns = (count: number, classified: ClassifiedMedia[]): number => {
    if (count === 1) return 1;
    
    if (count === 2) {
      const horizontals = classified.filter(m => m.orientation === 'H').length;
      const portraits = classified.filter(m => m.orientation === 'P').length;
      // Use 3 cols when mix is 1H+1P for better layout
      return (horizontals === 1 && portraits === 1) ? 3 : 2;
    }
    
    if (count === 3) return 3;
    
    if (count === 4) {
      const horizontals = classified.filter(m => m.orientation === 'H').length;
      const portraits = classified.filter(m => m.orientation === 'P').length;
      // Use 4 cols if 2H+2P for optimal layout
      return (horizontals === 2 && portraits === 2) ? 4 : 3;
    }
    
    if (count === 5) return 4;
    
    return 3; // fallback
  };

  // Find most square-ish image for hero selection
  const findHeroCandidate = (classified: ClassifiedMedia[]): ClassifiedMedia | null => {
    const squares = classified.filter(m => m.orientation === 'S');
    if (squares.length === 0) return null;
    
    // Find the most square (closest to 1.0 aspect ratio)
    return squares.reduce((closest, current) => {
      const closestDiff = Math.abs(closest.aspectRatio - 1.0);
      const currentDiff = Math.abs(current.aspectRatio - 1.0);
      return currentDiff < closestDiff ? current : closest;
    });
  };

  // Assign grid spans based on orientation and layout strategy
  const assignGridSpans = (classified: ClassifiedMedia[], columns: number): GridItem[] => {
    const count = classified.length;
    const gridItems: GridItem[] = [];
    
    // Hero logic for counts 3 or 5
    let heroMedia: ClassifiedMedia | null = null;
    if (count === 3 || count === 5) {
      heroMedia = findHeroCandidate(classified);
    }

    classified.forEach((media) => {
      let colSpan = 1;
      let rowSpan = 1;
      let isHero = false;

      // Hero assignment (2×2)
      if (heroMedia && media.index === heroMedia.index && columns >= 2) {
        colSpan = 2;
        rowSpan = 2;
        isHero = true;
      } else {
        // Greedy span assignment
        switch (media.orientation) {
          case 'H': // Horizontal → 2×1
            colSpan = Math.min(2, columns);
            rowSpan = 1;
            break;
          case 'P': // Portrait → 1×2
            colSpan = 1;
            rowSpan = 2;
            break;
          case 'S': // Square → 1×1
            colSpan = 1;
            rowSpan = 1;
            break;
        }
      }

      gridItems.push({
        media,
        colSpan,
        rowSpan,
        isHero
      });
    });

    return gridItems;
  };

  const classified = classifyMedia(media);
  const columns = getGridColumns(media.length, classified);
  const gridItems = assignGridSpans(classified, columns);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridAutoRows: 'min-content',
    gridAutoFlow: 'dense' as const,
    gap: `${gap}px`,
  };

  return (
    <div className="w-full">
      {/* Mobile: Stack vertically */}
      <div className="block sm:hidden space-y-2">
        {gridItems.map((item, idx) => (
          <figure
            key={item.media.index}
            className="relative w-full bg-muted rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ aspectRatio: '16/9' }}
            tabIndex={0}
            onClick={() => onMediaClick?.(item.media.index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMediaClick?.(item.media.index);
              }
            }}
          >
            <img
              src={item.media.url}
              alt={`Media ${item.media.index + 1}`}
              className="w-full h-full object-cover bg-background"
              loading="lazy"
            />
            {item.media.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-2">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                </div>
              </div>
            )}
          </figure>
        ))}
      </div>

      {/* Desktop: CSS Grid Layout */}
      <div className="hidden sm:block" style={gridStyle}>
        {gridItems.map((item) => (
          <figure
            key={item.media.index}
            className="relative w-full bg-muted rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            style={{
              gridColumn: `span ${item.colSpan}`,
              gridRow: `span ${item.rowSpan}`,
              aspectRatio: item.isHero ? '1/1' : item.media.orientation === 'P' ? '9/16' : item.media.orientation === 'H' ? '16/9' : '1/1'
            }}
            tabIndex={0}
            onClick={() => onMediaClick?.(item.media.index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMediaClick?.(item.media.index);
              }
            }}
          >
            <img
              src={item.media.url}
              alt={`Media ${item.media.index + 1} ${item.isHero ? '(featured)' : ''}`}
              className="w-full h-full object-cover bg-background"
              loading="lazy"
            />
            {item.media.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                </div>
              </div>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
};

/*
RECIPE TABLE - Fallback combinations for explicit scenarios:

1 Image:
- 1×1 grid, single card

2 Images:
- 1H+1S: 2×1 grid (H spans 2×1, S spans 1×1)
- 1H+1P: 3×2 grid (H spans 2×1, P spans 1×2) 
- 2H: 2×1 grid (both H span 2×1, stacked)
- 2P: 2×2 grid (both P span 1×2, side by side)
- 2S: 2×1 grid (both S span 1×1)

3 Images:
- 3H: 3×1 grid (all H span 2×1, with dense packing)
- 2H+1P: 3×2 grid (H spans 2×1 each, P spans 1×2)
- 1H+2P: 3×2 grid (H spans 2×1, P spans 1×2 each)
- 3P: 3×2 grid (all P span 1×2)
- 2H+1S: 3×1 grid (H spans 2×1 each, S gets hero 2×2)
- 1H+1P+1S: 3×2 grid (S gets hero 2×2, others normal spans)

4 Images:
- 2H+2P: 4×2 grid (optimal layout)
- 4H: 3×2 grid (H spans 2×1 each, dense packing)
- 4P: 3×2 grid (P spans 1×2 each)
- 3H+1P: 3×2 grid (H spans 2×1, P spans 1×2)
- 1H+3P: 3×2 grid (H spans 2×1, P spans 1×2)

5 Images:
- 5×: 4×3 grid (one S gets hero 2×2, others get orientation spans)
- All orientations mixed use 4-column grid with dense packing
*/

export default PostPhotoGridPro;