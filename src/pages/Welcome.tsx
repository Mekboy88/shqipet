
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    // Set a timeout to start fading out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 1500); // 1500 milliseconds = 1.5 seconds
    
    // Set a timeout to redirect after fade completes
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true }); // Using replace to prevent back navigation
    }, 2000); // 2000 milliseconds = 2 seconds
    
    // Clean up the timers if the component unmounts
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between bg-facebook-light py-12 px-4 relative"
      style={{ 
        opacity, 
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      {/* Middle section with logo */}
      <div className="mt-32 w-80 h-80">
        <img src="/lovable-uploads/f0d24cdf-3adf-4069-bc29-f253108a873a.png" alt="Shqipet Logo" className="w-full h-full object-contain" />
      </div>
      
      {/* Bottom section with Meta logo and "MetaAlbos" text next to it */}
      <div className="mb-8 flex flex-col items-center">
        <p className="text-gray-500 text-sm mb-2">Krijuar Nga </p>
        <div className="flex items-center">
          <img src="/lovable-uploads/f150e02b-1f4b-4d99-aee1-67004595ab6f.png" alt="Meta Logo" className="w-16 h-auto object-contain" />
          <p className="logo-text">MetaAlbos</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
