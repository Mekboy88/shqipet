
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-[28px]',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <h1 className={`${sizeClasses[size]} font-bold leading-normal font-cinzel ${className}`}>
      <span className="logo-text">
        {Array.from('Shqipet').map((char, i) => (
          <span 
            key={i} 
            className="inline-block hover:text-rose-500 transition-colors"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
}
