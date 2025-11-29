
export const addGlobalStyles = () => {
  const styleId = 'prevent-all-scaling-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* PREVENT ALL SCALING AND TRANSFORMS */
    *, *::before, *::after {
      transform: none !important;
      scale: 1 !important;
      zoom: 1 !important;
      will-change: auto !important;
      transition: none !important;
      animation: none !important;
      backface-visibility: visible !important;
      perspective: none !important;
    }
    
    /* CHROME VIDEO FIX: Allow video hardware acceleration */
    video {
      will-change: transform !important;
      -webkit-transform: translateZ(0) !important;
      transform: translateZ(0) !important;
      backface-visibility: hidden !important;
    }
    
    html, body, #root {
      transform: none !important;
      scale: 1 !important;
      zoom: 1 !important;
      width: 100% !important;
      height: 100% !important;
      overflow-x: hidden !important;
      overscroll-behavior: none !important;
      position: relative !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    /* Ensure viewport meta tag behavior */
    html {
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
      text-size-adjust: 100% !important;
    }
    
    /* Remove ALL webkit transforms */
    * {
      -webkit-transform: none !important;
      -moz-transform: none !important;
      -ms-transform: none !important;
      -o-transform: none !important;
    }
    
    /* Force normal scrolling behavior */
    body {
      -webkit-overflow-scrolling: auto !important;
      overflow-scrolling: auto !important;
    }
    
    /* Hide scrollbars but keep scrolling */
    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
      display: none;
    }
  `;
  document.head.appendChild(style);
};

export const removeGlobalStyles = () => {
  const style = document.getElementById('prevent-all-scaling-styles');
  if (style) {
    style.remove();
  }
};
