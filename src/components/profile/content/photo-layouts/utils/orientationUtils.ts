export type MediaOrientation = 'vertical' | 'horizontal' | 'square';

export interface MediaWithOrientation {
  url: string;
  isVideo: boolean;
  width?: number;
  height?: number;
  orientation: MediaOrientation;
}

export const detectOrientation = (width?: number, height?: number): MediaOrientation => {
  if (!width || !height) {
    // Fallback to square if dimensions are not available
    console.log('No dimensions provided, defaulting to square');
    return 'square';
  }
  
  const aspectRatio = width / height;
  console.log(`Detecting orientation: ${width}x${height} = aspect ratio ${aspectRatio.toFixed(2)}`);
  
  if (aspectRatio > 1.1) {
    console.log('→ HORIZONTAL');
    return 'horizontal';
  } else if (aspectRatio < 0.9) {
    console.log('→ VERTICAL');
    return 'vertical';
  } else {
    console.log('→ SQUARE');
    return 'square';
  }
};

export const analyzeMediaOrientations = (media: MediaWithOrientation[]) => {
  const verticalCount = media.filter(m => m.orientation === 'vertical').length;
  const horizontalCount = media.filter(m => m.orientation === 'horizontal').length;
  const squareCount = media.filter(m => m.orientation === 'square').length;
  
  return {
    verticalCount,
    horizontalCount,
    squareCount,
    total: media.length
  };
};

export const getLayoutType = (analysis: ReturnType<typeof analyzeMediaOrientations>): string => {
  const { verticalCount, horizontalCount, squareCount, total } = analysis;
  
  console.log(`📐 Layout Analysis: ${total} total (${verticalCount}V, ${horizontalCount}H, ${squareCount}S)`);
  
  // 1 photo: Single display
  if (total === 1) {
    return 'grid-1';
  }
  
  // 2 photos: 1V+1H, 2V, or 2H
  if (total === 2) {
    if (verticalCount === 1 && horizontalCount === 1) {
      return 'grid-2-1v1h'; // V left 40% / H right 60%
    } else if (verticalCount === 2) {
      return 'grid-2-2v'; // 50/50 columns
    } else {
      return 'grid-2-2h'; // 50/50 rows
    }
  }
  
  // 3 photos: 2V+1H, 2H+1V, 3V only, 3H only
  if (total === 3) {
    if (verticalCount === 2 && horizontalCount === 1) {
      return 'grid-3-2v1h'; // V,V top 50/50; H bottom 100%
    } else if (verticalCount === 1 && horizontalCount === 2) {
      return 'grid-3-2h1v'; // V left 40%; right has two H stacked 60%
    } else if (verticalCount === 3) {
      return 'grid-3-3v'; // Row of three equal columns
    } else {
      return 'grid-3-3h'; // Top H,H 50/50; bottom H 100%
    }
  }
  
  // 4 photos: Clean 2×2 grid
  if (total === 4) {
    return 'grid-4-2v2h'; // Always 2×2 grid
  }
  
  // 5 photos: All combinations
  if (total === 5) {
    if (verticalCount === 3 && horizontalCount === 2) {
      return 'grid-5-3v2h'; // Left 40% with 3 V; right 60% with 2 H
    } else if (verticalCount === 2 && horizontalCount === 3) {
      return 'grid-5-2v3h'; // Left 40% with 2 V; right 60% with 3 H
    } else if (verticalCount === 4 && horizontalCount === 1) {
      return 'grid-5-4v1h'; // Top four V in a row; bottom H 100%
    } else if (verticalCount === 1 && horizontalCount === 4) {
      return 'grid-5-4h1v'; // V left 40%; right side 2×2 H
    } else if (verticalCount === 5) {
      return 'grid-5-5v'; // Left has 2 V; right has 3 V
    } else {
      return 'grid-5-5h'; // Top has 2 H (50/50); bottom has 3 H
    }
  }
  
  // 5+ photos: Use 5-photo layout with +N overlay
  if (total > 5) {
    return 'grid-5-same';
  }
  
  return 'grid-1';
};