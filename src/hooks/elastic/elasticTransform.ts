
export const applyElasticTransform = (
  targetX: number, 
  targetY: number,
  currentStretchX: number,
  currentStretchY: number
) => {
  // Subtle elastic effect with smooth interpolation
  const smoothness = 0.25; // Higher = smoother, more subtle
  const newStretchX = currentStretchX + (targetX - currentStretchX) * smoothness;
  const newStretchY = currentStretchY + (targetY - currentStretchY) * smoothness;
  
  return { currentStretchX: newStretchX, currentStretchY: newStretchY };
};

export const resetElastic = () => {
  // FORCE REMOVE ALL TRANSFORMS FROM ALL ELEMENTS
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const el = element as HTMLElement;
    if (el.style) {
      el.style.removeProperty('transform');
      el.style.removeProperty('scale');
      el.style.removeProperty('zoom');
      el.style.removeProperty('transition');
      el.style.removeProperty('animation');
      el.style.removeProperty('will-change');
    }
  });
  
  console.log('🚫 All transforms removed from all elements');
};
