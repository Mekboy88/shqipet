
/**
 * Utility functions for extracting colors from images and creating gradients
 */

// Enhanced color extraction function that gets more vibrant colors from an image
export const extractColorsFromImage = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']); // Default Facebook colors
        return;
      }
      
      // Set canvas size to a larger dimension for better analysis
      canvas.width = 150;
      canvas.height = 150;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      try {
        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Extract dominant colors using a more sophisticated approach
        const colorMap = new Map<string, number>();
        
        // Sample pixels across the entire image
        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent or very light pixels
          if (alpha < 200 || (r > 230 && g > 230 && b > 230)) {
            continue;
          }
          
          // Group similar colors together (reduce precision for clustering)
          const groupedR = Math.floor(r / 20) * 20;
          const groupedG = Math.floor(g / 20) * 20;
          const groupedB = Math.floor(b / 20) * 20;
          
          const colorKey = `${groupedR},${groupedG},${groupedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Sort colors by frequency and get the most dominant ones
        const sortedColors = Array.from(colorMap.entries())
          .sort(([,a], [,b]) => b - a)
          .slice(0, 6)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          });
        
        console.log('Extracted colors:', sortedColors);
        resolve(sortedColors.length > 0 ? sortedColors : ['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']);
      } catch (error) {
        console.error("Error extracting colors:", error);
        resolve(['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']); // Default Facebook colors
      }
    };
    
    img.onerror = () => {
      console.error("Error loading image for color extraction");
      resolve(['#3B5998', '#8B9DC3', '#DFE3EE', '#F7F7F7']); // Default Facebook colors
    };
    
    img.src = imageUrl;
  });
};

// Helper function to sample colors from image data
const getSampleColors = (data: Uint8ClampedArray): string[] => {
  const colors: string[] = [];
  const step = Math.floor(data.length / 16); // Sample at intervals
  
  for (let i = 0; i < data.length; i += step * 4) {
    if (i + 3 < data.length) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip transparent or white pixels
      if (data[i + 3] < 200 || (r > 240 && g > 240 && b > 240)) {
        continue;
      }
      
      colors.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }
  }
  
  // Remove duplicates and limit to 4 colors
  return [...new Set(colors)].slice(0, 4);
};

// Create background gradient based on cover photo colors
export const createGradientFromColors = (colors: string[]): string => {
  if (colors.length < 2) {
    return 'linear-gradient(90deg, #3B5998 0%, #8B9DC3 50%, #DFE3EE 100%)';
  }
  
  // First color from left side, last color from right side
  const leftColor = colors[0];
  const rightColor = colors[colors.length - 1];
  
  // Create gradient with softer transitions
  const midColor1 = colors[Math.min(1, colors.length - 1)];
  const midColor2 = colors[Math.min(2, colors.length - 1)];
  
  // Facebook style: softer gradient that matches the photo colors
  return `linear-gradient(90deg, ${leftColor} 0%, ${midColor1} 33%, ${midColor2} 66%, ${rightColor} 100%)`;
};
