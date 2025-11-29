import React, { useState } from 'react';
import { Crown, Star, Shield, Zap } from 'lucide-react';

interface BrandedVerifiedFrameProps {
  children: React.ReactNode;
  variant?: 'pro' | 'premium' | 'verified' | 'elite';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const BrandedVerifiedFrame: React.FC<BrandedVerifiedFrameProps> = ({
  children,
  variant = 'pro',
  size = 'md',
  className = '',
  showBadge = true
}) => {
  const variants = {
    pro: {
      ring: 'ring-4 ring-indigo-400/50',
      glow: 'shadow-lg shadow-indigo-500/25',
      gradient: 'bg-gradient-to-tr from-indigo-400 via-purple-400 to-indigo-500',
      badge: { icon: Crown, color: 'bg-indigo-600', text: 'PRO' }
    },
    premium: {
      ring: 'ring-4 ring-purple-400/50',
      glow: 'shadow-lg shadow-purple-500/25',
      gradient: 'bg-gradient-to-tr from-purple-400 via-pink-400 to-purple-500',
      badge: { icon: Star, color: 'bg-purple-600', text: 'PREMIUM' }
    },
    verified: {
      ring: 'ring-4 ring-green-400/50',
      glow: 'shadow-lg shadow-green-500/25',
      gradient: 'bg-gradient-to-tr from-green-400 via-blue-400 to-green-500',
      badge: { icon: Shield, color: 'bg-green-600', text: 'VERIFIED' }
    },
    elite: {
      ring: 'ring-4 ring-yellow-400/50',
      glow: 'shadow-lg shadow-yellow-500/25',
      gradient: 'bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-500',
      badge: { icon: Zap, color: 'bg-yellow-600', text: 'ELITE' }
    }
  };

  const sizes = {
    sm: { container: 'w-12 h-12', badge: 'w-4 h-4 text-xs', icon: 'h-2 w-2' },
    md: { container: 'w-16 h-16', badge: 'w-5 h-5 text-xs', icon: 'h-3 w-3' },
    lg: { container: 'w-24 h-24', badge: 'w-6 h-6 text-sm', icon: 'h-3 w-3' },
    xl: { container: 'w-32 h-32', badge: 'w-8 h-8 text-sm', icon: 'h-4 w-4' }
  };

  const config = variants[variant];
  const sizeConfig = sizes[size];
  const BadgeIcon = config.badge.icon;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Animated Glow Ring */}
      <div className={`
        absolute inset-0 rounded-full
        ${config.ring} ${config.glow}
        animate-pulse
        ${sizeConfig.container}
      `} />
      
      {/* Gradient Border */}
      <div className={`
        absolute inset-0 rounded-full p-0.5
        ${config.gradient}
        ${sizeConfig.container}
      `}>
        <div className={`
          w-full h-full rounded-full bg-white
          flex items-center justify-center overflow-hidden
        `}>
          {children}
        </div>
      </div>

      {/* Pro Badge */}
      {showBadge && (
        <div className={`
          absolute -top-1 -right-1
          ${config.badge.color} text-white rounded-full
          flex items-center justify-center
          ${sizeConfig.badge}
          shadow-lg animate-bounce
        `}>
          <BadgeIcon className={sizeConfig.icon} />
        </div>
      )}
    </div>
  );
};

interface VerifiedFrameDemoProps {
  className?: string;
}

export const VerifiedFrameDemo: React.FC<VerifiedFrameDemoProps> = ({ className = '' }) => {
  const [selectedVariant, setSelectedVariant] = useState<'pro' | 'premium' | 'verified' | 'elite'>('pro');

  const demoUsers = [
    { name: 'John Pro', variant: 'pro' as const, avatar: '👨‍💻' },
    { name: 'Sarah Premium', variant: 'premium' as const, avatar: '👩‍🎨' },
    { name: 'Mike Verified', variant: 'verified' as const, avatar: '👨‍🚀' },
    { name: 'Lisa Elite', variant: 'elite' as const, avatar: '👩‍💼' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h4 className="font-medium text-purple-800 mb-3">Branded Verified Frames</h4>
        
        {/* Variant Selector */}
        <div className="flex gap-2 mb-4">
          {['pro', 'premium', 'verified', 'elite'].map((variant) => (
            <button
              key={variant}
              onClick={() => setSelectedVariant(variant as any)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedVariant === variant
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {variant.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Size Demonstration */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {['sm', 'md', 'lg', 'xl'].map((size) => (
            <div key={size} className="text-center">
              <div className="mb-2">
                <BrandedVerifiedFrame variant={selectedVariant} size={size as any}>
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    👤
                  </div>
                </BrandedVerifiedFrame>
              </div>
              <div className="text-xs text-gray-600 uppercase font-medium">{size}</div>
            </div>
          ))}
        </div>

        {/* Use Cases Demo */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-800">Use Cases:</h5>
          
          {/* Profile Header */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <BrandedVerifiedFrame variant="pro" size="lg">
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                  👨‍💻
                </div>
              </BrandedVerifiedFrame>
              <div>
                <h6 className="font-semibold text-gray-800">John Doe</h6>
                <p className="text-sm text-gray-600">Pro Developer</p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs text-indigo-600 font-medium">PRO MEMBER</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Profile Header Example</div>
          </div>

          {/* Post Author */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <BrandedVerifiedFrame variant="premium" size="md">
                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white">
                  👩‍🎨
                </div>
              </BrandedVerifiedFrame>
              <div>
                <h6 className="font-medium text-gray-800">Sarah Wilson</h6>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Just finished an amazing design project! 🎨</p>
            <div className="text-xs text-gray-500 mt-2">Post/Comment Example</div>
          </div>

          {/* Search Results */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h6 className="font-medium text-gray-800 mb-3">Search Results</h6>
            <div className="space-y-2">
              {demoUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-3 py-2 px-3 bg-white rounded border">
                  <BrandedVerifiedFrame variant={user.variant} size="sm">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm">
                      {user.avatar}
                    </div>
                  </BrandedVerifiedFrame>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">Search Results Example</div>
          </div>
        </div>
      </div>
    </div>
  );
};