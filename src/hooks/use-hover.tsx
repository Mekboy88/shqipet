
import { useRef, useState, useEffect } from 'react';

interface UseHoverOptions {
  instantToggle?: boolean;
  followCursor?: boolean;
}

const useHover = (options: UseHoverOptions = {}) => {
  const { instantToggle = true, followCursor = false } = options;
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    
    if (!node) {
      return;
    }

    // Direct event handlers without any delay
    const handleMouseEnter = () => {
      // Set hovered state immediately without any delay
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      // Set non-hovered state immediately without any delay
      setIsHovered(false);
    };

    // Add event listeners
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, isHovered };
};

export default useHover;
