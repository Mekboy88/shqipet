import React from 'react';

interface GlobeLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const GlobeLoader: React.FC<GlobeLoaderProps> = ({ 
  size = 'md', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const orbitRadius = {
    sm: '16px',
    md: '24px', 
    lg: '32px',
    xl: '48px'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      <div className="relative" style={{ perspective: '200px' }}>
        {/* Globe Container with 3D rotation */}
        <div 
          className={`relative ${sizeClasses[size]}`}
          style={{ 
            animation: 'globe-rotate 8s linear infinite',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Globe Base with gradient and glow */}
          <div 
            className="absolute inset-0 rounded-full border border-primary/30 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, hsl(200 80% 80% / 0.3), hsl(120 60% 70% / 0.2), hsl(200 90% 85% / 0.4))',
              animation: 'glow-pulse 3s ease-in-out infinite'
            }}
          >
            {/* Animated continents */}
            <div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-600/70 rounded-sm"
              style={{ animation: 'continent-shift 6s ease-in-out infinite' }}
            />
            <div 
              className="absolute top-1/3 right-1/4 w-1.5 h-3 bg-green-500/60 rounded-sm transform -rotate-45"
              style={{ animation: 'continent-shift 6s ease-in-out infinite 1s' }}
            />
            <div 
              className="absolute bottom-1/3 left-1/3 w-2.5 h-1.5 bg-green-600/80 rounded-sm"
              style={{ animation: 'continent-shift 6s ease-in-out infinite 2s' }}
            />
            <div 
              className="absolute bottom-1/4 right-1/3 w-1 h-2 bg-green-500/70 rounded-sm transform rotate-30"
              style={{ animation: 'continent-shift 6s ease-in-out infinite 3s' }}
            />
            
            {/* Dynamic ocean effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 20%, hsl(200 100% 90% / 0.4), transparent 60%), radial-gradient(circle at 70% 80%, hsl(210 100% 85% / 0.3), transparent 50%)'
              }}
            />
            
            {/* Realistic globe highlight */}
            <div 
              className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/60 rounded-full blur-sm"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)'
              }}
            />
            
            {/* Atmosphere glow */}
            <div className="absolute -inset-1 rounded-full bg-blue-400/10 blur-md" />
          </div>
          
          {/* Orbiting satellites with different speeds */}
          <div 
            className="absolute inset-0"
            style={{ 
              animation: 'orbit 12s linear infinite',
              ['--orbit-radius' as any]: orbitRadius[size]
            } as React.CSSProperties}
          >
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary/80 rounded-full shadow-lg transform -translate-x-1/2" />
          </div>
          
          <div 
            className="absolute inset-0"
            style={{ 
              animation: 'orbit 8s linear infinite reverse',
              ['--orbit-radius' as any]: `calc(${orbitRadius[size]} * 0.7)`
            } as React.CSSProperties}
          >
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-amber-400/60 rounded-full transform -translate-x-1/2" />
          </div>
        </div>
        
        {/* Orbiting ring with particles */}
        <div className={`absolute inset-0 ${sizeClasses[size]}`}>
          <div 
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ animation: 'orbit 15s linear infinite' }}
          />
          <div 
            className="absolute inset-0 rounded-full border border-primary/10"
            style={{ 
              animation: 'orbit 20s linear infinite reverse',
              transform: 'scale(1.2)'
            }}
          />
        </div>
      </div>
      
    </div>
  );
};

export default GlobeLoader;